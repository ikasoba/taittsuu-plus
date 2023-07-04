import { context } from "esbuild";
import fs from "node:fs/promises";
import { PostCssPlugin } from "./plugin/PostCssPlugin.js";
import cssnano from "cssnano";
import { MarkdownPlugin } from "./plugin/MarkdownPlugin.js";
import { globby as glob } from "globby";
import { copy as CopyPlugin } from "esbuild-plugin-copy";

const packageJson: { version: number } = JSON.parse(
  await fs.readFile("./package.json", "utf8")
);

export const scriptContext = await context({
  entryPoints: ["src/index.ts"],
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
      "// @connect ikasoba.github.io\n" +
      "// @connect ikasoba.codesk.dev\n" +
      "// @connect *\n" +
      //"// @require https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js\n" +
      //"// @run-at document-body\n" +
      "// ==/UserScript==\n",
  },
  format: "iife",
  minify: true,
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
  sourcemap: "linked",
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
