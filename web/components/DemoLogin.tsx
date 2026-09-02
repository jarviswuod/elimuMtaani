"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const DEMO_TEACHER_EMAIL = "demo.teacher+clerk_test@elimumtaani.dev";
const DEMO_STUDENT_EMAIL = "demo.student+clerk_test@elimumtaani.dev";
const DEMO_PASSWORD = "ElimuMtaani-Demo-2026";

type Role = "teacher" | "student";

interface Props {
  role: Role;
  className?: string;
}

export function DemoLogin({ role, className = "" }: Props) {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = role === "teacher" ? DEMO_TEACHER_EMAIL : DEMO_STUDENT_EMAIL;
  const label = role === "teacher" ? "Demo teacher account" : "Demo student account";
  const ready = fetchStatus === "idle" && !busy;

  async function handleClick() {
    if (!ready) return;
    setBusy(true);
    setError(null);
    try {
      const { error: pwErr } = await signIn.password({
        identifier: email,
        password: DEMO_PASSWORD,
      });
      if (pwErr) {
        setError(pwErr.message ?? "Sign-in failed");
        setBusy(false);
        return;
      }
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: async ({ decorateUrl }) => {
            const dest = decorateUrl("/onboarding");
            if (dest.startsWith("http")) {
              window.location.href = dest;
            } else {
              router.push(dest);
            }
          },
        });
      } else {
        setError("Additional step required — contact support.");
        setBusy(false);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
              err !== null &&
              "errors" in err &&
              Array.isArray((err as { errors: unknown[] }).errors)
            ? ((err as { errors: Array<{ message: string }> }).errors[0]?.message ?? "Sign-in failed")
            : "Sign-in failed";
      setError(msg);
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={!ready}
        className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-bold transition-all duration-200 hover:border-secondary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${className}`}
        aria-label={`Sign in as ${label}`}
      >
        {busy ? (
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Signing in…
          </span>
        ) : (
          label
        )}
      </button>
      {error && <p className="text-xs font-bold text-destructive">{error}</p>}
    </div>
  );
}
