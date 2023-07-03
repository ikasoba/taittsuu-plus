export const installSearchBar = () => {
  $("div.container-right > div:nth-child(5)").after(SearchBarComponent());
};

export function SearchBarComponent() {
  const input = document.createElement("input");
  const button = document.createElement("button");
  const wrapper = document.createElement("div");

  wrapper.style.display = "flex";
  wrapper.style.gap = "0.25rem";
  wrapper.style.marginTop = "0.5rem";
  wrapper.style.marginBottom = "0.5rem";
  wrapper.style.height = "2rem";

  button.append($(`<i class="fas fa-search"></i>`)[0], "検索");

  wrapper.append(input, button);

  button.addEventListener("click", () => {
    const params = new URLSearchParams({
      q: `site:taittsuu.com ${input.value}`,
    });

    window.open(new URL("https://www.google.com/search?" + params), "_blank");
  });

  return wrapper;
}
