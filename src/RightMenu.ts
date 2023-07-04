import { h } from "./util.js";

export const installRightMenu = () => {
  $("div.container-right > div:nth-child(5)").after(...SearchBarComponent());
};

export function* SearchBarComponent() {
  yield Link("fa-swatchbook", "/home#tp-themes", "テーマ");
}

export function Link(icon: string, href: string, text: string) {
  return $(
    h`<div class="mt-1">
      <a href="${href}" class="decoration-none">
          <i class="fas w-20 ${icon}"></i>
          ${text}
      </a>
    </div>`
  );
}
