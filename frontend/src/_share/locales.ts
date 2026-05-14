export { localized, msg, str } from "@lit/localize";

import { configureLocalization } from "@lit/localize";

// @customElement('my-element')
// @localized() should after @customElement, this order MATTERS!

// prepare
// bun i @lit/localize
// bun i -D @lit/localize-tools
// export PATH=./node_modules/.bin/:$PATH
//
// step 1. `lit-localize extract` extract msgs (TODO: how to keep xlf translation targets)
// step 2. update xliff/*.xlf
// step 3. `lit-localize build` generate src/locales/*.ts
// step 4. `biu`
import * as zh_CN from "../locales/zh_CN.ts";

const sourceLocale = "en";
const targetLocales = ["zh_CN"];
const allLocales = [sourceLocale].concat(targetLocales);

const locales = new Map(
  targetLocales.map((locale) => [locale, { templates: zh_CN.templates }]),
);

const { getLocale, setLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: async (locale: string) => await locales.get(locale),
});

declare global {
  let setLocale: CallableFunction;
  let getLocale: CallableFunction;
  let locales: string[];
}
globalThis.setLocale = setLocale;
globalThis.getLocale = getLocale;
globalThis.locales = allLocales;
// win.addEventListener('lit-localize-status', (event) => {
//   const { detail } = event;
//   console.log(detail);
// });
