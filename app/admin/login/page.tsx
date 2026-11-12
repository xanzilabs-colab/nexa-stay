"use client";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });

      if (response.ok) {
        router.replace("/admin");
        return;
      }

      const result = await response.json();
      setError(result.error ?? "Unable to sign in.");
    } catch {
      setError("We couldn't connect. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login">
      <section className="admin-login-panel" aria-labelledby="admin-login-title">
        <div className="admin-login-art">
          <p className="eyebrow">NEXASTAY WORKSPACE</p>
          <h1>Good stays start with good service.</h1>
          <p>Manage guest enquiries and keep every stay moving smoothly with the NexaStay team.</p>
          <ul>
            <li><CheckCircle2 aria-hidden="true" /> Guest enquiries in one place</li>
            <li><CheckCircle2 aria-hidden="true" /> Clear booking and stay details</li>
            <li><CheckCircle2 aria-hidden="true" /> Quick, thoughtful guest follow-up</li>
          </ul>
          <Link className="admin-login-home" href="/"><ArrowLeft aria-hidden="true" /> Back to NexaStay</Link>
        </div>
        <div className="admin-login-content">
          <form className="admin-login-form" onSubmit={submit}>
            <p className="eyebrow">ADMIN SIGN IN</p>
            <h2 id="admin-login-title">Welcome back</h2>
            <p className="admin-login-description">Sign in to continue to your workspace.</p>
            <label>
              Username
              <input name="username" autoComplete="username" required />
            </label>
            <label>
              Password
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button disabled={busy} className="button navy" type="submit">
              {busy && <LoaderCircle className="button-spinner" size={17} aria-hidden="true" />}
              {busy ? "Signing in..." : "Sign in"}
            </button>
            <p className="admin-login-secure"><ShieldCheck aria-hidden="true" /> Your connection is private and secure.</p>
          </form>
        </div>
      </section>
    </main>
  );
}