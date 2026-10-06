const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      results.push(filePath);
    }
  });
  return results;
}

const appFiles = walk("app");
const compFiles = walk("components");
const allFiles = [...appFiles, ...compFiles];

console.log("Total TS/TSX files:", allFiles.length);

const results = [];
allFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const usesTranslations = content.includes("useTranslations") || content.includes("getTranslations");
  results.push({ file, usesTranslations, lines: content.split("\n").length });
});

console.log("\n--- Files without translations ---");
results.filter(r => !r.usesTranslations && r.file.endsWith(".tsx")).forEach(r => console.log(r.file));
