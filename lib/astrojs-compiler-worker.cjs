"use strict";

const { runAsWorker } = require("synckit");

runAsWorker(async (method, ...args) => {
  const compiler = await import("@astrojs/compiler");
  const result = compiler[method](...args);
  return result;
});
