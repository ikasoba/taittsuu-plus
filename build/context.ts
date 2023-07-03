import { context } from "esbuild";
import fs from "node:fs/promises";
import { PostCssPlugin } from "./plugin/PostCssPlugin.js";
import cssnano from "cssnano";
import { ImportURLPlugin } from "@ikasoba000/esbuild-plugin-import-url";

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
      "// @grant        GM_setValue\n" +
      "// @grant        GM_getValue\n" +
      "// @grant        GM_deleteValue\n" +
      "// ==/UserScript==\n",
  },
  format: "iife",
  minify: true,
  sourcemap: "linked",
  plugins: [
    PostCssPlugin({
      extensions: ["css"],
      plugins: [cssnano()],
    }),
    ImportURLPlugin(".cache"),
  ],
});
