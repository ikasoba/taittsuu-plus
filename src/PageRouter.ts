export type Component = () => HTMLElement;

export class Signal<T> {
  private listeners = new Set<() => void>();
  constructor(private __value__: T) {}

  set value(newValue: T) {
    this.__value__ = newValue;
    this.listeners.forEach((fn) => fn());
  }

  get value() {
    return this.__value__;
  }

  $(fn: () => void) {
    this.listeners.add(fn);
  }
}

let disMountHandler: (() => void) | null;

const prefix = "tp-";

export const onDisMount = (fn: () => void) => {
  disMountHandler = fn;
};

export class PageRouter {
  private static currentComponentView: HTMLElement | null = null;
  private static pages = new Map<string, Component>();
  private static _bookedTransition: string | null = null;

  static container = $("<div></div>");

  static isRouterActivated = false;

  static getContainerLeft() {
    return document.querySelector("main > .container > .container-right")
      ?.previousElementSibling as HTMLDivElement | undefined;
  }

  static getContainerRight() {
    return document.querySelector<HTMLDivElement>(
      "main > .container > .container-right"
    );
  }

  static {
    PageRouter.container.css("position", "absolute");
    PageRouter.container.css("display", "none");

    const resizeObserver = new ResizeObserver(() => {
      const left = PageRouter.getContainerLeft();

      if (!left) return;

      const rect = left.getBoundingClientRect();

      PageRouter.container.css("top", rect.top + "px");
      PageRouter.container.css("left", rect.left + "px");
      PageRouter.container.css("width", rect.width + "px");
    });

    resizeObserver.observe(document.querySelector("main > .container")!);

    $(document.body).append(PageRouter.container);

    $(window).on("hashchange", () => {
      if (!location.hash.startsWith("#" + prefix)) {
        const left = PageRouter.getContainerLeft();

        this.currentComponentView = null;
        PageRouter.container.css("display", "none");

        if (left) {
          left.style.opacity = "1";
          left.style.pointerEvents = "auto";
        }

        return;
      }

      const pageName = PageRouter.getCurrentPageNameFromHash();

      PageRouter.bookedTransition = null;
      PageRouter.moveURL(pageName);
    });
  }

  static get bookedTransition() {
    return this._bookedTransition;
  }

  static set bookedTransition(newValue: string | null) {
    this._bookedTransition = newValue;

    if (this.bookedTransition && this.pages.has(this.bookedTransition)) {
      this.setCurrentComponent(this.pages.get(this.bookedTransition)!);
    } else if (this.bookedTransition) {
      $(".page-main-container > .container-left").empty();
    }
  }

  static moveURL(pageName: string) {
    if (location.hash != "#" + prefix + pageName) {
      location.hash = "#" + prefix + pageName;
    }

    const pageComponent = this.pages.get(pageName);

    const left = PageRouter.getContainerLeft();

    if (left) {
      left.style.opacity = "0";
      left.style.pointerEvents = "none";
    }

    PageRouter.container.css("display", "block");

    if (pageComponent == null) {
      PageRouter.container
        .empty()
        .append(
          $("<h1></h1>")
            .css("display", "flex")
            .css("justify-content", "center")
            .css("align-items", "center")
            .css("width", "100%")
            .css("height", "100%")
            .text("そのページは存在しません。")
        );

      return;
    }

    this.setCurrentComponent(pageComponent);
  }

  static regist(pageName: string, component: Component) {
    if (this.isRouterActivated == null) {
      console.warn("ルーターはまだアクティブ化されてない");
      return;
    }

    this.pages.set(pageName, component);

    if (this.bookedTransition == pageName) {
      this.setCurrentComponent(component);
    }
  }

  static setCurrentComponent(component: Component) {
    disMountHandler = null;

    const view = component();
    PageRouter.container.empty().append(view);

    this.currentComponentView = view;
  }

  static getCurrentPageNameFromHash() {
    return location.hash.slice(prefix.length + 1);
  }
}

export const activatePageRouter = () => {
  if (
    /^\/home\/?$/.test(location.pathname) &&
    location.hash.startsWith("#" + prefix)
  ) {
    //console.log(true);
    PageRouter.isRouterActivated = true;
    const pageName = PageRouter.getCurrentPageNameFromHash();

    PageRouter.bookedTransition = pageName;
  }
};
