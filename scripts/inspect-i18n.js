const fs = require("fs");
const en = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));
const mr = JSON.parse(fs.readFileSync("messages/mr.json", "utf8"));
const hi = JSON.parse(fs.readFileSync("messages/hi.json", "utf8"));

console.log("Namespaces in en.json:", Object.keys(en));
console.log("Namespaces in mr.json:", Object.keys(mr));
console.log("Namespaces in hi.json:", Object.keys(hi));

function countKeys(obj) {
  let count = 0;
  for (const k in obj) {
    if (typeof obj[k] === "object" && obj[k] !== null) {
      count += countKeys(obj[k]);
    } else {
      count++;
    }
  }
  return count;
}

console.log("Total keys - EN:", countKeys(en), "MR:", countKeys(mr), "HI:", countKeys(hi));
