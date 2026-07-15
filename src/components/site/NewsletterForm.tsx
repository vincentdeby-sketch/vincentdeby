import { useState, type FormEvent } from "react";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("ok");
    setEmail("");
  }

  if (status === "ok") {
    return (
      <p className="text-sm text-muted-foreground">
        Merci — votre inscription est enregistrée.
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
        className="flex-1 border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
      />
      <button
        type="submit"
        className="border border-foreground bg-foreground px-5 py-3 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-90"
      >
        S'inscrire
      </button>
    </form>
  );
}
