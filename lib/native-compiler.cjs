"use strict";

/**
 * @import * as compiler from '@astrojs/compiler/sync'
 */

const { createRequire } = require("node:module");
const { pathToFileURL } = require("node:url");

const cjsRrequire =
  typeof require === "undefined"
    ? createRequire(pathToFileURL(__filename))
    : require;

/**
 * @type {typeof compiler | undefined}
 */
let nativeCompiler;

try {
  nativeCompiler = cjsRrequire("@astrojs/compiler/sync");
} catch {
  //
}

module.exports = nativeCompiler;
