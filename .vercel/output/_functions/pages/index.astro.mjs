import { c as createComponent, g as renderComponent, e as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_XfSfJGYl.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_B8K-Koss.mjs';
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, B as Button } from '../chunks/button_CcYLK9_q.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const testSuites = [
    {
      id: 1,
      name: "UI Tests",
      total: 12,
      passed: 10,
      failed: 1,
      skipped: 1,
      lastRun: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: 2,
      name: "API Tests",
      total: 8,
      passed: 7,
      failed: 1,
      skipped: 0,
      lastRun: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: 3,
      name: "Integration Tests",
      total: 5,
      passed: 4,
      failed: 1,
      skipped: 0,
      lastRun: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
  const totalTests = testSuites.reduce((acc, suite) => acc + suite.total, 0);
  const totalPassed = testSuites.reduce((acc, suite) => acc + suite.passed, 0);
  const totalFailed = testSuites.reduce((acc, suite) => acc + suite.failed, 0);
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Test Automation Agent - Dashboard" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-8"> <div> <h2 class="text-3xl font-bold tracking-tight mb-2">Dashboard</h2> <p class="text-muted-foreground">Overview of your test automation suites and recent results.</p> </div> <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> ${renderComponent($$result2, "Card", Card, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "className": "pb-2" }, { "default": ($$result4) => renderTemplate` <div class="flex items-center justify-between"> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": ($$result5) => renderTemplate`Total Tests` })} <div class="rounded-full bg-primary/10 p-2 text-primary"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M16 16v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M15 2H9a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5a1 1 0 0 0-.3-.7z"></path><path d="m21 8-2 2-4-4 2-2a1.4 1.4 0 0 1 2 0l2 2a1.4 1.4 0 0 1 0 2Z"></path><path d="m15 10-4 4v4h4l4-4"></path></svg> </div> </div> ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`All available test cases` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate` <p class="text-4xl font-bold">${totalTests}</p> <div class="mt-2 h-[4px] w-full bg-muted overflow-hidden rounded-full"> <div class="bg-primary h-full"${addAttribute(`width: ${totalPassed / totalTests * 100}%`, "style")}></div> </div> ` })} ` })} ${renderComponent($$result2, "Card", Card, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "className": "pb-2" }, { "default": ($$result4) => renderTemplate` <div class="flex items-center justify-between"> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": ($$result5) => renderTemplate`Passing` })} <div class="rounded-full bg-success/10 p-2 text-success"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> </div> </div> ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`Successfully passing tests` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate` <p class="text-4xl font-bold text-success">${totalPassed}</p> <div class="mt-2 h-[4px] w-full bg-muted overflow-hidden rounded-full"> <div class="bg-success h-full"${addAttribute(`width: ${totalPassed / totalTests * 100}%`, "style")}></div> </div> ` })} ` })} ${renderComponent($$result2, "Card", Card, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "className": "pb-2" }, { "default": ($$result4) => renderTemplate` <div class="flex items-center justify-between"> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": ($$result5) => renderTemplate`Failing` })} <div class="rounded-full bg-destructive/10 p-2 text-destructive"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </div> </div> ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`Tests that need attention` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate` <p class="text-4xl font-bold text-destructive">${totalFailed}</p> <div class="mt-2 h-[4px] w-full bg-muted overflow-hidden rounded-full"> <div class="bg-destructive h-full"${addAttribute(`width: ${totalFailed / totalTests * 100}%`, "style")}></div> </div> ` })} ` })} </div> <div class="space-y-4"> <div class="flex justify-between items-center"> <h3 class="text-xl font-semibold tracking-tight">Test Suites</h3> ${renderComponent($$result2, "Button", Button, { "variant": "outline", "size": "sm" }, { "default": ($$result3) => renderTemplate` <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
Run All Tests
` })} </div> <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> ${testSuites.map((suite) => renderTemplate`${renderComponent($$result2, "Card", Card, { "className": "overflow-hidden" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "className": "pb-2" }, { "default": ($$result4) => renderTemplate` <div class="flex justify-between items-start"> <div> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": ($$result5) => renderTemplate`${suite.name}` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`
Last run: ${new Date(suite.lastRun).toLocaleString()}` })} </div> <div class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors bg-primary/10 text-primary"> ${suite.total} Tests
</div> </div> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate` <div class="grid grid-cols-3 gap-4 text-center"> <div> <p class="text-xs text-muted-foreground">Total</p> <p class="text-2xl font-bold">${suite.total}</p> </div> <div> <p class="text-xs text-muted-foreground">Passed</p> <p class="text-2xl font-bold text-success">${suite.passed}</p> </div> <div> <p class="text-xs text-muted-foreground">Failed</p> <p class="text-2xl font-bold text-destructive">${suite.failed}</p> </div> </div> <div class="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-muted"> <div class="flex"> <div class="bg-success h-full"${addAttribute(`width: ${suite.passed / suite.total * 100}%`, "style")}></div> <div class="bg-destructive h-full"${addAttribute(`width: ${suite.failed / suite.total * 100}%`, "style")}></div> <div class="bg-muted h-full"${addAttribute(`width: ${suite.skipped / suite.total * 100}%`, "style")}></div> </div> </div> ` })} ` })}`)} </div> </div> <div class="space-y-4"> <div class="flex justify-between items-center"> <h3 class="text-xl font-semibold">Test Suites</h3> <div> ${renderComponent($$result2, "Button", Button, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": ($$result3) => renderTemplate`Run All Tests` })} </div> </div> <div class="grid gap-4"> ${testSuites.map((suite) => renderTemplate`${renderComponent($$result2, "Card", Card, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": ($$result4) => renderTemplate` <div class="flex justify-between items-start"> <div> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": ($$result5) => renderTemplate`${suite.name}` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": ($$result5) => renderTemplate`
Last run: ${new Date(suite.lastRun).toLocaleString()}` })} </div> ${renderComponent($$result4, "Button", Button, { "client:visible": true, "variant": "outline", "size": "sm", "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": ($$result5) => renderTemplate`Run Suite` })} </div> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": ($$result4) => renderTemplate` <div class="flex gap-4"> <div> <p class="text-sm font-medium">Total</p> <p class="text-2xl font-bold">${suite.total}</p> </div> <div> <p class="text-sm font-medium text-success">Passed</p> <p class="text-2xl font-bold text-success">${suite.passed}</p> </div> <div> <p class="text-sm font-medium text-destructive">Failed</p> <p class="text-2xl font-bold text-destructive">${suite.failed}</p> </div> <div> <p class="text-sm font-medium text-muted-foreground">Skipped</p> <p class="text-2xl font-bold text-muted-foreground">${suite.skipped}</p> </div> </div> <div class="mt-4 w-full bg-secondary rounded-full h-2 overflow-hidden"> <div class="flex h-full"> <div class="bg-success h-full"${addAttribute(`width: ${suite.passed / suite.total * 100}%`, "style")}></div> <div class="bg-destructive h-full"${addAttribute(`width: ${suite.failed / suite.total * 100}%`, "style")}></div> <div class="bg-muted h-full"${addAttribute(`width: ${suite.skipped / suite.total * 100}%`, "style")}></div> </div> </div> ` })} ` })}`)} </div> </div> </div> ` })}`;
}, "/Users/arnabd73/Documents/test-automation-agent/src/pages/index.astro", void 0);

const $$file = "/Users/arnabd73/Documents/test-automation-agent/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
