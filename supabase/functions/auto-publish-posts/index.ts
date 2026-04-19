// Edge function: hourly cron — publish Sanity drafts whose publishedAt has passed.
// Sanity "publishing" = copy drafts.<id> → <id> and delete the draft.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SANITY_PROJECT_ID = "ajhhf96y";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SANITY_WRITE_TOKEN = Deno.env.get("SANITY_WRITE_TOKEN");
    if (!SANITY_WRITE_TOKEN) throw new Error("SANITY_WRITE_TOKEN not configured");

    // 1. Find draft posts ready to publish
    const query = encodeURIComponent(
      `*[_type == "post" && _id in path("drafts.**") && defined(publishedAt) && publishedAt <= now()]{ _id, title, publishedAt }`
    );
    const queryUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

    const queryResp = await fetch(queryUrl, {
      headers: { Authorization: `Bearer ${SANITY_WRITE_TOKEN}` },
    });
    if (!queryResp.ok) {
      const t = await queryResp.text();
      throw new Error(`Sanity query failed [${queryResp.status}]: ${t}`);
    }
    const { result: drafts } = (await queryResp.json()) as {
      result: Array<{ _id: string; title: string; publishedAt: string }>;
    };

    if (!drafts || drafts.length === 0) {
      return new Response(JSON.stringify({ published: 0, message: "No drafts ready" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Build mutation: for each draft, createOrReplace published version + delete draft
    const mutations: unknown[] = [];
    for (const d of drafts) {
      const draftId = d._id; // "drafts.xxx"
      const publishedId = draftId.replace(/^drafts\./, "");

      // Fetch full draft document
      const docResp = await fetch(
        `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/doc/${SANITY_DATASET}/${draftId}`,
        { headers: { Authorization: `Bearer ${SANITY_WRITE_TOKEN}` } }
      );
      if (!docResp.ok) {
        console.error(`Failed to fetch draft ${draftId}`);
        continue;
      }
      const { documents } = await docResp.json();
      const draftDoc = documents?.[0];
      if (!draftDoc) continue;

      const publishedDoc = { ...draftDoc, _id: publishedId };
      delete publishedDoc._rev;

      mutations.push({ createOrReplace: publishedDoc });
      mutations.push({ delete: { id: draftId } });
    }

    // 3. Submit mutation
    const mutateResp = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SANITY_WRITE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mutations }),
      }
    );

    if (!mutateResp.ok) {
      const t = await mutateResp.text();
      throw new Error(`Sanity mutate failed [${mutateResp.status}]: ${t}`);
    }

    const result = await mutateResp.json();
    console.log(`Published ${drafts.length} posts`, drafts.map((d) => d.title));

    return new Response(
      JSON.stringify({
        published: drafts.length,
        titles: drafts.map((d) => d.title),
        result,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("auto-publish error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
