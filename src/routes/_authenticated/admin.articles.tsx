import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/lib/domain";
import { formatDate } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/admin/articles")({ component: AdminArticles });

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

function empty(): Partial<Article> {
  return { slug: "", title: "", excerpt: "", content: "", cover_url: "", published: false, published_at: null };
}

function AdminArticles() {
  const [items, setItems] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => supabase.from("articles").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems((data ?? []) as Article[]));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    const payload = {
      slug: editing.slug || slugify(editing.title ?? ""),
      title: editing.title ?? "",
      excerpt: editing.excerpt ?? "",
      content: editing.content ?? "",
      cover_url: editing.cover_url || null,
      published: !!editing.published,
      published_at: editing.published ? (editing.published_at ?? new Date().toISOString()) : null,
    };
    const res = editing.id
      ? await supabase.from("articles").update(payload).eq("id", editing.id)
      : await supabase.from("articles").insert(payload);
    setBusy(false);
    if (res.error) { alert(res.error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    await supabase.from("articles").delete().eq("id", id);
    load();
  };

  if (editing) {
    return (
      <div>
        <button onClick={() => setEditing(null)} className="text-sm text-muted-foreground">← Retour</button>
        <h1 className="mt-4 font-serif text-3xl">{editing.id ? "Modifier l'article" : "Nouvel article"}</h1>
        <div className="mt-8 grid max-w-3xl gap-6">
          <Input label="Titre" value={editing.title ?? ""} onChange={(v) => setEditing({ ...editing, title: v, slug: editing.slug || slugify(v) })} />
          <Input label="Slug URL" value={editing.slug ?? ""} onChange={(v) => setEditing({ ...editing, slug: slugify(v) })} />
          <Input label="URL image de couverture" value={editing.cover_url ?? ""} onChange={(v) => setEditing({ ...editing, cover_url: v })} placeholder="https://…" />
          <label className="block">
            <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Chapô</div>
            <textarea rows={2} value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className={inputCls} />
          </label>
          <label className="block">
            <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Contenu</div>
            <textarea rows={16} value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className={inputCls} />
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
            Publié
          </label>
          <div className="flex gap-3">
            <button onClick={save} disabled={busy} className="border border-foreground bg-foreground px-6 py-3 text-xs uppercase tracking-widest text-background disabled:opacity-50">Enregistrer</button>
            <button onClick={() => setEditing(null)} className="px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground">Annuler</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <h1 className="font-serif text-3xl">Actualités</h1>
        <button onClick={() => setEditing(empty())} className="border border-foreground bg-foreground px-5 py-2.5 text-xs uppercase tracking-widest text-background">Nouvel article</button>
      </div>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {items.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">Aucun article.</div>}
        {items.map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <div className="truncate">{a.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{a.published ? "Publié" : "Brouillon"} · {formatDate(a.created_at)}</div>
            </div>
            <div className="flex gap-4 text-sm">
              <button onClick={() => setEditing(a)} className="text-primary">Éditer</button>
              <button onClick={() => remove(a.id)} className="text-destructive">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputCls = "w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground";
function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    </label>
  );
}
