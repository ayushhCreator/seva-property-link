// Edge function: generate blog post draft from a topic using Lovable AI
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface GenerateBody {
  topic: string;
  language?: "hindi-english" | "english" | "hindi";
  mode?: "bhumiseva" | "free";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const body = (await req.json()) as GenerateBody;
    if (!body?.topic || typeof body.topic !== "string" || body.topic.length < 3 || body.topic.length > 200) {
      return new Response(JSON.stringify({ error: "Topic must be 3-200 chars" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lang = body.language ?? "hindi-english";
    const langInstruction =
      lang === "english"
        ? "Write in clear English."
        : lang === "hindi"
        ? "Write in Hindi (Devanagari script)."
        : "Write in conversational Hinglish (Hindi-English mix in Roman script) suitable for Indian property owners in Patna/Bihar.";

    const mode = body.mode ?? "bhumiseva";

    const systemPrompt = mode === "free"
      ? `You are an expert SEO blog writer. ${langInstruction} Write on whatever topic the user requests, accurately and helpfully. Generate well-structured, trustworthy content. Always return valid JSON via the provided tool.`
      : `You are an expert SEO blog writer for BhumiSeva — a property documentation service in Patna, India (services: Khatiyan, Mutation, Registry copies, Rent Agreement, Difference Money). ${langInstruction} Generate trustworthy, helpful, well-structured content focused on property owners in Bihar. Always return valid JSON via the provided tool.`;

    const userPrompt = mode === "free"
      ? `Write a complete SEO-optimised blog post for the topic: "${body.topic}".\nRequirements:\n- 800-1200 words\n- 1 H1 (the title), 3-5 H2 sections, optional H3s\n- Accurate, practical, actionable content on the exact topic requested\n- Friendly expert tone\n- Do NOT mention BhumiSeva unless directly relevant to the topic`
      : `Write a complete SEO-optimised blog post for the topic: "${body.topic}".\nRequirements:\n- 800-1200 words\n- 1 H1 (the title), 3-5 H2 sections, optional H3s\n- Practical, actionable advice for property owners in Patna/Bihar\n- Mention BhumiSeva naturally where helpful (don't oversell)\n- Friendly expert tone`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_blog_post",
              description: "Return a structured SEO blog post.",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Catchy, keyword-rich title under 70 chars" },
                  slug: { type: "string", description: "URL slug, lowercase, hyphenated, no special chars" },
                  excerpt: { type: "string", description: "150-160 char meta description" },
                  tags: { type: "array", items: { type: "string" }, description: "3-6 relevant tags" },
                  sections: {
                    type: "array",
                    description: "Ordered article sections",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["h2", "h3", "paragraph"] },
                        text: { type: "string" },
                      },
                      required: ["type", "text"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["title", "slug", "excerpt", "tags", "sections"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_blog_post" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a minute." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in AI response", JSON.stringify(aiJson));
      return new Response(JSON.stringify({ error: "Model did not return structured output" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const generated = JSON.parse(toolCall.function.arguments);

    // Convert sections to Sanity Portable Text blocks
    const portableText = (generated.sections as Array<{ type: string; text: string }>).map((s) => ({
      _type: "block",
      _key: crypto.randomUUID().slice(0, 12),
      style: s.type === "h2" ? "h2" : s.type === "h3" ? "h3" : "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: crypto.randomUUID().slice(0, 12),
          text: s.text,
          marks: [],
        },
      ],
    }));

    return new Response(
      JSON.stringify({
        title: generated.title,
        slug: generated.slug,
        excerpt: generated.excerpt,
        tags: generated.tags,
        body: portableText,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("generate-blog-post error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
