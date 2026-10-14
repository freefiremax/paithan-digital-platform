import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import ts from "typescript";
import * as publicData from "../lib/mock-data";
import { navSections } from "../lib/navigation";
import { getWardProfile } from "../lib/ward-profiles";
import { chunkText, safeSourceUrl, type KnowledgeIndex, type KnowledgeLanguage, type KnowledgeSource } from "../lib/chatbot/knowledge-types";

const root = process.cwd();
const output = path.join(root, "lib/generated/chatbot-index.json");
const generatedAt = new Date().toISOString();
const report: KnowledgeIndex["report"] = { discovered: 0, indexed: 0, updated: 0, unchanged: 0, removed: 0, skipped: [], failed: [] };
const sources: KnowledgeSource[] = [];
const previous: KnowledgeIndex | null = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output, "utf8")) : null;
const translations = Object.fromEntries(["en", "mr", "hi"].map((language) => [language, JSON.parse(fs.readFileSync(path.join(root, "messages", `${language}.json`), "utf8"))])) as Record<KnowledgeLanguage, Record<string, unknown>>;

function add(title: string, url: string, content: string, language: KnowledgeLanguage, category: string, sourceType: KnowledgeSource["sourceType"], updatedAt = generatedAt, reliability: KnowledgeSource["reliability"] = "website") {
  report.discovered++;
  if (!safeSourceUrl(url) || content.trim().length < 30) { report.skipped.push(`${url}: empty or ineligible`); return; }
  chunkText(content).forEach((chunk, i) => {
    const id = createHash("sha256").update(`${url}:${language}:${sourceType}:${title}:${i}`).digest("hex").slice(0, 24);
    const hash = createHash("sha256").update(chunk).digest("hex");
    const old = previous?.sources.find((source) => source.id === id);
    sources.push({ id, title, url, content: chunk, hash, language, category, sourceType, reliability, updatedAt: old?.hash === hash ? old.updatedAt : updatedAt });
    if (old?.hash === hash) report.unchanged++;
    else report.updated++;
  });
}

function flatten(value: unknown, prefix = ""): string[] {
  if (typeof value === "string" || typeof value === "number") return [`${prefix}: ${value}`];
  if (Array.isArray(value)) return value.flatMap((item) => flatten(item, prefix));
  if (!value || typeof value !== "object") return [];
  // Public-data adapters only. Never read users, auth, grievance bodies or env.
  return Object.entries(value).filter(([key]) => !/^(?:id|slug|image.*|coordinates|icon|dataStatus)$/i.test(key)).flatMap(([key, item]) => flatten(item, prefix ? `${prefix} ${key}` : key));
}

function walk(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (/^(?:admin|login|register|not-found|search)$/.test(entry.name)) return [];
    const location = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(location) : [location];
  });
}

function readTranslation(language: KnowledgeLanguage, key: string) {
  let value: unknown = translations[language];
  for (const segment of key.split(".")) value = value && typeof value === "object" ? (value as Record<string, unknown>)[segment] : undefined;
  return typeof value === "string" ? value : "";
}

// Extract public copy without executing route modules, JSX, or server queries.
for (const file of walk(path.join(root, "app/[locale]")).filter((name) => name.endsWith("page.tsx"))) {
  const relative = path.relative(path.join(root, "app/[locale]"), path.dirname(file)).replaceAll("\\", "/");
  const url = "/" + relative.split("/").filter((segment) => segment && !segment.startsWith("(")).join("/");
  if (/\[/.test(url)) { report.skipped.push(`${url}: handled by structured adapters`); continue; }
  try {
    const text = fs.readFileSync(file, "utf8");
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const namespaces: Record<string, string> = {};
    const copy: string[] = [];
    const translationKeys: string[] = [];
    const collect = (node: ts.Node) => {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isPropertyAccessExpression(node.initializer) && node.initializer.expression.getText(ast) === "messages") namespaces[node.name.text] = node.initializer.name.text;
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
        const initializer = ts.isAwaitExpression(node.initializer) ? node.initializer.expression : node.initializer;
        const call = ts.isCallExpression(initializer) ? initializer : null;
        if (call)
        if (/^(useTranslations|getTranslations)$/.test(call.expression.getText(ast)) && call.arguments[0] && ts.isStringLiteral(call.arguments[0])) namespaces[node.name.text] = call.arguments[0].text;
      }
      if (ts.isJsxText(node) && node.text.trim()) copy.push(node.text.trim());
      if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression) && namespaces[node.expression.text]) translationKeys.push(`${namespaces[node.expression.text]}.${node.name.text}`);
      if (ts.isPropertyAccessExpression(node) && node.expression.getText(ast) === "messages") {
        const namespace = node.name.text;
        // Public forms pass an entire translation namespace to a child component.
        if (namespace === "grievance") for (const key of Object.keys(translations.en[namespace] as Record<string, unknown> || {})) translationKeys.push(`${namespace}.${key}`);
      }
      if (ts.isPropertyAssignment(node) && /^(title(?:En|Mr)?|name(?:En|Mr)?|description|summary|overview|tagline|body|keyPoints|highlights|label|detail|text|bio|answer|question|era|category)$/.test(node.name.getText(ast).replace(/["']/g, ""))) {
        const strings = (child: ts.Node) => { if (ts.isStringLiteral(child) || ts.isNoSubstitutionTemplateLiteral(child)) copy.push(child.text); else ts.forEachChild(child, strings); };
        strings(node.initializer);
      }
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && namespaces[node.expression.text] && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) translationKeys.push(`${namespaces[node.expression.text]}.${node.arguments[0].text}`);
      ts.forEachChild(node, collect);
    };
    collect(ast);
    const title = url === "/" ? "Paithan Digital Platform" : url.split("/").pop()!.replaceAll("-", " ");
    for (const language of ["en", "mr", "hi"] as const) {
      add(title, url, [...copy, ...translationKeys.map((key) => readTranslation(language, key))].filter(Boolean).join("\n"), language, url.split("/")[1] || "website", "page", fs.statSync(file).mtime.toISOString());
    }
  } catch { report.failed.push(`${url}: extraction failed`); }
}

