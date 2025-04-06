"use strict";

const { createSyncFn } = require("synckit");
const nativeCompiler = require("./native-compiler.cjs");

let workerSync;

function createCompilerSync(workerPath) {
  return function compilerSync(method, ...args) {
    if (
      // https://github.com/withastro/compiler/issues/911#issuecomment-1861624633
      method !== "transform" &&
      typeof nativeCompiler?.[method] === "function"
    ) {
      return nativeCompiler[method](...args);
    }

    if (!workerSync) {
      workerSync = createSyncFn(workerPath, 3000);
    }

    return workerSync(method, ...args);
  };
}

module.exports = createCompilerSync;
