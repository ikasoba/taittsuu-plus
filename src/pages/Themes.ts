import { PageRouter } from "../PageRouter.js";
import {
  PlusTheme,
  defaultDarkTheme,
  defaultLightTheme,
} from "../theme/theme.js";
import { h } from "../util.js";

export interface ThemeInfo {
  type: "dark" | "light";
  theme: PlusTheme;
}

export function ThemeInfoComponent(
  theme: ThemeInfo,
  themes: { value: ThemeInfo[] },
  deletable: boolean
) {
  const themeInfo = $(
    h`
    <div class="tp-container">
      <h3>${theme.theme.name}</h3>
    </div>
    `
  );

  let editor: JQuery<HTMLTextAreaElement>;

  themeInfo.append(
    $("<div>タイプ：</div>").append(
      ($("<select>") as JQuery<HTMLSelectElement>)
        .append(
          $(
            `<option value="url" ${
              theme.theme.style.type == "url" ? "selected" : ""
            }>外部CSS</option>`
          ),
          $(
            `<option value="inline" ${
              theme.theme.style.type == "inline" ? "selected" : ""
            }>手書きCSS</option>`
          )
        )
        .on("change", (event) => {
          themes.value = JSON.parse(GM_getValue("themes", "[]"));

          themes.value.some((x) => {
            if (theme.theme.name == x.theme.name) {
              theme = x;
              theme.theme.style.type = ("" +
                event.target.selectedOptions[0].value) as any;
              return true;
            }
          });

          GM_setValue("themes", JSON.stringify(themes.value));
        })
    )
  );

  themeInfo.append(
    $("<div>").append(
      (editor = ($("<textarea>") as JQuery<HTMLTextAreaElement>).on(
        "change",
        () => {
          themes = JSON.parse(GM_getValue("themes", "[]"));

          themes.value.some((x) => {
            if (theme.theme.name == x.theme.name) {
              theme = x;
              theme.theme.style.value = "" + editor.val();
              return true;
            }
          });

          GM_setValue("themes", JSON.stringify(themes.value));
        }
      ))
    )
  );

  themeInfo.append(
    $("button")
      .text("🗑️削除")
      .on("click", () => {
        themes.value = JSON.parse(GM_getValue("themes", "[]"));

        themes.value.some((x, i) => {
          if (theme.theme.name == x.theme.name) {
            themes.value.splice(i, 1);
            return true;
          }
        });

        GM_setValue("themes", JSON.stringify(themes.value));
      })
  );

  if (deletable) {
    themeInfo.append(
      $("button")
        .text("🗑️削除")
        .on("click", () => {
          themes.value = JSON.parse(GM_getValue("themes", "[]"));

          themes.value.some((x, i) => {
            if (theme.theme.name == x.theme.name) {
              themes.value.splice(i, 1);
              return true;
            }
          });

          GM_setValue("themes", JSON.stringify(themes.value));
        })
    );
  }

  return themeInfo;
}

const defaultThemes: { value: ThemeInfo[] } = {
  value: [
    {
      type: "light",
      theme: defaultLightTheme,
    },
    {
      type: "dark",
      theme: defaultDarkTheme,
    },
  ],
};

PageRouter.regist("themes", () => {
  const view = $(
    `
    <div class="tp-container">
      <h1> タイッツーPlus テーマ </h1>
      <h2> テーマ一覧 </h2>
      <div class="tp-container" id="tp-themes">
      </div>
    </div>
    `
  );

  const themeList = view.find("#tp-themes");

  let themes: { value: ThemeInfo[] } = {
    value: JSON.parse(GM_getValue("themes", "[]")),
  };

  if (themes.value.length == 0) {
    themeList.text("現在利用できるテーマはありません");
  }

  for (let theme of defaultThemes.value) {
    themeList.append(ThemeInfoComponent(theme, defaultThemes, false));
  }

  for (let theme of themes.value) {
    themeList.append(ThemeInfoComponent(theme, themes, true));
  }

  return view[0];
});
