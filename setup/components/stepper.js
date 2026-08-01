(function initStepper(namespace) {
  "use strict";
  const { h, t, icon } = namespace.ui;

  function render(state) {
    return h("nav", { class: "setup-stepper", "aria-label": state.language === "en" ? "Setup progress" : "配置进度" },
      h("ol", {}, namespace.schema.steps.map((step, index) => {
        const active = index === state.currentStep;
        const completed = index < state.currentStep;
        return h("li", { class: `${active ? "is-active" : ""}${completed ? " is-complete" : ""}` },
          h("button", {
            type: "button",
            dataset: { action: "go-step", step: index },
            "aria-current": active ? "step" : null,
            "aria-label": `${index + 1}. ${t(step.label, state.language)}`
          },
          h("span", { class: "setup-stepper__number" }, completed ? icon("check") : String(index + 1)),
          h("span", { class: "setup-stepper__label", text: t(step.label, state.language) }))
        );
      }))
    );
  }

  function mobileProgress(state) {
    const current = namespace.schema.steps[state.currentStep];
    return h("div", { class: "setup-mobile-progress" },
      h("div", {}, h("span", { text: `${state.currentStep + 1} / ${namespace.schema.steps.length}` }), h("strong", { text: t(current.label, state.language) })),
      h("div", { class: "setup-mobile-progress__track", role: "progressbar", "aria-valuenow": state.currentStep + 1, "aria-valuemin": 1, "aria-valuemax": namespace.schema.steps.length },
        h("span", { style: { width: `${((state.currentStep + 1) / namespace.schema.steps.length) * 100}%` } })
      )
    );
  }

  namespace.components.stepper = { render, mobileProgress };
})(window.SCHOLAR_CANVAS_SETUP);
