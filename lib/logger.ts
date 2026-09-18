// ============================================================================
// Centralized client-side error logging.
//
// Every graceful-fallback catch block in this app (backend unreachable,
// Sarvam/Cognee/n8n degraded, voice transcription failing, etc.) should
// call `logError` instead of silently swallowing the error or reaching for
// an ad-hoc `console.error`. Today this just logs to the console with a
// consistent, greppable prefix; swapping in a real telemetry sink (Sentry,
// LogRocket, etc.) later means changing this one function, not every call
// site.
// ============================================================================

export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === "production") {
    // Keep production consoles quiet — this is the one place a real
    // telemetry call (e.g. Sentry.captureException) would go instead.
    return;
  }
  console.error(`[Niriksh] ${context}:`, error);
}
