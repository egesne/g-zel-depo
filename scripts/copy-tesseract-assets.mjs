import { cp, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const target = resolve(root, "dist/tesseract");
const coreSource = resolve(root, "node_modules/tesseract.js-core");
await mkdir(target, { recursive: true });
await cp(
  resolve(root, "node_modules/tesseract.js/dist/worker.min.js"),
  resolve(target, "worker.min.js")
);
await cp(
  resolve(coreSource, "tesseract-core.wasm.js"),
  resolve(target, "core/tesseract-core.wasm.js")
);
await cp(
  resolve(coreSource, "tesseract-core.wasm"),
  resolve(target, "core/tesseract-core.wasm")
);
console.log("Tesseract worker ve WASM dosyaları dist içine kopyalandı.");