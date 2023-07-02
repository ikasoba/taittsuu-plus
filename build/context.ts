import { context } from "esbuild";
import fs from "node:fs/promises";

const packageJson: { version: number } = JSON.parse(
  await fs.readFile("./package.json", "utf8")
);

export default await context({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "./.o/index.js",
  banner: {
    js:
      "// ==UserScript==\n" +
      "// @name         Taittsuu-Plus\n" +
      "// @namespace    http://tampermonkey.net/\n" +
      `// @version      ${packageJson.version}\n` +
      "// @description  タイッツーに機能を追加します\n" +
      "// @author       github.com/ikasoba\n" +
      "// @match        https://taittsuu.com/*\n" +
      "// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==\n" +
      "// @grant        none\n" +
      "// ==/UserScript==\n",
  },
  format: "iife",
  minify: true,
  sourcemap: "linked",
  loader: {
    ".css": "text",
  },
});
