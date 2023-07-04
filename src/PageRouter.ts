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
  private static prevContainerChildren = $(
    ".page-main-container > .container-left"
  ).children();

  static isRouterActivated = false;

  static {
    $(".page-main-container > .container-left").on("change", () => {
      if (this.currentComponentView != null) return;

      this.prevContainerChildren = $(
        ".page-main-container > .container-left"
      ).children();
    });

    $(window).on("hashchange", () => {
      if (!location.hash.startsWith("#" + prefix)) {
        this.currentComponentView = null;
        $(".page-main-container > .container-left")
          .empty()
          .append(this.prevContainerChildren);
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

    if (pageComponent == null) {
      $(".page-main-container > .container-left")
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
    $(".page-main-container > .container-left").empty().append(view);

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
    console.log(true);
    PageRouter.isRouterActivated = true;
    const pageName = PageRouter.getCurrentPageNameFromHash();

    PageRouter.bookedTransition = pageName;
  }
};
