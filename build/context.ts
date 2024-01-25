import { context } from "esbuild";
import fs from "node:fs/promises";
import { PostCssPlugin } from "./plugin/PostCssPlugin.js";
import cssnano from "cssnano";
import { MarkdownPlugin } from "./plugin/MarkdownPlugin.js";
import { globby as glob, globby } from "globby";
import { copy as CopyPlugin } from "esbuild-plugin-copy";

const packageJson: { version: number } = JSON.parse(
  await fs.readFile("./package.json", "utf8")
);

export const scriptContext = await context({
  entryPoints: ["src/index.ts", ...(await glob("./src/features/*"))],
  bundle: true,
  outdir: "./.o",
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
      "// @grant        GM.getValue\n" +
      "// @grant        GM.xmlHttpRequest\n" +
      "// @grant        GM_getResourceText\n" +
      "// @grant        unsafeWindow\n" +
      "// @connect ikasoba.github.io\n" +
      "// @connect *\n" +
      "// @require https://cdn.jsdelivr.net/npm/@twemoji/api@15.0.3/dist/twemoji.min.js\n" +
      //"// @run-at document-body\n" +
      "// ==/UserScript==\n" +
      "gmExports = this;var $ = globalThis.$ = unsafeWindow.$;",
  },
  format: "iife",
  minify: true,
  target: "es2018",
  ///sourcemap: "linked",
  plugins: [
    //ImportURLPlugin(".cache"),
    PostCssPlugin({
      extensions: ["css"],
      plugins: [cssnano()],
      loader: "text",
    }),
  ],
});

export const documentContext = await context({
  entryPoints: [
    "readme.md",
    ...(await glob("./themes/*")),
    "./pages/index.css",
  ],
  bundle: true,
  outdir: "./.o",
  format: "iife",
  minify: true,
  //sourcemap: "linked",
  plugins: [
    //ImportURLPlugin(".cache"),
    MarkdownPlugin({
      template: await fs.readFile("pages/template.html", "utf-8"),
    }),
    PostCssPlugin({
      extensions: ["css"],
      plugins: [cssnano()],
    }),
    CopyPlugin({
      resolveFrom: "cwd",
      assets: {
        from: ["doc/*"],
        to: [".o/doc"],
      },
      watch: true,
    }),
  ],
});
