//console.time("theme draw start");

import { PageRouter } from "../PageRouter.js";
import {
  PlusTheme,
  defaultDarkTheme,
  defaultLightTheme,
  getPrimaryColor,
  parseHexColor,
  setDarkTheme,
  setLightTheme,
  setPrimaryColor,
  toHex,
} from "../theme/theme.js";
import { h } from "../util.js";

export function ThemeInfoComponent(
  theme: PlusTheme,
  themes: { value: PlusTheme[] },
  editable: boolean
) {
  //console.log(theme);

  //prettier-ignore
  const themeInfo = $(
      '<div class="tp-container">'
    +   h`<h3>${
          theme.name + "・" + (theme.type == "light" ? "ライト" : "ダーク")
        }</h3>`
    + "</div>"
  );

  let editor: JQuery<HTMLTextAreaElement>;

  themeInfo.append(
    $("<div>タイプ：</div>").append(
      ($("<select>") as JQuery<HTMLSelectElement>)
        .append(
          $(
            `<option value="url" ${
              theme.style.type == "url" ? "selected" : ""
            }>外部CSS</option>`
          ),
          $(
            `<option value="inline" ${
              theme.style.type == "inline" ? "selected" : ""
            }>手書きCSS</option>`
          )
        )
        .attr("disabled", editable ? null : "")
        .on("change", (event) => {
          themes.value = GM_getValue("themes", []);

          themes.value.some((x) => {
            if (theme.name == x.name) {
              theme = x;
              theme.style.type = ("" +
                event.target.selectedOptions[0].value) as any;
              return true;
            }
          });

          GM_setValue("themes", themes.value);
        })
    )
  );

  themeInfo.append(
    $("<div>").append(
      (editor = ($("<textarea>") as JQuery<HTMLTextAreaElement>)
        .val(theme.style.value)
        .css("width", "100%")
        .css("box-sizing", "border-box")
        .attr("disabled", editable ? null : "")
        .on("change", () => {
          themes.value = GM_getValue("themes", []);

          for (const x of themes.value) {
            if (theme.name == x.name) {
              theme = x;
              theme.style.value = "" + editor.val();
              break;
            }
          }

          //console.log(themes);

          GM_setValue("themes", themes.value);
        }))
    )
  );

  themeInfo.append(
    $("<button>")
      .text("使う")
      .on("click", () => {
        if (theme.type == "light") {
          GM_setValue("light_theme_cache", null);
          setLightTheme(theme);
        } else {
          GM_setValue("dark_theme_cache", null);
          setDarkTheme(theme);
        }
      })
  );

  if (editable) {
    themeInfo.append(
      $("<button>")
        .text("🗑️削除")
        .on("click", () => {
          themes.value = GM_getValue("themes", []);

          themes.value.some((x, i) => {
            if (theme.name == x.name) {
              themes.value.splice(i, 1);
              return true;
            }
          });

          themeInfo.remove();

          GM_setValue("themes", themes.value);
        })
    );
  }

  return themeInfo;
}

function ThemeEditorComponent(redrawThemes: () => void) {
  //prettier-ignore
  const editor = $(
      "<details>"
    +   "<summary>テーマを追加する</summary>"
    +   "<input "
    +     'type="text"'
    +     'style="width: 100%; box-sizing: border-box;"'
    +     'placeholder="テーマの名前"'
    +   "/>"
    +   '<select id="fp-themes-type">'
    +   '<option value="light">ライト</option>'
    +   '<option value="dark">ダーク</option>'
    +   "</select>"
    +   '<select id="fp-themes-content-type">'
    +     '<option value="url">外部CSS</option>'
    +     '<option value="inline">手書きCSS</option>'
    +   "</select>"
    +   '<textarea style="width: 100%; box-sizing: border-box;"></textarea>'
    +   "<button>追加</button>"
    + "</details>"
  );

  const name = editor.find("input");
  const themeType = editor.find("#fp-themes-type");
  const themeContentType = editor.find("#fp-themes-content-type");

  const content = editor.find("textarea");

  editor.find("button").on("click", () => {
    const themes: PlusTheme[] = GM_getValue("themes", []);

    themes.push({
      name: "" + name.val(),
      type: themeType.val() as "light" | "dark",
      style: {
        type: themeContentType.val() as "inline" | "url",
        value: "" + content.val(),
      },
    });

    GM_setValue("themes", themes);

    redrawThemes();

    name.val("");
    content.val("");
  });

  return editor;
}

function PrimaryColorPicker() {
  const hex = toHex(getPrimaryColor());

  const view = $(`<label>プライマリーカラー：</label>`);
  const picker = $(`<input type="color" value="#${hex}" />`);

  picker.on("change", () => {
    const [red, blue, green] = parseHexColor(picker.val() as string);

    setPrimaryColor(red, blue, green);
  });

  view.append(picker);

  return view;
}

const defaultThemes: { value: PlusTheme[] } = {
  value: [
    defaultLightTheme,
    defaultDarkTheme,
    {
      type: "light",
      name: "マイスタイル・プライマリーカラー対応",
      style: {
        type: "url",
        value: "https://ikasoba.github.io/taittsuu-plus/themes/my-style.css",
      },
    },
  ],
};

PageRouter.regist("themes", () => {
  //prettier-ignore
  const view = $(
      '<div class="tp-container">'
    +   "<h1> タイッツーPlus テーマ </h1>"
    +   '<div id="tp-themes-primary-color"></div>'
    +   '<div id="tp-themes-editor"></div>'
    +   "<h2> テーマ一覧 </h2>"
    +   '<div id="tp-themes">'
    +   "</div>"
    + "</div>"
  );

  const themeList = view.find("#tp-themes");

  let themes: { value: PlusTheme[] } = {
    value: GM_getValue("themes", []),
  };

  const drawThemeList = () => {
    themes = {
      value: GM_getValue("themes", []),
    };

    themeList.empty();

    for (let theme of defaultThemes.value) {
      themeList.append(ThemeInfoComponent(theme, defaultThemes, false));
    }

    for (let theme of themes.value) {
      themeList.append(ThemeInfoComponent(theme, themes, true));
    }
  };

  drawThemeList();

  view.find("#tp-themes-editor").append(ThemeEditorComponent(drawThemeList));
  view.find("#tp-themes-primary-color").append(PrimaryColorPicker());

  return view[0];
});
