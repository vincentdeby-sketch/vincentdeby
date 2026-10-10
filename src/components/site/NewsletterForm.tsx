import { useState, type FormEvent } from "react";

const EMAIL = "vdeby@efficity.com";

// Pas encore de base d'abonnés : l'inscription passe par un e-mail que le visiteur envoie lui-même.
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    const subject = encodeURIComponent("Inscription à la lettre mensuelle");
    const body = encodeURIComponent(
      `Bonjour Vincent,\n\nJe souhaite recevoir votre lettre mensuelle sur le marché immobilier à cette adresse : ${email}\n\nMerci.`,
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-sm text-muted-foreground">
        Votre messagerie s'est ouverte avec un message prêt. Envoyez-le et je vous ajoute à la liste.
        Rien ne s'est ouvert ? Écrivez-moi à{" "}
        <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">{EMAIL}</a>.
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
        className="field flex-1"
      />
      <button
        type="submit"
        className="btn btn-primary"
      >
        Recevoir la lettre
      </button>
    </form>
  );
}
