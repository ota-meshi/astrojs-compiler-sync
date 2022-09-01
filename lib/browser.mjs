let service;

function getService() {
  return service || (service = globalThis["@astrojs/compiler"]);
}

/**
 * Parse code by `@astrojs/compiler`
 */
export function parse(code, options) {
  const { ast } = getService().parse(code, options);
  return { ast: JSON.parse(ast) };
}

/** setup */
export async function setup(wasmExecGo) {
  let bkProcess;
  if (typeof globalThis.process !== "undefined") {
    bkProcess = globalThis.process;
  }

  const Go = wasmExecGo;
  const { default: wasmBuffer } = await import("@astrojs/compiler/astro.wasm");

  // Adjust process object
  if (bkProcess) {
    // eslint-disable-next-line require-atomic-updates -- ignore
    globalThis.process = bkProcess;
  } else {
    // eslint-disable-next-line no-process-env -- ignore
    process.env = {};
    process.cwd = () => "";
    process.hrtime = () => Date.now();
  }
  const go = new Go();
  try {
    const mod = await WebAssembly.compile(wasmBuffer);
    const instance = await WebAssembly.instantiate(mod, go.importObject);
    go.run(instance);

    return watch();
  } catch (e) {
    // eslint-disable-next-line no-console -- log
    console.log(e);
    throw e;
  }

  function watch() {
    return new Promise((resolve) => {
      if (globalThis["@astrojs/compiler"]) {
        resolve();
      } else {
        setTimeout(() => {
          resolve(watch());
        }, 100);
      }
    });
  }
}
