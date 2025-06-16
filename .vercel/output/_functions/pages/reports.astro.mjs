import { c as createComponent, g as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_XfSfJGYl.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_B8K-Koss.mjs';
import { B as Button, C as Card, a as CardHeader, b as CardTitle, d as CardContent, e as CardFooter } from '../chunks/button_CcYLK9_q.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
export { renderers } from '../renderers.mjs';

const $$Reports = createComponent(async ($$result, $$props, $$slots) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  path.resolve(__dirname, "../../../test-results");
  async function loadReports() {
    try {
      return [];
    } catch (error) {
      console.error("Error loading reports:", error);
      return [];
    }
  }
  const reports = await loadReports();
  function calculateSuccessPercentage(stats) {
    if (!stats || !stats.total || stats.total === 0) return "0.0";
    return (stats.passed / stats.total * 100).toFixed(1);
  }
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Test Automation Agent - Reports" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-8"> <div> <h2 class="text-3xl font-bold tracking-tight">Test Reports</h2> <p class="text-muted-foreground">View test execution results and download reports</p> </div> <div class="flex justify-between items-center"> <div> <h3 class="text-xl font-semibold">Recent Reports</h3> </div> <div class="space-x-2"> ${renderComponent($$result2, "Button", Button, { "client:visible": true, "variant": "outline", "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result3) => renderTemplate`Filter` })} ${renderComponent($$result2, "Button", Button, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result3) => renderTemplate`Generate Report` })} </div> </div> <div class="grid gap-4"> ${reports.length > 0 ? reports.map((report) => renderTemplate`${renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` <div class="flex flex-col md:flex-row justify-between md:items-center gap-2"> ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "text-xl" }, { "default": async ($$result5) => renderTemplate`${report.name || "Unnamed Report"}` })} <span class="text-sm text-muted-foreground">
Generated: ${report.date ? new Date(report.date).toLocaleString() : "Date not available"} </span> </div> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="grid gap-6 md:grid-cols-2"> <div class="space-y-2"> <div class="flex justify-between"> <span class="text-sm font-medium">Status</span> <span class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"> ${report.status || "unknown"} </span> </div> <div class="flex justify-between"> <span class="text-sm font-medium">Duration</span> <span>${report.duration || "N/A"}</span> </div> <div class="flex justify-between"> <span class="text-sm font-medium">Success Rate</span> <span>${report.stats ? calculateSuccessPercentage(report.stats) : "0.0"}%</span> </div> </div> <div class="grid grid-cols-4 gap-2 text-center"> <div class="rounded-md border p-2"> <span class="text-sm font-medium">Total</span> <p class="text-2xl font-bold">${report.stats?.total || 0}</p> </div> <div class="rounded-md border p-2 bg-success/10 text-success border-success/20"> <span class="text-sm font-medium">Passed</span> <p class="text-2xl font-bold">${report.stats?.passed || 0}</p> </div> <div class="rounded-md border p-2 bg-destructive/10 text-destructive border-destructive/20"> <span class="text-sm font-medium">Failed</span> <p class="text-2xl font-bold">${report.stats?.failed || 0}</p> </div> <div class="rounded-md border p-2 bg-muted/50 text-muted-foreground border-muted"> <span class="text-sm font-medium">Skipped</span> <p class="text-2xl font-bold">${report.stats?.skipped || 0}</p> </div> </div> </div> ` })} ${renderComponent($$result3, "CardFooter", CardFooter, {}, { "default": async ($$result4) => renderTemplate` <div class="flex w-full justify-between"> ${renderComponent($$result4, "Button", Button, { "client:visible": true, "variant": "outline", "size": "sm", "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result5) => renderTemplate`View Details` })} <div class="space-x-2"> ${renderComponent($$result4, "Button", Button, { "client:visible": true, "variant": "ghost", "size": "sm", "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result5) => renderTemplate`
Share
` })} ${renderComponent($$result4, "Button", Button, { "client:visible": true, "variant": "outline", "size": "sm", "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result5) => renderTemplate`
Download HTML
` })} </div> </div> ` })} ` })}`) : renderTemplate`${renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardContent", CardContent, { "className": "pt-6" }, { "default": async ($$result4) => renderTemplate` <div class="text-center py-8"> <h3 class="text-xl font-medium mb-2">No Reports Available</h3> <p class="text-muted-foreground mb-6">Run your tests to generate reports</p> ${renderComponent($$result4, "Button", Button, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result5) => renderTemplate`Run Tests` })} </div> ` })} ` })}`} </div> </div> ` })}`;
}, "/Users/arnabd73/Documents/test-automation-agent/src/pages/reports.astro", void 0);

const $$file = "/Users/arnabd73/Documents/test-automation-agent/src/pages/reports.astro";
const $$url = "/reports";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Reports,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
