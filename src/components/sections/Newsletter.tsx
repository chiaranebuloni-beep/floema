"use client";
import { useState } from "react";
import { Lines } from "../Lines";

type Status = { kind: "idle" | "loading" | "ok" | "error"; message?: string };

export function Newsletter() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), profile: form.get("profile"), consent: form.get("consent") === "on" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus({ kind: "ok", message: "Benvenuto nel mondo FLOEMA. Ti scriveremo presto." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error && err.message ? err.message : "Qualcosa non ha funzionato, riprova." });
    }
  }

  return (
    <section className="section news" data-theme="light">
      <div className="container news__grid">
        <div>
          <div className="section__label" data-fade>
            <span>07</span>
            <span>Community</span>
          </div>
          <Lines as="h2" className="display display--dark" lines={["Benvenuti nel", "mondo FLOEMA."]} />
          <p className="body" data-fade>
            Anteprime delle nuove creazioni, edizioni limitate e il dietro le quinte del laboratorio. Una lettera al mese, niente di più.
          </p>
        </div>

        {status.kind === "ok" ? (
          <p className="news__done" role="status">
            {status.message}
          </p>
        ) : (
          <form className="news__form" onSubmit={onSubmit} data-fade="0.1" noValidate>
            <fieldset className="news__profile">
              <legend className="eyebrow eyebrow--dark">Sono</legend>
              <label>
                <input type="radio" name="profile" value="privato" defaultChecked />
                <span>Un privato</span>
              </label>
              <label>
                <input type="radio" name="profile" value="architetto" />
                <span>Un professionista</span>
              </label>
            </fieldset>
            <label className="field">
              <span className="sr-only">Email</span>
              <input type="email" name="email" placeholder="La tua email" required autoComplete="email" />
              <button type="submit" disabled={status.kind === "loading"} aria-label="Iscriviti">
                {status.kind === "loading" ? "…" : "Iscriviti"}
              </button>
            </label>
            <label className="consent">
              <input type="checkbox" name="consent" required />
              <span>Acconsento al trattamento dei dati personali secondo la privacy policy.</span>
            </label>
            {status.kind === "error" && (
              <p className="news__error" role="alert">
                {status.message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
