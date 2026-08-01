(function initSetupImporter(namespace) {
  "use strict";

  const storageKey = "scholarCanvas.setupDraft.v1";
  const databaseName = "ScholarCanvasSetup";
  const storeName = "files";

  function safeState(state) {
    const copy = namespace.stateUtils.deepClone(state);
    copy.files = {
      avatar: copy.files && copy.files.avatar || null,
      cv: copy.files && copy.files.cv || null
    };
    copy.shareImageError = null;
    copy.dirty = false;
    copy.draftSaved = true;
    return copy;
  }

  function draftDocument(state) {
    return {
      format: "scholarcanvas-setup",
      version: 1,
      createdAt: new Date().toISOString(),
      state: safeState(state)
    };
  }

  function parseDraft(text) {
    let value;
    try {
      value = JSON.parse(String(text || ""));
    } catch (_error) {
      return { valid: false, message: namespace.schema.bilingual("文件不是合法 JSON。", "File is not valid JSON.") };
    }
    const validation = namespace.validators.validateDraftDocument(value);
    if (!validation.valid) return validation;
    return { valid: true, document: value, state: namespace.stateUtils.normalizeImportedState(value.state) };
  }

  function readTextFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(String(reader.result || "")), { once: true });
      reader.addEventListener("error", () => reject(reader.error || new Error("Could not read file")), { once: true });
      reader.readAsText(file, "utf-8");
    });
  }

  async function importDraftFile(file) {
    const text = await readTextFile(file);
    const parsed = parseDraft(text);
    if (parsed.valid && parsed.state.shareImageFile) {
      parsed.state.shareImageError = namespace.schema.bilingual("请重新选择草稿中的自定义分享封面，或恢复默认封面。", "Re-select the custom sharing cover from this draft, or use the default cover.");
      parsed.state.advancedSeoExpanded = true;
    }
    return parsed;
  }

  function exportDraft(state) {
    const blob = new Blob([`${JSON.stringify(draftDocument(state), null, 2)}\n`], { type: "application/json" });
    namespace.exporter.downloadBlob(blob, "scholarcanvas-setup.json");
    return blob;
  }

  function openDatabase() {
    if (!("indexedDB" in window)) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      request.addEventListener("upgradeneeded", () => {
        if (!request.result.objectStoreNames.contains(storeName)) request.result.createObjectStore(storeName);
      });
      request.addEventListener("success", () => resolve(request.result), { once: true });
      request.addEventListener("error", () => reject(request.error || new Error("Could not open IndexedDB")), { once: true });
    });
  }

  async function saveRuntimeFiles(runtimeFiles) {
    const database = await openDatabase();
    if (!database) return;
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      ["avatar", "cv", "shareImage"].forEach((key) => {
        if (runtimeFiles && runtimeFiles[key]) store.put(runtimeFiles[key], key);
        else store.delete(key);
      });
      transaction.addEventListener("complete", resolve, { once: true });
      transaction.addEventListener("error", () => reject(transaction.error || new Error("Could not store files")), { once: true });
    });
    database.close();
  }

  async function loadRuntimeFiles() {
    const database = await openDatabase();
    if (!database) return { avatar: null, cv: null, shareImage: null };
    const result = await new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const files = { avatar: null, cv: null, shareImage: null };
      let pending = 3;
      ["avatar", "cv", "shareImage"].forEach((key) => {
        const request = store.get(key);
        request.addEventListener("success", () => {
          files[key] = request.result || null;
          pending -= 1;
          if (!pending) resolve(files);
        }, { once: true });
        request.addEventListener("error", () => reject(request.error || new Error("Could not load files")), { once: true });
      });
    });
    database.close();
    return result;
  }

  async function saveDraft(state, runtimeFiles) {
    localStorage.setItem(storageKey, JSON.stringify(draftDocument(state)));
    await saveRuntimeFiles(runtimeFiles || {});
    return true;
  }

  function hasDraft() {
    try {
      return Boolean(localStorage.getItem(storageKey));
    } catch (_error) {
      return false;
    }
  }

  async function loadDraft() {
    const text = localStorage.getItem(storageKey);
    const parsed = parseDraft(text);
    if (!parsed.valid) return parsed;
    parsed.runtimeFiles = await loadRuntimeFiles();
    if (parsed.state.shareImageFile && !parsed.runtimeFiles.shareImage) {
      parsed.state.shareImageError = namespace.schema.bilingual("浏览器中未找到自定义分享封面，请重新选择或恢复默认封面。", "The custom sharing cover was not found in this browser. Re-select it or use the default cover.");
      parsed.state.advancedSeoExpanded = true;
    }
    return parsed;
  }

  async function clearDraft() {
    localStorage.removeItem(storageKey);
    const database = await openDatabase();
    if (!database) return;
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, "readwrite");
      transaction.objectStore(storeName).clear();
      transaction.addEventListener("complete", resolve, { once: true });
      transaction.addEventListener("error", () => reject(transaction.error || new Error("Could not clear draft files")), { once: true });
    });
    database.close();
  }

  namespace.importer = { storageKey, draftDocument, parseDraft, importDraftFile, exportDraft, saveDraft, loadDraft, clearDraft, hasDraft, readTextFile };
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
