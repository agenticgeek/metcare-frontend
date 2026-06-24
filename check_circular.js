const fs = require('fs');
const path = require('path');

const api = fs.readFileSync('src/lib/api.ts', 'utf8');
const studentDisplay = fs.readFileSync('src/lib/studentDisplay.ts', 'utf8');

console.log("=== api.ts ===");
console.log("Line 1 (import statement):");
console.log(api.split('\n')[0]);

console.log("\n=== studentDisplay.ts ===");
console.log("Line 1 (import statement):");
console.log(studentDisplay.split('\n')[0]);

// Check for type-only vs runtime imports
const apiTypeImport = api.includes("import type");
const studentDisplayTypeImport = studentDisplay.includes("import type");

console.log("\n=== Import Analysis ===");
console.log("api.ts has type-only import from studentDisplay:", apiTypeImport);
console.log("studentDisplay.ts has type-only import from api:", studentDisplayTypeImport);

// Look at exact line
const studentDisplayImports = studentDisplay.split('\n').slice(0, 5);
console.log("\nstudentDisplay.ts first 5 lines:");
studentDisplayImports.forEach((l, i) => console.log(i+1 + ": " + l));
