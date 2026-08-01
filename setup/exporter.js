(function initSetupExporter(namespace) {
  "use strict";

  const encoder = new TextEncoder();
  const crcTable = Array.from({ length: 256 }, (_value, index) => {
    let current = index;
    for (let bit = 0; bit < 8; bit += 1) current = (current & 1) ? 0xedb88320 ^ (current >>> 1) : current >>> 1;
    return current >>> 0;
  });

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let index = 0; index < bytes.length; index += 1) crc = crcTable[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  function write16(view, offset, value) {
    view.setUint16(offset, value, true);
  }

  function write32(view, offset, value) {
    view.setUint32(offset, value >>> 0, true);
  }

  function dosDateTime(date) {
    const value = date || new Date();
    const year = Math.max(1980, value.getFullYear());
    return {
      time: (value.getHours() << 11) | (value.getMinutes() << 5) | Math.floor(value.getSeconds() / 2),
      date: ((year - 1980) << 9) | ((value.getMonth() + 1) << 5) | value.getDate()
    };
  }

  function concat(parts) {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const result = new Uint8Array(total);
    let offset = 0;
    parts.forEach((part) => {
      result.set(part, offset);
      offset += part.length;
    });
    return result;
  }

  async function bytesFor(value) {
    if (value instanceof Uint8Array) return value;
    if (value instanceof ArrayBuffer) return new Uint8Array(value);
    if (typeof Blob !== "undefined" && value instanceof Blob) return new Uint8Array(await value.arrayBuffer());
    return encoder.encode(String(value === undefined ? "" : value));
  }

  async function buildEntries(state, runtimeFiles) {
    const files = namespace.serializer.buildTextFiles(state, runtimeFiles || {});
    const entries = Object.entries(files).map(([name, data]) => ({ name, data }));
    if (runtimeFiles && runtimeFiles.avatar) entries.push({ name: namespace.serializer.avatarExportPath(runtimeFiles), data: runtimeFiles.avatar });
    if (runtimeFiles && runtimeFiles.cv) entries.push({ name: "assets/files/cv.pdf", data: runtimeFiles.cv });
    return entries;
  }

  async function createZipBlob(entries, onProgress) {
    const localParts = [];
    const centralParts = [];
    const timestamp = dosDateTime(new Date());
    let offset = 0;
    const list = Array.isArray(entries) ? entries : [];

    for (let index = 0; index < list.length; index += 1) {
      const entry = list[index];
      const name = encoder.encode(String(entry.name).replace(/^\/+/, ""));
      const data = await bytesFor(entry.data);
      const crc = crc32(data);
      const local = new Uint8Array(30 + name.length);
      const localView = new DataView(local.buffer);
      write32(localView, 0, 0x04034b50);
      write16(localView, 4, 20);
      write16(localView, 6, 0x0800);
      write16(localView, 8, 0);
      write16(localView, 10, timestamp.time);
      write16(localView, 12, timestamp.date);
      write32(localView, 14, crc);
      write32(localView, 18, data.length);
      write32(localView, 22, data.length);
      write16(localView, 26, name.length);
      write16(localView, 28, 0);
      local.set(name, 30);
      localParts.push(local, data);

      const central = new Uint8Array(46 + name.length);
      const centralView = new DataView(central.buffer);
      write32(centralView, 0, 0x02014b50);
      write16(centralView, 4, 20);
      write16(centralView, 6, 20);
      write16(centralView, 8, 0x0800);
      write16(centralView, 10, 0);
      write16(centralView, 12, timestamp.time);
      write16(centralView, 14, timestamp.date);
      write32(centralView, 16, crc);
      write32(centralView, 20, data.length);
      write32(centralView, 24, data.length);
      write16(centralView, 28, name.length);
      write16(centralView, 30, 0);
      write16(centralView, 32, 0);
      write16(centralView, 34, 0);
      write16(centralView, 36, 0);
      write32(centralView, 38, 0);
      write32(centralView, 42, offset);
      central.set(name, 46);
      centralParts.push(central);
      offset += local.length + data.length;
      if (onProgress) onProgress({ completed: index + 1, total: list.length, percent: Math.round(((index + 1) / Math.max(1, list.length)) * 100) });
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    const centralDirectory = concat(centralParts);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    write32(endView, 0, 0x06054b50);
    write16(endView, 4, 0);
    write16(endView, 6, 0);
    write16(endView, 8, list.length);
    write16(endView, 10, list.length);
    write32(endView, 12, centralDirectory.length);
    write32(endView, 16, offset);
    write16(endView, 20, 0);
    return new Blob([concat(localParts), centralDirectory, end], { type: "application/zip" });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function readZipNames(blob) {
    const bytes = await bytesFor(blob);
    const decoder = new TextDecoder();
    const names = [];
    let offset = 0;
    while (offset <= bytes.length - 46) {
      const view = new DataView(bytes.buffer, bytes.byteOffset + offset, bytes.length - offset);
      if (view.getUint32(0, true) !== 0x02014b50) {
        offset += 1;
        continue;
      }
      const nameLength = view.getUint16(28, true);
      const extraLength = view.getUint16(30, true);
      const commentLength = view.getUint16(32, true);
      names.push(decoder.decode(bytes.slice(offset + 46, offset + 46 + nameLength)));
      offset += 46 + nameLength + extraLength + commentLength;
    }
    return names;
  }

  async function downloadConfiguration(state, runtimeFiles, onProgress) {
    const validation = namespace.validators.validateState(state);
    if (!validation.valid) throw Object.assign(new Error("Configuration validation failed"), { validation });
    const entries = await buildEntries(state, runtimeFiles);
    const blob = await createZipBlob(entries, onProgress);
    downloadBlob(blob, "scholarcanvas-config.zip");
    return { blob, entries, names: entries.map((entry) => entry.name) };
  }

  namespace.exporter = { crc32, buildEntries, createZipBlob, readZipNames, downloadBlob, downloadConfiguration };
})(window.SCHOLAR_CANVAS_SETUP = window.SCHOLAR_CANVAS_SETUP || {});
