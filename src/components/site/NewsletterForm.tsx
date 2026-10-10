import { useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { subscribeNewsletter } from "@/lib/newsletter";
import { notifyLead } from "@/lib/notify";

const EMAIL = "vdeby@efficity.com";

// Inscription directe dans Brevo ; si Brevo n'est pas encore branché, on prépare un e-mail à Vincent.
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "mail">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("sending");
    void notifyLead({ data: { kind: "newsletter", email, fields: { Page: window.location.pathname } } }).catch(() => {});
    try {
      const r = await subscribeNewsletter({ data: email });
      if (r.ok) { setState("done"); return; }
    } catch {
      // On bascule sur l'e-mail ci-dessous.
    }
    const subject = encodeURIComponent("Inscription à la lettre mensuelle");
    const body = encodeURIComponent(`Bonjour Vincent,\n\nJe souhaite recevoir votre lettre mensuelle sur le marché immobilier à cette adresse : ${email}\n\nMerci.`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setState("mail");
  }

  if (state === "done") {
    return (
      <p className="flex items-start gap-3 text-sm">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-ink"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>
        C'est noté. Vous recevrez la prochaine lettre du marché.
      </p>
    );
  }
  if (state === "mail") {
    return (
      <p className="text-sm opacity-80">
        Votre messagerie s'est ouverte avec un message prêt. Envoyez-le et je vous ajoute à la liste.
        Rien ne s'est ouvert ? Écrivez-moi à <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">{EMAIL}</a>.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "flex gap-2" : "flex flex-col gap-3 sm:flex-row"}>
      <input
        type="email"
        required
        aria-label="Votre adresse e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.fr"
        autoComplete="email"
        className="field flex-1"
      />
      <button type="submit" disabled={state === "sending"} className="btn btn-primary">
        {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Recevoir la lettre"}
      </button>
    </form>
  );
}
