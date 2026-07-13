import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Property } from "@/lib/domain";
import { formatEUR } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/admin/biens")({ component: AdminBiens });

function empty(): Partial<Property> {
  return { title: "", description: "", address: "", city: "", postal_code: "", price: 0, surface: null, rooms: null, bedrooms: null, property_type: "appartement", cover_url: "", photos: [], published: false };
}

function AdminBiens() {
  const [items, setItems] = useState<Property[]>([]);
  const [editing, setEditing] = useState<Partial<Property> | null>(null);
  const [busy, setBusy] = useState(false);
  const [photosText, setPhotosText] = useState("");

  const load = () => supabase.from("properties").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems((data ?? []) as Property[]));
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (editing) setPhotosText((editing.photos ?? []).join("\n"));
  }, [editing]);

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    const payload = {
      title: editing.title ?? "",
      description: editing.description ?? "",
      address: editing.address ?? "",
      city: editing.city || null,
      postal_code: editing.postal_code || null,
      price: Number(editing.price) || 0,
      surface: editing.surface ? Number(editing.surface) : null,
      rooms: editing.rooms ? Number(editing.rooms) : null,
      bedrooms: editing.bedrooms ? Number(editing.bedrooms) : null,
      property_type: editing.property_type ?? "appartement",
      cover_url: editing.cover_url || null,
      photos: photosText.split("\n").map((s) => s.trim()).filter(Boolean),
      published: !!editing.published,
    };
    const res = editing.id
      ? await supabase.from("properties").update(payload).eq("id", editing.id)
      : await supabase.from("properties").insert(payload);
    setBusy(false);
    if (res.error) { alert(res.error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce bien ?")) return;
    await supabase.from("properties").delete().eq("id", id);
    load();
  };

  if (editing) {
    return (
      <div>
        <button onClick={() => setEditing(null)} className="text-sm text-muted-foreground">← Retour</button>
        <h1 className="mt-4 font-serif text-3xl">{editing.id ? "Modifier le bien" : "Nouveau bien"}</h1>
        <div className="mt-8 grid max-w-3xl gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input label="Titre" value={editing.title ?? ""} onChange={(v) => setEditing({ ...editing, title: v })} />
            <Field label="Type">
              <select value={editing.property_type ?? "appartement"} onChange={(e) => setEditing({ ...editing, property_type: e.target.value })} className={inputCls}>
                <option value="appartement">Appartement</option>
                <option value="maison">Maison</option>
                <option value="terrain">Terrain</option>
                <option value="local_commercial">Local commercial</option>
              </select>
            </Field>
            <Input label="Adresse" value={editing.address ?? ""} onChange={(v) => setEditing({ ...editing, address: v })} />
            <Input label="Ville" value={editing.city ?? ""} onChange={(v) => setEditing({ ...editing, city: v })} />
            <Input label="Code postal" value={editing.postal_code ?? ""} onChange={(v) => setEditing({ ...editing, postal_code: v })} />
            <Input label="Prix (€)" type="number" value={String(editing.price ?? 0)} onChange={(v) => setEditing({ ...editing, price: Number(v) })} />
            <Input label="Surface (m²)" type="number" value={String(editing.surface ?? "")} onChange={(v) => setEditing({ ...editing, surface: v ? Number(v) : null })} />
            <Input label="Pièces" type="number" value={String(editing.rooms ?? "")} onChange={(v) => setEditing({ ...editing, rooms: v ? Number(v) : null })} />
            <Input label="Chambres" type="number" value={String(editing.bedrooms ?? "")} onChange={(v) => setEditing({ ...editing, bedrooms: v ? Number(v) : null })} />
            <Input label="URL image de couverture" value={editing.cover_url ?? ""} onChange={(v) => setEditing({ ...editing, cover_url: v })} placeholder="https://…" />
          </div>
          <Field label="Photos supplémentaires (une URL par ligne)">
            <textarea rows={4} value={photosText} onChange={(e) => setPhotosText(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea rows={10} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inputCls} />
          </Field>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
            Publié (visible sur le site)
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
        <h1 className="font-serif text-3xl">Biens</h1>
        <button onClick={() => setEditing(empty())} className="border border-foreground bg-foreground px-5 py-2.5 text-xs uppercase tracking-widest text-background">Nouveau bien</button>
      </div>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {items.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">Aucun bien.</div>}
        {items.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <div className="truncate">{p.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{p.published ? "En ligne" : "Hors ligne"} · {formatEUR(p.price)} · {p.city}</div>
            </div>
            <div className="flex gap-4 text-sm">
              <button onClick={() => setEditing(p)} className="text-primary">Éditer</button>
              <button onClick={() => remove(p.id)} className="text-destructive">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputCls = "w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>{children}</label>;
}
function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <Field label={label}><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} /></Field>;
}
