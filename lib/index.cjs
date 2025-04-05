"use strict";

const { createSyncFn } = require("synckit");

const compilerSync = createSyncFn(
  require.resolve("./astrojs-compiler-worker.mjs"),
  3000,
);

module.exports = {
  parse,
  transform,
  convertToTSX,
  compile,
};

function parse(...args) {
  return compilerSync("parse", ...args);
}

function transform(...args) {
  return compilerSync("transform", ...args);
}

function convertToTSX(...args) {
  return compilerSync("convertToTSX", ...args);
}

function compile(...args) {
  return compilerSync("compile", ...args);
}
