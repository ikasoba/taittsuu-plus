export const installTweetDialogPlus = () => {
  const dialog = $("#taiitsuDialogInner");
  const editor = dialog.find("textarea");

  const counter = document.createElement("div");

  editor.on("input", () => {
    const length = (editor.val() as string).length;

    if (length == 0) {
      counter.innerText = "";
    } else {
      counter.innerText = `${length}/140`;
    }

    if (length >= 140) {
      counter.style.color = "red";
    } else if (counter.style.color != "") {
      counter.style.color = "";
    }
  });

  editor.after(counter);
};
