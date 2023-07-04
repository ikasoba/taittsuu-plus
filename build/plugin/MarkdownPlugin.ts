import { Loader, Plugin } from "esbuild";
import postcss, { AcceptedPlugin } from "postcss";
import fs from "fs/promises";
import { marked } from "marked";
import path from "path";

export type ArgType<F extends (...a: any[]) => any> = F extends (
  ...a: infer A
) => any
  ? A
  : never;

export interface MarkdownPluginOption {
  header?: string;
  footer?: string;
  markedOption?: ArgType<typeof marked>[1];
  loader?: Loader;
  template?: string;
}

const setExtension = (p: string, ext: string) =>
  path.join(path.dirname(p), path.basename(p, path.extname(p)) + ext);

const getBasename = (p: string) => path.basename(p, path.extname(p));

const changeBasename = (p: string, name: string) =>
  path.join(path.dirname(p), name + path.extname(p));

export const MarkdownPlugin = (option?: MarkdownPluginOption): Plugin => {
  return {
    name: "MarkdownPlugin",
    setup(build) {
      const pathMap = new Map<string, string>();

      build.onResolve({ filter: /\.md$/ }, async (args) => {
        let newPath = setExtension(args.path, ".html");

        pathMap.set(newPath, args.path);
        return {
          path: newPath,
          namespace: "MarkdownPlugin",
        };
      });

      build.onLoad(
        { filter: /\.html$/, namespace: "MarkdownPlugin" },
        async (args) => {
          const realpath = pathMap.get(args.path)!;
          const content = await fs.readFile(realpath, "utf-8");
          let result = marked(content, option?.markedOption);

          if (option?.template) {
            result = option.template
              .replace("{{content}}", result)
              .replace(
                "{{dirname}}",
                path.relative(path.dirname(args.path), process.cwd()) || "."
              );
          }

          if (getBasename(args.path).toLowerCase() == "readme") {
            const outPath = changeBasename(args.path, "index");

            if (build.initialOptions.outdir) {
              await fs
                .mkdir(build.initialOptions.outdir, { recursive: true })
                .catch(() => void 0);
            }

            await fs.writeFile(
              path.join(build.initialOptions.outdir ?? "", outPath),
              result,
              "utf-8"
            );
          }

          return {
            contents: result,
            loader: "copy",
          };
        }
      );
    },
  };
};
