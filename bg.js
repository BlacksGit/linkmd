const api = typeof browser !== "undefined" ? browser : chrome;

function grab() {
  const sel = String(getSelection()).trim();
  const title = document.title.replace(/[\[\]]/g, "").trim() || location.hostname;
  const link = "[" + title + "](" + location.href.replace(/\)/g, "%29") + ")";
  const text = sel ? sel.split("\n").map(l => "> " + l).join("\n") + "\n\n" + link : link;
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
  return sel ? "quote" : "link";
}

api.action.onClicked.addListener(async tab => {
  try {
    const [r] = await api.scripting.executeScript({ target: { tabId: tab.id }, func: grab });
    api.action.setBadgeText({ text: "OK", tabId: tab.id });
  } catch (e) {
    api.action.setBadgeText({ text: "X", tabId: tab.id });
  }
  setTimeout(() => api.action.setBadgeText({ text: "", tabId: tab.id }), 1200);
});
