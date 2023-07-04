import { Loader, Plugin } from "esbuild";
import postcss, { AcceptedPlugin } from "postcss";
import fs from "fs/promises";

// https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_expressions
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& は一致した部分文字列全体を意味します
}

export interface PostCssPluginOption {
  extensions: string[];
  plugins: AcceptedPlugin[];
  loader?: Loader;
}

export const PostCssPlugin = (option: PostCssPluginOption): Plugin => {
  const css = postcss(option.plugins);

  return {
    name: "PostCssPlugin",
    setup(build) {
      const filter = new RegExp(
        `\\.(?:${option.extensions.map(escapeRegExp).join("|")})$`
      );

      build.onLoad({ filter }, async (args) => {
        const content = await fs.readFile(args.path);
        const result = await css.process(content);
        return {
          contents: result.content,
          loader: option.loader ?? "css",
          pluginName: "PostCssPlugin",
        };
      });
    },
  };
};
