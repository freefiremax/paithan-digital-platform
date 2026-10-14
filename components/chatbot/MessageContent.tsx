import { Fragment } from "react";

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part.startsWith("`") ? <code key={i} className="rounded bg-slate-100 px-1 text-slate-900">{part.slice(1, -1)}</code> : <Fragment key={i}>{part}</Fragment>);
}

/** Safe Markdown subset: React escapes text; no HTML or model-created links. */
export function MessageContent({ text }: { text: string }) {
  return <div className="space-y-1 break-words">{text.split("\n").map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;
    if (/^#{1,3}\s/.test(line)) return <p key={i} className="font-semibold">{inline(line.replace(/^#{1,3}\s/, ""))}</p>;
    if (/^[-*]\s/.test(line)) return <p key={i} className="flex gap-2"><span aria-hidden="true">•</span><span>{inline(line.slice(2))}</span></p>;
    return <p key={i}>{inline(line)}</p>;
  })}</div>;
}
