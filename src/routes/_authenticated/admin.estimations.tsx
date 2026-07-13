import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Estimation } from "@/lib/domain";
import { formatDate } from "@/lib/domain";

export const Route = createFileRoute("/_authenticated/admin/estimations")({ component: AdminEstimations });

function AdminEstimations() {
  const [items, setItems] = useState<Estimation[]>([]);
  const [open, setOpen] = useState<Estimation | null>(null);

  const load = () => supabase.from("estimations").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems((data ?? []) as Estimation[]));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("estimations").update({ status }).eq("id", id);
    load();
    if (open?.id === id) setOpen({ ...open, status });
  };

  return (
    <div>
      <h1 className="font-serif text-3xl">Demandes d'estimation</h1>
      <div className="mt-8 divide-y divide-border border-y border-border">
        {items.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">Aucune demande pour le moment.</div>}
        {items.map((e) => (
          <button key={e.id} onClick={() => setOpen(e)} className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:bg-muted/40">
            <div className="min-w-0">
              <div className="truncate">{e.contact_name} — {e.property_type}</div>
              <div className="mt-1 truncate text-xs text-muted-foreground">{e.address}</div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs uppercase tracking-widest ${e.status === "new" ? "text-primary" : "text-muted-foreground"}`}>{e.status}</span>
              <span className="text-xs text-muted-foreground">{formatDate(e.created_at)}</span>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto bg-background p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{open.property_type}</div>
                <h2 className="mt-2 font-serif text-2xl">{open.contact_name}</h2>
                <div className="mt-1 text-sm text-muted-foreground">{open.contact_email}{open.contact_phone && ` · ${open.contact_phone}`}</div>
              </div>
              <button onClick={() => setOpen(null)} className="text-sm text-muted-foreground">Fermer ✕</button>
            </div>
            <div className="mt-6 text-sm">{open.address}</div>
            <div className="mt-2 text-xs text-muted-foreground">Reçu le {formatDate(open.created_at)}</div>
            <div className="mt-6 flex gap-2">
              {["new", "contacted", "closed"].map((s) => (
                <button key={s} onClick={() => updateStatus(open.id, s)} className={`border px-3 py-1 text-xs uppercase tracking-widest ${open.status === s ? "border-foreground bg-foreground text-background" : "border-border"}`}>{s}</button>
              ))}
            </div>
            <div className="mt-8">
              <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Détails saisis</div>
              <dl className="divide-y divide-border border-y border-border">
                {Object.entries(open.details ?? {}).filter(([, v]) => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-4 py-2 text-sm">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="col-span-2">{Array.isArray(v) ? v.join(", ") : String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
