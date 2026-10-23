"use client";
import { useState } from "react";

const TO = "info@falegnameriagalli.com";

// Il messaggio viene salvato nel backend (sezione Contatti dell'admin);
// se il backend non è collegato, il modulo prepara il messaggio nel programma di posta dell'utente.
export function ContactForm() {
  const [error, setError] = useState("");
  const [sent, setSent] = useState<"" | "saved" | "mail">("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();
    const professional = f.get("profile") === "professionista";
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !message) {
      setError("Compila nome, email valida e messaggio.");
      return;
    }
    if (f.get("consent") !== "on") {
      setError("Serve il consenso al trattamento dei dati.");
      return;
    }
    setError("");
    setBusy(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, profile: professional ? "professionista" : "privato", consent: true }),
    }).catch(() => null);
    setBusy(false);
    if (res?.ok) {
      form.reset();
      setSent("saved");
      return;
    }
    if (res && res.status === 400) {
      setError((await res.json()).error ?? "Controlla i dati inseriti.");
      return;
    }
    const subject = `FLOEMA — Richiesta da ${name}`;
    const body = `${message}\n\n—\n${name}\n${email}\nProfilo: ${professional ? "Professionista" : "Privato"}`;
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent("mail");
  }

  return (
    <form className="cform" onSubmit={onSubmit} noValidate data-fade="0.1">
      <fieldset className="news__profile">
        <legend className="eyebrow eyebrow--dark">Sono</legend>
        <label>
          <input type="radio" name="profile" value="privato" defaultChecked />
          <span>Un privato</span>
        </label>
        <label>
          <input type="radio" name="profile" value="professionista" />
          <span>Un professionista</span>
        </label>
      </fieldset>
      <label className="cfield">
        <span>Nome e cognome</span>
        <input name="name" autoComplete="name" required />
      </label>
      <label className="cfield">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="cfield">
        <span>Messaggio</span>
        <textarea name="message" rows={5} required />
      </label>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>Acconsento al trattamento dei dati personali secondo la privacy policy.</span>
      </label>
      {error && (
        <p className="news__error" role="alert">
          {error}
        </p>
      )}
      {sent && (
        <p className="cform__sent" role="status">
          {sent === "saved"
            ? "Grazie, abbiamo ricevuto il tuo messaggio. Ti risponderemo al più presto."
            : "Si è aperto il tuo programma di posta con il messaggio pronto da inviare."}
        </p>
      )}
      <div>
        <button type="submit" className="btn btn--solid" disabled={busy}>
          {busy ? "Invio…" : "Invia messaggio"}
        </button>
      </div>
    </form>
  );
}
