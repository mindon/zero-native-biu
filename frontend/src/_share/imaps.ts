const selfscript = document.currentScript! as HTMLScriptElement;
const q = new URL(selfscript.src).searchParams;
const imaps = document.createElement("script");
imaps.type = "importmap";
imaps.textContent = `{
"imports": {
    "@lit/reactive-element/": "https://cdn.jsdelivr.net/npm/@lit/reactive-element@2.1.1/"${
  q.has("three")
    ? `,"three": "https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.min.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.184.0/examples/jsm/",
    "three/fonts/": "https://cdn.jsdelivr.net/npm/three@0.184.0/examples/fonts/"`
    : ""
}${q.has("md") ? `,"@material/web/": "https://esm.run/@material/web/"` : ""}
}
}`;
const assets: Array<HTMLElement> = [imaps];

if (q.has("d3")) {
  const s = document.createElement("script");
  s.src =
    "https://tefs-static-cdn-1300241787.file.myqcloud.com/share/d3/d3.v7.min.js";
  s.crossOrigin = "anonymous";
  assets.push(s);
}

if (q.has("bootstrap")) {
  const s = document.createElement("link");
  s.rel = "stylesheet";
  s.href =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css";
  s.integrity =
    "sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB";
  s.crossOrigin = "anonymous";
  assets.push(s);
}
if (q.has("md")) {
  const s = document.createElement("script");
  s.type = "module";
  s.textContent = `import '@material/web/all.js';
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';
document.adoptedStyleSheets.push(typescaleStyles.styleSheet);`;
  assets.push(s);
}

const head = document.querySelector("head")!;
// assets.map((s) => head.insertBefore(s, selfscript));
assets.map((s) => document.write(s.outerHTML)); // !!! to make sure the script is loaded first
selfscript &&
  setTimeout(() => selfscript.parentElement?.removeChild(selfscript));
