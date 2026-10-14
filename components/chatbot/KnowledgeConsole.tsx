"use client";

import { useCallback, useEffect, useState } from "react";

interface Status {
  generatedAt: string;
  sourceCount: number;
  providerConfigured: boolean;
  semanticEnabled: boolean;
  report: { failed: string[]; skipped: string[] };
  sources: Array<{ id: string; title: string; url: string; language: string; sourceType: string; reliability: string }>;
}

export function KnowledgeConsole() {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    const response = await fetch("/api/admin/chatbot/knowledge", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load knowledge status. Sign in with an administrator account.");
    setStatus(await response.json());
  }, []);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/chatbot/knowledge", { cache: "no-store" })
      .then(async (response) => { if (!response.ok) throw new Error("Sign in with an administrator account to view knowledge status."); return response.json(); })
      .then((data: Status) => { if (!cancelled) setStatus(data); })
      .catch((error: Error) => { if (!cancelled) setNotice(error.message); });
    return () => { cancelled = true; };
  }, []);
  const run = async (action: string) => {
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/chatbot/knowledge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "The operation failed. Check server diagnostics.");
      setNotice(JSON.stringify(data));
      await load();
    } catch (error) { setNotice(error instanceof Error ? error.message : "The operation failed."); }
    finally { setBusy(false); }
  };
  return <main className="mx-auto max-w-6xl space-y-6 p-6">
    <h1 className="text-2xl font-semibold text-slate-900">Chatbot knowledge</h1>
    <p className="max-w-3xl text-sm leading-6 text-slate-600">Website knowledge refreshes during each build. Public database records refresh during retrieval. This console can publish a snapshot to Neon, test provider connectivity and run a small retrieval evaluation.</p>
    <div className="flex flex-wrap gap-3">{[["refresh", "Refresh public index"], ["health", "Check AI service"], ["evaluate", "Evaluate retrieval"]].map(([action, label]) => <button key={action} disabled={busy} onClick={() => run(action)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-40">{label}</button>)}</div>
    {notice && <pre role="status" className="whitespace-pre-wrap break-words rounded-lg border p-4 text-sm">{notice}</pre>}
    {status && <>
      <dl className="grid gap-4 rounded-lg border bg-white p-5 sm:grid-cols-3"><div><dt className="text-sm text-slate-500">Indexed chunks</dt><dd className="text-2xl font-semibold">{status.sourceCount}</dd></div><div><dt className="text-sm text-slate-500">AI credentials</dt><dd>{status.providerConfigured ? "Configured; use the health check to verify" : "Missing"}</dd></div><div><dt className="text-sm text-slate-500">Optional semantic search</dt><dd>{status.semanticEnabled ? "Enabled" : "Disabled; lexical retrieval active"}</dd></div></dl>
      <p className="text-sm text-slate-600">Built {new Date(status.generatedAt).toLocaleString()}. Extraction failures: {status.report.failed.length}. Skipped items: {status.report.skipped.length}.</p>
      <details className="rounded-lg border p-4"><summary className="cursor-pointer font-semibold">Skipped sources and limitations</summary><ul className="mt-3 space-y-1 text-sm">{status.report.skipped.map((item, i) => <li key={i}>{item}</li>)}</ul></details>
      <div className="overflow-x-auto rounded-lg border"><table className="w-full text-left text-sm"><caption className="p-4 text-left font-semibold">Indexed public sources</caption><thead className="bg-slate-100"><tr><th className="p-3">Source</th><th>Language</th><th>Type</th><th>Status</th></tr></thead><tbody>{status.sources.map((source) => <tr key={source.id} className="border-t"><td className="p-3">{source.title}<span className="block text-xs text-slate-500">{source.url}</span></td><td>{source.language}</td><td>{source.sourceType}</td><td>{source.reliability}</td></tr>)}</tbody></table></div>
    </>}
  </main>;
}
