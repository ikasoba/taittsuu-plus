export function ImageComponent(src: string) {
  const img = document.createElement("img");

  const wrapper = $("<div></div>");
  wrapper.css("border", "1px solid lightgray");
  wrapper.css("border-radius", "0.5rem");
  wrapper.css("margin", "0.25rem");
  wrapper.css("padding", "0.25rem");
  wrapper.css("background", "#444");
  wrapper.append(img);

  img.src = src;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.aspectRatio = "16 / 9";
  img.style.objectFit = "contain";

  return wrapper[0];
}
