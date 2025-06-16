import { c as createComponent, r as renderHead, f as renderScript, e as renderTemplate } from '../chunks/astro/server_XfSfJGYl.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                               */
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" data-astro-cid-zetdm5md> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>404 - Not Found</title>${renderHead()}</head> <body data-astro-cid-zetdm5md> <h1 data-astro-cid-zetdm5md>404</h1> <p data-astro-cid-zetdm5md>Page not found</p> <div data-astro-cid-zetdm5md> <h2 data-astro-cid-zetdm5md>Request Details</h2> <pre id="requestInfo" data-astro-cid-zetdm5md>Loading request info...</pre> </div> ${renderScript($$result, "/Users/arnabd73/Documents/test-automation-agent/src/pages/404.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/Users/arnabd73/Documents/test-automation-agent/src/pages/404.astro", void 0);

const $$file = "/Users/arnabd73/Documents/test-automation-agent/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
