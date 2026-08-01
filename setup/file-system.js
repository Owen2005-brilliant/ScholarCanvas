(function initSetupFileSystem(namespace) {
  "use strict";

  const exactPaths = new Set([
    "data/site.js", "data/profile.js", "data/news.js", "data/publications.js", "data/projects.js",
    "data/experience.js", "data/awards.js", "data/skills.js", "data/teaching.js", "data/service.js",
    "robots.txt", "sitemap.xml", "assets/files/cv.pdf"
  ]);

  function isAllowedPath(path) {
    return exactPaths.has(path) || /^assets\/avatar\/profile-avatar\.(?:png|jpg|webp|svg)$/.test(path);
  }

  function supported() {
    return typeof window.showDirectoryPicker === "function";
  }

  async function directoryAt(root, parts, create) {
    let current = root;
    for (const part of parts) current = await current.getDirectoryHandle(part, { create: Boolean(create) });
    return current;
  }

  async function fileAt(root, path, create) {
    const parts = path.split("/");
    const filename = parts.pop();
    const directory = await directoryAt(root, parts, create);
    return directory.getFileHandle(filename, { create: Boolean(create) });
  }

  async function looksLikeScholarCanvas(root) {
    try {
      await root.getFileHandle("index.html");
      await root.getDirectoryHandle("data");
      await root.getDirectoryHandle("src");
      await root.getDirectoryHandle("styles");
      return true;
    } catch (_error) {
      return false;
    }
  }

  function backupStamp(date) {
    const value = date || new Date();
    const pad = (number) => String(number).padStart(2, "0");
    return `${value.getFullYear()}${pad(value.getMonth() + 1)}${pad(value.getDate())}-${pad(value.getHours())}${pad(value.getMinutes())}${pad(value.getSeconds())}`;
  }

  async function writeValue(fileHandle, value) {
    const writable = await fileHandle.createWritable();
    await writable.write(value);
    await writable.close();
  }

  async function readExisting(root, path) {
    try {
      const handle = await fileAt(root, path, false);
      return await handle.getFile();
    } catch (_error) {
      return null;
    }
  }

  async function applyEntries(root, entries, onProgress) {
    if (!await looksLikeScholarCanvas(root)) throw new Error("NOT_SCHOLARCANVAS");
    const list = (Array.isArray(entries) ? entries : []).filter((entry) => isAllowedPath(entry.name));
    if (list.length !== entries.length) throw new Error("PATH_NOT_ALLOWED");
    const backupRoot = await directoryAt(root, [".backup", `setup-${backupStamp()}`], true);
    for (let index = 0; index < list.length; index += 1) {
      const entry = list[index];
      const existing = await readExisting(root, entry.name);
      if (existing) {
        const backupHandle = await fileAt(backupRoot, entry.name, true);
        await writeValue(backupHandle, existing);
      }
      const target = await fileAt(root, entry.name, true);
      await writeValue(target, entry.data);
      if (onProgress) onProgress({ completed: index + 1, total: list.length, path: entry.name });
    }
    return { written: list.map((entry) => entry.name), backup: backupRoot.name };
  }

  async function chooseFolder() {
    if (!supported()) throw new Error("UNSUPPORTED");
    return window.showDirectoryPicker({ mode: "readwrite", id: "scholarcanvas-setup-root" });
  }

  namespace.fileSystem = { supported, isAllowedPath, looksLikeScholarCanvas, backupStamp, chooseFolder, applyEntries };
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
