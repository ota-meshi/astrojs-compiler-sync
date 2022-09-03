import { dirname, resolve } from "path";
import { runAsWorker } from "synckit";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";

// When some error occurs in @astrojs/compiler, the worker may be terminated.
// So calling @astrojs/compiler directly on this worker may hang calls via `synckit`.
// This worker creates a child worker to process @astrojs/compiler, and if an error occurs in the child worker,
// it terminates the child worker and recreates it to prevent hangs.
// Related to https://github.com/ota-meshi/eslint-plugin-astro/issues/99

const __dirname = dirname(fileURLToPath(import.meta.url));
const workerPath = resolve(__dirname, "./astrojs-compiler-worker.mjs");
let worker;
let seq = 0;
let processMap = new Map();

function onMessage({ id, result, error, properties }) {
  const proc = processMap.get(id);
  processMap.delete(id);

  if (error) {
    proc?.reject(Object.assign(error, properties));
    terminateWorker();
  } else {
    proc?.resolve(result);
  }
}

function terminateWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}

runAsWorker((method, ...args) => {
  const id = seq++;
  if (!worker) {
    worker = new Worker(workerPath, {});
    worker.on("message", onMessage);
    worker.on("exit", terminateWorker);
    worker.on("error", terminateWorker);
    worker.unref();
  }
  return new Promise((resolve, reject) => {
    processMap.set(id, { resolve, reject });
    setTimeout(() => {
      if (processMap.has(id)) {
        processMap.delete(id);
        terminateWorker();
        reject(new Error("Timeout"));
      }
    }, 3000);
    worker.postMessage({ id, method, args });
  });
});
