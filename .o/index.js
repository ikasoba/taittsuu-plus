// ==UserScript==
// @name         Taittsuu-Plus
// @namespace    http://tampermonkey.net/
// @version      0.1// @description  タイッツーに機能を追加します
// @author       github.com/ikasoba
// @match        https://taittsuu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

"use strict";
(() => {
  // src/taittsuu.ts
  var onAddPostHandler = /* @__PURE__ */ new Set();
  var onAddPost = (fn) => {
    onAddPostHandler.add(fn);
  };
  console.log("install addPost");
  Taittsuu.Post.addPost = function (postsElem, post) {
    const postElem = $("#postBaseElemWrap").children("div:first").clone();
    postElem.find(".post-user-name-value")[0].innerText = post.user_name;
    if (!post.is_verified) {
      postElem.find(".post-user-badge")[0].style.display = "none";
    }
    postElem.find(".post-user-tid")[0].innerText = "@" + post.user_screenname;
    postElem.find(".post-content")[0].innerText = post.content;
    let createdAt = new Date(post.created_at);
    postElem.find(".post-time")[0].innerText = createdAt.toLocaleString();
    postElem.find(".post-link-user")[0].href = "/users/" + post.user_screenname;
    postElem.find(".post-link-post")[0].href = "/users/" + post.user_screenname + "/status/" + post.id;
    for (const fn of onAddPostHandler) {
      fn(postElem, post, postsElem);
    }
    postsElem.append(postElem);
  };

  // src/tweet.ts
  var showTweetDialog = (content) => {
    if (content != null) {
      document.getElementById("taiitsuInput").value = content;
    }
    Taittsuu.Post.showTaiitsuDialog();
  };
  var createMention = (node, current, i, content, attachments) => {
    if (!(current.value instanceof Text)) {
      return false;
    }
    const m = current.value.textContent?.match(/@[a-zA-Z_0-9]+/d);
    if (!m) {
      return false;
    }
    const offset = m?.indices?.[0][0];
    const length = m?.indices?.[0][1] - offset;
    console.log(m, current.value);
    const userIdNode = current.value.splitText(offset);
    current.value = userIdNode.splitText(length);
    const userIdAnchor = document.createElement("a");
    userIdAnchor.href = `https://taittsuu.com/users/${userIdNode.textContent?.slice(
      1
    )}`;
    userIdAnchor.innerText = userIdNode.textContent ?? "@unknown";
    content.replaceChild(userIdAnchor, userIdNode);
    i.value += 1;
    return true;
  };
  var createURL = (node, current, i, content, attachments) => {
    if (!(current.value instanceof Text)) {
      return false;
    }
    const m = current.value.textContent?.match(
      /(?:https?:\/\/)?(?:[\p{L}_](?:[\p{L}0-9_-]*[\p{L}0-9_])?)(?:\.(?:[\p{L}_](?:[\p{L}0-9_-]*[\p{L}0-9_])?))+(?:\/[^/\r\n]+)*\/?/du
    );
    if (!m) {
      return false;
    }
    const offset = m?.indices?.[0][0];
    const length = m?.indices?.[0][1] - offset;
    console.log(m, current.value);
    const urlNode = current.value.splitText(offset);
    current.value = urlNode.splitText(length);
    const urlText = /^https?:\/\//.test(urlNode.textContent) ? urlNode.textContent : "https://" + urlNode.textContent;
    try {
      const url = new URL(urlText);
      if (url.pathname.match(/\.(?:a?png|jpe?g|webp|gif|bmp)/)) {
        const id = url.pathname.slice(3);
        const img = document.createElement("img");
        img.src = urlText;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.aspectRatio = "16 / 9";
        img.style.objectFit = "contain";
        img.style.background = "#444";
        attachments.value.push(img);
      }
    } catch (_) {
    }
    const urlAnchor = document.createElement("a");
    urlAnchor.href = `${urlText}`;
    urlAnchor.innerText = urlNode.textContent;
    content.replaceChild(urlAnchor, urlNode);
    i.value += 1;
    return true;
  };
  var choice = (transformers) => (node, current, i, content, attachments) => {
    const prevCurrent = current.value;
    const prevIndex = i.value;
    for (const t of transformers) {
      if (t(node, current, i, content, attachments)) {
        return true;
      } else {
        current.value = prevCurrent;
        i.value = prevIndex;
      }
    }
    return false;
  };
  var installTweetContentPlus = () => {
    onAddPost((postElem, post) => {
      const content = postElem.find(".post-content")[0];
      const contentWrap = content.parentElement;
      const attachments = { value: [] };
      for (let i = 0; i < content.childNodes.length; i++) {
        const node = content.childNodes[i];
        if (!(node instanceof Text))
          continue;
        let current = node;
        while (i < content.childNodes.length) {
          const currentRef = { value: current };
          const indexRef = { value: i };
          const isTransformed = choice([createMention, createURL])(
            node,
            currentRef,
            indexRef,
            content,
            attachments
          );
          if (!isTransformed)
            break;
          current = currentRef.value;
          i = indexRef.value;
        }
      }
      console.log(attachments);
      if (attachments.value.length) {
        contentWrap.after(Attachments(attachments.value));
      }
    });
  };
  function Attachments(attachments) {
    attachments = attachments.slice(0, 4);
    const container = document.createElement("div");
    container.style.borderRadius = "0.5rem";
    container.style.width = "100%";
    container.style.aspectRatio = "16 / 9";
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(50%, 1fr)";
    container.style.gridTemplateRows = "repeat(auto-fit, minmax(50%, 1fr)";
    container.append(...attachments);
    return container;
  }

  // src/util.ts
  var textLimit = (text, max) => text.length >= max ? text.slice(0, max - 3) + "..." : text;

  // src/retweet.ts
  var installReTweetButton = () => {
    onAddPost((postElem, post) => {
      const retweetButton = postElem.find("button.post-rt-button");
      retweetButton.attr("onclick", null);
      retweetButton.on("click", (event) => {
        showRetweetDialog(post);
      });
    });
  };
  var showRetweetDialog = (tweet) => {
    console.log(textLimit(tweet.content, 50), tweet);
    showTweetDialog(
      `https://taittsuu.com/users/${tweet.user_screenname}/status/${tweet.id}
\u{1F501} ${tweet.user_name} ${tweet.user_screenname}\u30FB${new Date(
        tweet.created_at
      ).toLocaleString()}
` + textLimit(tweet.content, 50)
    );
  };

  // src/tweetDialog.ts
  var installTweetDialogPlus = () => {
    const dialog = $("#taiitsuDialogInner");
    const editor = dialog.find("textarea");
    const counter = document.createElement("div");
    editor.on("input", () => {
      const length = editor.val().length;
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

  // src/index.ts
  installReTweetButton();
  installTweetContentPlus();
  installTweetDialogPlus();
})();
