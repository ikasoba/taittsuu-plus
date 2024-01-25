import { h } from "../util.js";

export const installRightMenu = () => {
  $("div.container-right > div:nth-child(5)").after(...SearchBarComponent());
};

export function* SearchBarComponent() {
  yield Link("fa-swatchbook", "/home#tp-themes", "テーマ");
}

export function Link(icon: string, href: string, text: string) {
  //prettier-ignore
  return $(
      '<div class="mt-1">'
    +   h`<a href="${href}" class="decoration-none">`
    +       `<i class="fas w-25 ${icon} text-center"></i>`
    +       h`${text}`
    +   "</a>"
    + "</div>"
  );
}
