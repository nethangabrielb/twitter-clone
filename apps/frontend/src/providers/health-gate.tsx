"use client";

import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { ReactNode, useEffect, useState } from "react";

const HEALTH_URL = "/health";
const REQUEST_TIMEOUT_MS = 10_000;
const BASE_RETRY_DELAY_MS = 2_000;
const MAX_RETRY_DELAY_MS = 3_000;
const MAX_WAIT_MS = 45_000;

type Phase = "loading" | "ready" | "error";

const checkHealth = async (): Promise<boolean> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(HEALTH_URL, {
      signal: controller.signal,
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data?.status === "ok";
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
};

const HealthGate = ({ children }: { children: ReactNode }) => {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;
    const startedAt = Date.now();

    const run = async () => {
      if (cancelled) return;

      if (Date.now() - startedAt > MAX_WAIT_MS) {
        setPhase("error");
        return;
      }

      const healthy = await checkHealth();
      if (cancelled) return;

      if (healthy) {
        setPhase("ready");
        return;
      }

      attempt += 1;
      const delay = Math.min(
        BASE_RETRY_DELAY_MS * attempt,
        MAX_RETRY_DELAY_MS,
      );
      retryTimer = setTimeout(run, delay);
    };

    run();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, []);

  if (phase === "ready") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <Icon width={96} height={96} alt="Chirper Icon" />
      {phase === "loading" && <Spinner className="size-8 text-primary" />}
      <div className="flex flex-col items-center gap-1">
        {phase === "loading" ? (
          <>
            <p className="text-xl font-bold tracking-tight">
              Waking up the server
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              This may take a few seconds on first load.
            </p>
          </>
        ) : (
          <>
            <p className="text-xl font-bold tracking-tight">
              The server is taking longer than expected
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              It may still be waking up. Please refresh the page to try again.
            </p>
          </>
        )}
      </div>
      {phase === "error" && (
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      )}
    </div>
  );
};

export default HealthGate;
