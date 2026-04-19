import { useState, useCallback } from 'react';
import type { DocumentActionComponent, DocumentActionProps, SanityDocument } from 'sanity';
import { useDocumentOperation } from 'sanity';
import { useToast } from '@sanity/ui';
import { SparklesIcon, SearchIcon } from '@sanity/icons';

const SUPABASE_URL = 'https://sugyccacairrdxnyoehm.supabase.co';
const SUPABASE_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1Z3ljY2FjYWlycmR4bnlvZWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MzY0NDksImV4cCI6MjA5MTMxMjQ0OX0.rQNoEE6rGdF13HDKly9zQE6m7XTExP0uq2zPt4PIfUw';

interface PortableBlock {
  _type: 'block';
  _key: string;
  style: string;
  markDefs: unknown[];
  children: { _type: 'span'; _key: string; text: string; marks: string[] }[];
}

interface GeneratedPost {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  body: PortableBlock[];
}

function blocksToPlainText(body: unknown): string {
  if (!Array.isArray(body)) return '';
  return body
    .map((b) => {
      if (typeof b !== 'object' || b === null) return '';
      const block = b as { _type?: string; children?: { text?: string }[] };
      if (block._type !== 'block' || !Array.isArray(block.children)) return '';
      return block.children.map((c) => c.text ?? '').join('');
    })
    .filter(Boolean)
    .join('\n\n');
}

interface PatchOp { patch: { execute: (patches: unknown[]) => void } }

export const GenerateWithAIAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<'bhumiseva' | 'free'>('bhumiseva');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const ops = useDocumentOperation(props.id, props.type) as unknown as PatchOp;

  const handleGenerate = useCallback(async () => {
    if (topic.trim().length < 3) {
      toast.push({ status: 'warning', title: 'Topic too short' });
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/generate-blog-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON}`,
        },
        body: JSON.stringify({ topic: topic.trim(), mode }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Generation failed');
      const generated = data as GeneratedPost;

      ops.patch.execute([
        { set: { title: generated.title } },
        { set: { slug: { _type: 'slug', current: generated.slug } } },
        { set: { excerpt: generated.excerpt } },
        { set: { tags: generated.tags } },
        { set: { body: generated.body } },
        { setIfMissing: { publishedAt: new Date().toISOString() } },
      ]);

      toast.push({
        status: 'success',
        title: 'Blog post generated!',
        description: 'Review the draft and publish when ready.',
      });
      setDialogOpen(false);
      setTopic('');
      props.onComplete();
    } catch (err) {
      toast.push({
        status: 'error',
        title: 'Generation failed',
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  }, [topic, mode, ops, toast, props]);

  return {
    label: 'Generate with AI',
    icon: SparklesIcon,
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen && {
      type: 'dialog',
      header: 'Generate Blog Post with AI',
      onClose: () => {
        setDialogOpen(false);
        props.onComplete();
      },
      content: (
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 500 }}>Writing mode</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setMode('bhumiseva')}
              disabled={loading}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: mode === 'bhumiseva' ? '2px solid #28a745' : '1px solid #ccc',
                background: mode === 'bhumiseva' ? '#e9f7ef' : 'white',
                color: mode === 'bhumiseva' ? '#1a7a36' : '#333',
              }}
            >
              🏠 BhumiSeva (property docs)
            </button>
            <button
              type="button"
              onClick={() => setMode('free')}
              disabled={loading}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: mode === 'free' ? '2px solid #28a745' : '1px solid #ccc',
                background: mode === 'free' ? '#e9f7ef' : 'white',
                color: mode === 'free' ? '#1a7a36' : '#333',
              }}
            >
              ✍️ Free (any topic)
            </button>
          </div>
          <p style={{ fontSize: 11, color: '#666', margin: '0 0 4px 0' }}>
            {mode === 'bhumiseva'
              ? 'AI will write about property documentation in Patna and naturally mention BhumiSeva.'
              : 'AI will write on any topic you give — no BhumiSeva branding inserted.'}
          </p>
          <label style={{ fontSize: 13, fontWeight: 500 }}>Blog topic / keyword</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={mode === 'bhumiseva'
              ? 'e.g. How to apply for Khatiyan in Patna online'
              : 'e.g. How Sanity.io helps content teams publish faster'}
            style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: 6, fontSize: 14 }}
            disabled={loading}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              padding: '10px 14px',
              borderRadius: 6,
              border: 'none',
              background: '#28a745',
              color: 'white',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Generating… (15-30s)' : 'Generate Draft'}
          </button>
          <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
            AI will fill in title, body, excerpt, tags. You can edit anything before publishing.
          </p>
        </div>
      ),
    },
  };
};

export const AutofillSeoAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const ops = useDocumentOperation(props.id, props.type) as unknown as PatchOp;
  const doc = (props.draft || props.published) as SanityDocument | null;

  return {
    label: loading ? 'Generating SEO…' : 'Auto-fill SEO',
    icon: SearchIcon,
    disabled: loading || !doc?.body,
    onHandle: async () => {
      if (!doc?.body) {
        toast.push({ status: 'warning', title: 'Write the body first' });
        props.onComplete();
        return;
      }
      setLoading(true);
      try {
        const bodyText = blocksToPlainText(doc.body);
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/seo-autofill`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON}`,
          },
          body: JSON.stringify({ title: doc.title, bodyText }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || 'SEO autofill failed');

        ops.patch.execute([
          { set: { excerpt: data.excerpt } },
          { set: { tags: data.tags } },
        ]);

        toast.push({ status: 'success', title: 'SEO fields filled' });
      } catch (err) {
        toast.push({
          status: 'error',
          title: 'SEO autofill failed',
          description: err instanceof Error ? err.message : 'Unknown error',
        });
      } finally {
        setLoading(false);
        props.onComplete();
      }
    },
  };
};
