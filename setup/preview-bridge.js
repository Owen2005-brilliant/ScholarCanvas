(function initSetupPreviewBridge(namespace) {
  "use strict";

  let frame = null;
  let ready = false;
  let timer = 0;
  let listening = false;

  function allowedOrigin(origin) {
    if (window.location.protocol === "file:") return origin === "null";
    return origin === window.location.origin;
  }

  function targetOrigin() {
    return window.location.protocol === "file:" ? "*" : window.location.origin;
  }

  function payload() {
    const runtimeFiles = namespace.store.getRuntimeFiles();
    return namespace.serializer.buildPayload(namespace.store.get(), runtimeFiles, { previewAvatarUrl: runtimeFiles.avatarUrl || "" });
  }

  function send() {
    if (!frame || !frame.contentWindow || !ready) return false;
    frame.contentWindow.postMessage({ type: "SCHOLAR_CANVAS_PREVIEW_UPDATE", version: 1, payload: payload() }, targetOrigin());
    return true;
  }

  function schedule() {
    window.clearTimeout(timer);
    timer = window.setTimeout(send, 180);
  }

  function onMessage(event) {
    if (!frame || event.source !== frame.contentWindow || !allowedOrigin(event.origin)) return;
    if (!event.data || event.data.type !== "SCHOLAR_CANVAS_PREVIEW_READY" || event.data.version !== 1) return;
    ready = true;
    send();
  }

  function attach(element) {
    if (frame === element) return;
    frame = element;
    ready = false;
    if (!listening) {
      window.addEventListener("message", onMessage);
      listening = true;
    }
  }

  function refresh() {
    if (!frame) return;
    ready = false;
    const source = frame.getAttribute("src");
    frame.setAttribute("src", source);
  }

  function destroy() {
    window.clearTimeout(timer);
    if (listening) window.removeEventListener("message", onMessage);
    listening = false;
    frame = null;
    ready = false;
  }

  namespace.previewBridge = { attach, send, schedule, refresh, destroy, allowedOrigin, payload };
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
