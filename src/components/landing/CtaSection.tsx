"use client";

import { useState, useSyncExternalStore } from "react";
import { trackEvent, Events } from "@/lib/analytics";

function getSnapshot(): string | null {
  try { return localStorage.getItem("orquestra_waitlist_email"); } catch { return null; }
}

function subscribe(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function storeEmail(email: string) {
  try {
    localStorage.setItem("orquestra_waitlist_email", email);
  } catch {}
}

export function CtaSection() {
  const storedEmail = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "confirm" | "submitting" | "success" | "error">(
    storedEmail ? "success" : "idle"
  );
  const [message, setMessage] = useState("");

  function handleGetStarted(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setMessage("Please enter a valid email address.");
      setState("error");
      return;
    }
    setMessage("");
    setState("confirm");
  }

  async function handleConfirm() {
    setState("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: getSourceFromUrl() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      trackEvent(Events.FORM_SUCCESS);
      storeEmail(email.trim());
      setState("success");
    } catch (err) {
      trackEvent(Events.FORM_ERROR);
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  function handleEdit() {
    setState("idle");
    setMessage("");
  }

  return (
    <section className="py-[140px] border-t border-[rgba(255,255,255,0.06)] text-center relative overflow-hidden" id="waitlist">
      <div className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div className="max-w-[1120px] mx-auto px-8 relative z-10">
        <div className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full border border-[rgba(255,255,255,0.10)] bg-surface-2 font-mono text-[11px] font-medium tracking-[0.08em] uppercase text-text-mid mb-6 fade-up">
          <span className="w-[6px] h-[6px] rounded-full bg-green shadow-[0_0_6px_#34d399]" />
          MVP shipping in 2 weeks
        </div>
        <h2 className="font-display text-[clamp(32px,5vw,56px)] font-bold leading-[1.1] tracking-[-0.03em] text-text-hi max-w-[640px] mx-auto mb-5 fade-up">
          Build your first AI workflow<br />in under 3 minutes
        </h2>
        <p className="text-[17px] font-light text-text-mid max-w-[460px] mx-auto mb-10 leading-[1.7] fade-up">
          No backend required. No boilerplate. Visual builder, full execution trace, ships as a local-first app. Join the waitlist and get access the day we ship.
        </p>
        <div className="fade-up">
          {state === "success" ? (
            <div className="flex items-center justify-center gap-2 font-mono text-[13px] text-green">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#34d399" strokeWidth="1.5" />
                <path d="M5 8l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              You&apos;re on the list. We&apos;ll email you when we ship.
            </div>
          ) : state === "confirm" || state === "submitting" ? (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-surface-2 border border-[rgba(255,255,255,0.10)] rounded-[12px] px-6 py-5 max-w-[400px]">
                <p className="text-[13px] text-text-lo mb-2">Confirm your email</p>
                <p className="font-mono text-[15px] text-text-hi font-medium">{email}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleEdit}
                  disabled={state === "submitting"}
                  className="font-body text-[14px] text-text-mid hover:text-text-hi bg-transparent border border-[rgba(255,255,255,0.10)] cursor-pointer px-5 py-[11px] rounded-[8px] hover:bg-surface-2 transition-all disabled:opacity-40"
                >
                  Edit
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={state === "submitting"}
                  className="font-body text-[14px] font-medium text-[#001f25] bg-cyan border-none cursor-pointer px-6 py-[11px] rounded-[8px] hover:opacity-90 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all whitespace-nowrap disabled:opacity-70"
                >
                  {state === "submitting" ? "Joining…" : "Subscribe"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleGetStarted} className="flex items-center justify-center gap-2 flex-wrap mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="font-body text-[14px] text-text-hi bg-surface-2 border border-[rgba(255,255,255,0.10)] rounded-[8px] px-4 py-[11px] w-[280px] max-sm:w-full outline-none transition-all placeholder:text-text-lo focus:border-cyan focus:shadow-[0_0_0_2px_rgba(34,211,238,0.12)]"
                />
                <button
                  type="submit"
                  className="font-body text-[14px] font-medium text-[#001f25] bg-cyan border-none cursor-pointer px-6 py-[11px] rounded-[8px] hover:opacity-90 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all whitespace-nowrap"
                >
                  Get early access
                </button>
              </form>
            </>
          )}
          {message && (
            <p className="text-[13px] text-red mt-2">{message}</p>
          )}
          <p className="text-[12px] text-text-lo font-mono mt-4">No spam. Early access only. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}

function getSourceFromUrl(): string {
  if (typeof window === "undefined") return "direct";
  const params = new URLSearchParams(window.location.search);
  return params.get("utm_source") || params.get("source") || "direct";
}
