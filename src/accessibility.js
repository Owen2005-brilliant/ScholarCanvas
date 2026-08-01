(function initAccessibility(namespace) {
  "use strict";

  let releaseTrap = null;

  function getFocusable(container) {
    return Array.from(container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
  }

  function trapFocus(dialog, onEscape) {
    if (releaseTrap) releaseTrap();
    const previous = document.activeElement;
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable(dialog);
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener("keydown", handleKeydown);
    const first = getFocusable(dialog)[0];
    (first || dialog).focus();
    releaseTrap = () => {
      dialog.removeEventListener("keydown", handleKeydown);
      if (previous && document.contains(previous)) previous.focus();
      releaseTrap = null;
    };
    return releaseTrap;
  }

  function releaseFocusTrap() {
    if (releaseTrap) releaseTrap();
  }

  function prefersReducedMotion() {
    return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  namespace.accessibility = { getFocusable, trapFocus, releaseFocusTrap, prefersReducedMotion };
})(window.SCHOLAR_CANVAS = window.SCHOLAR_CANVAS || {});
