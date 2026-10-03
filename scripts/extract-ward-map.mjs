import fs from "node:fs";
import path from "node:path";

const src = "C:/Users/KSHITIJ/Downloads/paithan-17-wards-clickable.svg";
const svg = fs.readFileSync(src, "utf8");

const m = svg.match(/href="(data:image\/png;base64,[^"]+)"/);
if (!m) {
  console.error("NO EMBEDDED IMAGE FOUND");
  process.exit(1);
}
const b64 = m[1].replace(/^data:image\/png;base64,/, "");
const buf = Buffer.from(b64, "base64");

const outDir = "C:/Users/KSHITIJ/OneDrive/Desktop/paithan/public/maps";
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "paithan-17-wards-base.png"), buf);
console.log("PNG bytes written:", buf.length);

const stripped = svg.replace(
  /(href=")data:image\/png;base64,[^"]+(")/,
  "$1<<PNG-DATA-URI>>$2"
);
console.log("---SVG-STRUCTURE-START---");
console.log(stripped);
console.log("---SVG-STRUCTURE-END---");
