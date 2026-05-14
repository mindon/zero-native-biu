// usage: updated() { /* ... */ stylize(this.renderRoot);}
//
export function stylize(
  root: ShadowRoot | document | HTMLElement,
  elements?: HTMLElement[],
  warning?: string,
  extra?: string,
) {
  if (!elements?.length) {
    elements = [].slice.call(root.querySelectorAll("*:first-child"));
  }
  let styleSheet = root.styleSheets[0];
  const done = root._ready_css_rules__ || [];
  if (warning && !done.length) console.warn(warning);
  const cl = [...new Set(
    elements
      .map((root: HTMLElement) =>
        Array.from(root.querySelectorAll("*"))
          .map((elm: Element, i: number, arr: Element[]) =>
            Array.from([].slice.call(elm.classList || []).map((c) => `.${c}`))
              .concat([elm.tagName.toLowerCase()])
          ).concat([].slice.call(root.classList || []).map((c) => `.${c}`))
          .concat([root.tagName.toLowerCase()]).flat()
      ).flat().concat(extra?.split(",") ?? []),
  ).values()].filter((key) => !done.some((k) => k == key));
  if (cl.length == 0) return;

  const rules = xstyles((rule: CSSStyleRule) => {
    if (rule instanceof CSSKeyframesRule) return true;
    const selector = rule.selectorText ?? "";
    const parts = rule.selectorText.split(/\s*,\s*/);
    const used = parts.filter((v: string) =>
      cl.some((k) =>
        v.split(/[+> ]+/).map((q) =>
          q.replace(/([\.]?[\w-]+)[\[:> +.].*$/g, "$1")
        ).some((q) => q == k)
      )
    ); // detect if match any
    return used.length > 0;
  });

  if (rules?.length == 0) return;
  let needToAdopte = false;
  if (!styleSheet) {
    styleSheet = new CSSStyleSheet();
    needToAdopte = true;
  }

  rules.flat(2).map((rule: CSSRule, i: number) => {
    styleSheet.insertRule(
      rule.newText || rule.cssText,
      i,
    );
    if (rule.newText) delete rule.newText;
    return false;
  });
  if (needToAdopte) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, styleSheet];
  }
  // -- cached
  root._ready_css_rules__ = [...new Set(done.concat(cl)).values()];
}

export const xstyles = function (names, kfr) {
  const { origin } = globalThis.location;
  let styleSheets = [...document.styleSheets].filter(({ href, ownerNode }) => {
    return !href || (origin && href.startsWith(origin)) ||
      ownerNode.getAttribute("crossorigin") === "anonymous";
  });
  const aniname = /animation:\s*(\w+)/;
  const anis = [];
  let rules = styleSheets.map((sheet) =>
    [...(sheet.cssRules || sheet.rules || [])].map((rule) => {
      if (rule instanceof CSSStyleRule) {
        const m = rule.cssText.match(aniname);
        if (m) anis.push(m[1]);
        return [rule];
      } else if (
        rule instanceof CSSMediaRule && window.matchMedia(rule.conditionText)
      ) {
        return [...rule.cssRules];
      } else if (
        rule instanceof CSSSupportsRule && CSS.supports(rule.conditionText)
      ) {
        return [...rule.cssRules];
      } else if (
        kfr && rule instanceof CSSKeyframesRule &&
        (rule.name.match(kfr) || anis.some((k) => rule.name.endsWith(k)))
      ) {
        return [rule];
      }
      return [];
    })
  );
  rules = rules.reduce((acc, rules) => acc.concat(...rules), []);

  rules = rules.filter(
    names instanceof Function ? names : (rule) => {
      const matched = (rule.selectorText || "").match(names);
      if (matched || rule instanceof CSSKeyframesRule) {
        return true;
      }
      return false;
    },
  );
  return rules;
};
