import * as mjs from "../lib/index.mjs";
import * as cjs from "../lib/index.cjs";
import assert from "assert";

const modules = { mjs, cjs };

describe("parse test", () => {
  for (const [nm, mo] of Object.entries(modules)) {
    it(nm, () => {
      const result = mo.parse(`---
fn()
---
<div {foo}>`);

      assert.deepStrictEqual(result, {
        ast: {
          type: "root",
          children: [
            {
              type: "frontmatter",
              value: "\nfn()\n",
              position: {
                start: { line: 1, column: 1, offset: 0 },
                end: { line: 3, column: 4, offset: 12 },
              },
            },
            {
              type: "element",
              name: "div",
              attributes: [
                {
                  type: "attribute",
                  kind: "shorthand",
                  name: "foo",
                  value: "",
                  position: { start: { line: 4, column: 7, offset: 19 } },
                },
              ],
              children: [],
              position: { start: { line: 4, column: 2, offset: 14 } },
            },
          ],
        },
        diagnostics: [],
      });
    });

    it(`${nm} with error`, () => {
      const errorCode = `---
const foo = true
---

<!-- notice the tag is not closed properly -->
<style is:inline set:html={""}>`;
      const code = `---
const foo = true
---

<!-- notice the tag is not closed properly -->
<style is:inline set:html={""} />`;

      let fail = false;
      try {
        mo.parse(errorCode);

        // FIXME: The parser has been improved so there may be no way to make it an error.
        fail = true;
      } catch (_e) {
        fail = true;
      }
      if (!fail) assert.fail("Expected error");
      mo.parse(code);
      fail = false;
      try {
        mo.parse(errorCode);
      } catch (_e) {
        fail = true;
      }
      if (!fail) assert.fail("Expected error");
      mo.parse(code);
    });
  }
});
