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
    return namespace.serializer.buildPayload(namespace.store.get(), runtimeFiles);
  }

  function message(handoffToken) {
    const runtimeFiles = namespace.store.getRuntimeFiles();
    const value = {
      type: "SCHOLAR_CANVAS_PREVIEW_UPDATE",
      version: 1,
      payload: payload(),
      files: { avatar: runtimeFiles.avatar || null, cv: runtimeFiles.cv || null }
    };
    if (handoffToken) value.handoffToken = handoffToken;
    return value;
  }

  function send() {
    if (!frame || !frame.contentWindow || !ready) return false;
    frame.contentWindow.postMessage(message(), targetOrigin());
    return true;
  }

  function createHandoffToken() {
    const values = new Uint32Array(4);
    window.crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(36)).join("");
  }

  function standaloneUrl(handoffToken) {
    return `setup/preview/index.html?v=1.1.0-preview-4&standalone=1&handoff=${encodeURIComponent(handoffToken)}`;
  }

  function prepareStandalone(handoffToken) {
    if (!handoffToken) return Promise.resolve(false);
    return new Promise((resolve) => {
      let popup = null;
      let sent = false;
      const cleanup = (result) => {
        window.clearTimeout(timeout);
        window.removeEventListener("message", onStandaloneMessage);
        resolve(result);
      };
      const onStandaloneMessage = (event) => {
        if (!allowedOrigin(event.origin) || !event.data || event.data.version !== 1 || event.data.handoffToken !== handoffToken) return;
        if (event.data.type === "SCHOLAR_CANVAS_STANDALONE_PREVIEW_READY") {
          popup = event.source;
          sent = true;
          popup.postMessage(message(handoffToken), targetOrigin());
          return;
        }
        if (sent && event.source === popup && event.data.type === "SCHOLAR_CANVAS_PREVIEW_APPLIED") cleanup(true);
      };
      const timeout = window.setTimeout(() => cleanup(false), 8000);
      window.addEventListener("message", onStandaloneMessage);
    });
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

  namespace.previewBridge = { attach, send, schedule, refresh, destroy, allowedOrigin, payload, message, createHandoffToken, standaloneUrl, prepareStandalone };
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
