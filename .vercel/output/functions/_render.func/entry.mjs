import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_BV6Tzc59.mjs';
import { manifest } from './manifest_CWpaUS6w.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/api/ai.astro.mjs');
const _page3 = () => import('./pages/api/manual-test/record/action.astro.mjs');
const _page4 = () => import('./pages/api/manual-test/record/start.astro.mjs');
const _page5 = () => import('./pages/api/manual-test/record/stop.astro.mjs');
const _page6 = () => import('./pages/api/manual-test/replay.astro.mjs');
const _page7 = () => import('./pages/api/manual-test/sessions.astro.mjs');
const _page8 = () => import('./pages/api/manual-test/test.astro.mjs');
const _page9 = () => import('./pages/api/runner/ws.astro.mjs');
const _page10 = () => import('./pages/api/runner.astro.mjs');
const _page11 = () => import('./pages/api/test.astro.mjs');
const _page12 = () => import('./pages/api-test.astro.mjs');
const _page13 = () => import('./pages/config.astro.mjs');
const _page14 = () => import('./pages/manual-tests.astro.mjs');
const _page15 = () => import('./pages/reports.astro.mjs');
const _page16 = () => import('./pages/tests.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/api/ai/index.js", _page2],
    ["src/pages/api/manual-test/record/action.js", _page3],
    ["src/pages/api/manual-test/record/start.js", _page4],
    ["src/pages/api/manual-test/record/stop.js", _page5],
    ["src/pages/api/manual-test/replay/index.js", _page6],
    ["src/pages/api/manual-test/sessions.js", _page7],
    ["src/pages/api/manual-test/test.js", _page8],
    ["src/pages/api/runner/ws.js", _page9],
    ["src/pages/api/runner/index.js", _page10],
    ["src/pages/api/test.js", _page11],
    ["src/pages/api-test.astro", _page12],
    ["src/pages/config/index.astro", _page13],
    ["src/pages/manual-tests.astro", _page14],
    ["src/pages/reports.astro", _page15],
    ["src/pages/tests.astro", _page16],
    ["src/pages/index.astro", _page17]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "27aee2b6-b026-45f5-89fb-ac390bc0da81",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
