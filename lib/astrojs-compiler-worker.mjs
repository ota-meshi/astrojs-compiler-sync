import { runAsWorker } from "synckit";
import * as compiler from "@astrojs/compiler";

runAsWorker((method, ...args) => {
  const result = compiler[method](...args);
  return result;
});
