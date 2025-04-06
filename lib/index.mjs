import { createSyncFn } from "synckit";

const compilerSync = createSyncFn(
  new URL("./astrojs-compiler-worker.mjs", import.meta.url),
  3000,
);

export function parse(...args) {
  return compilerSync("parse", ...args);
}
export function transform(...args) {
  return compilerSync("transform", ...args);
}
export function convertToTSX(...args) {
  return compilerSync("convertToTSX", ...args);
}
export function compile(...args) {
  return compilerSync("compile", ...args);
}
