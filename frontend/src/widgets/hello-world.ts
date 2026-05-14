import {
  css,
  html,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";
import {
  customElement,
  property,
} from "https://cdn.jsdelivr.net/npm/lit@3.3.1/decorators.js";

import { localized, msg, str } from "../_share/locales.ts";

// import { stylize } from "../_share/stylize.ts";

// import "https://cdn.skypack.dev/@material/web/button/filled-button.js";
// import "https://cdn.skypack.dev/@material/web/field/outlined-field.js";

@customElement("hello-world")
@localized()
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      border-radius: 8px;
      padding: 16px;
      max-width: 800px;
      text-align: center;
      color: var(--text-color, white);
      --md-outlined-text-field-input-text-color: var(--text-color, white);
      --md-outlined-text-field-focus-input-text-color: var(--text-color, white);
    }
    h2 {
      color: #ccc;
      text-align: center;
    }
    md-filled-button {
      margin-left: 0.25rem;
    }
  `;

  @property()
  accessor name = "World";

  @property({ type: Number })
  accessor count = 0;

  firstUpdated() {
    // stylize(this.renderRoot);
  }

  render() {
    return html`
      <h2>${this.sayHello(this.name)}! ${this.count}</h2>
      <md-filled-button @click="${() =>
        setLocale("zh_CN")}">中文</md-filled-button>
      <md-filled-button @click="${() => setLocale("en")}">en</md-filled-button>
      <md-filled-button @click="${this._onClick}">${msg(
        str`biu: ${this.count}`,
      )}</md-filled-button>
      <p><md-outlined-text-field label="Hello"></md-outlined-text-field></p>
      <slot></slot>
    `;
  }

  private _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent("count-changed"));
  }

  /**
   * Formats a greeting
   * @param name The name to say "Hello" to
   */
  sayHello(name: string): string {
    return `${msg(str`Hello`)}, ${name}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hello-world": MyElement;
  }
}