const groups: Array<[string, string, readonly unknown[]]> = [
  ["Tourist places", "/tourism/places-to-visit", publicData.TOURIST_PLACES],
  ["History timeline", "/heritage/history", publicData.HISTORY_TIMELINE],
  ["Museum exhibits", "/heritage/museum", publicData.MUSEUM_EXHIBITS],
  ["Visitor routes", "/tourism/routes", publicData.CURATED_ROUTES],
  ["Citizen services", "/nagar-parishad", publicData.citizenServices],
  ["Public representatives", "/nagar-parishad/representatives", publicData.PUBLIC_REPRESENTATIVES],
  ["Public notices", "/nagar-parishad/notifications", publicData.notifications],
  ["Development works", "/nagar-parishad/development-works", publicData.developmentWorks],
  ["Municipal council", "/nagar-parishad", [publicData.councilProfile, publicData.paithanDemographics]],
  ["Emergency directory", "/contact", publicData.paithanEmergencyDirectory],
];
for (const [title, url, records] of groups) for (const [i, record] of records.entries()) {
  if (record && typeof record === "object" && (record as { dataStatus?: string }).dataStatus === "SAMPLE_TBD") { report.skipped.push(`${title} ${i}: sample`); continue; }
  const named = record as { nameEn?: string; titleEn?: string; title?: string; label?: string; name?: string };
  add(named.nameEn || named.titleEn || named.title || named.label || named.name || `${title} ${i + 1}`, url, flatten(record).join("\n"), "en", url.split("/")[1], "public-data");
}
for (const ward of publicData.wards) {
  for (const language of ["en", "mr", "hi"] as const) add(language === "mr" ? ward.nameMr : ward.name, `/nagar-parishad/ward-map/${ward.number}`, `${ward.name}\n${ward.nameMr}\n${ward.locality}\n${getWardProfile(ward.number).description}\nWard assignments and boundaries require official confirmation.`, language, "wards", "public-data");
}
for (const section of navSections) add(section.label, section.href, `${section.label}\n${section.children.map((item) => `${item.label}: ${item.description || ""}. Open ${item.href}`).join("\n")}`, "en", "navigation", "public-data");

// Local text sidecars can make public PDFs searchable without an extra service.
for (const file of walk(path.join(root, "public")).filter((name) => /\.(txt|pdf)$/i.test(name))) {
  const url = "/" + path.relative(path.join(root, "public"), file).replaceAll("\\", "/");
  if (/\.pdf$/i.test(file)) { if (!fs.existsSync(`${file}.txt`)) report.skipped.push(`${url}: add a .pdf.txt text sidecar to index this PDF`); continue; }
  add(path.basename(file), url.replace(/\.pdf\.txt$/, ".pdf"), fs.readFileSync(file, "utf8"), "en", "documents", "document");
}
// IDs guarantee repeatability; deleting/replacing the snapshot removes stale chunks.
const unique = [...new Map(sources.map((source) => [source.id, source])).values()];
report.indexed = unique.length;
report.removed = previous?.sources.filter((source) => !unique.some((next) => next.id === source.id)).length || 0;
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ version: 1, generatedAt, sources: unique, report } satisfies KnowledgeIndex, null, 2) + "\n");
console.log(JSON.stringify({ ...report, skipped: report.skipped.length, failed: report.failed, output: "lib/generated/chatbot-index.json" }, null, 2));
if (report.failed.length) process.exitCode = 1;
