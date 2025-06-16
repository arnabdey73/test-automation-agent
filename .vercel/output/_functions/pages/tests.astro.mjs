import { c as createComponent, g as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_XfSfJGYl.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_B8K-Koss.mjs';
import { B as Button, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../chunks/button_CcYLK9_q.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
export { renderers } from '../renderers.mjs';

const $$Tests = createComponent(async ($$result, $$props, $$slots) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  path.resolve(__dirname, "../../../tests");
  async function loadTestSuites() {
    try {
      const testSuites2 = [
        {
          id: "ui-tests",
          name: "UI Tests",
          description: "Tests for user interface components and interactions",
          testCases: []
        },
        {
          id: "regression-tests",
          name: "Regression Tests",
          description: "Tests to ensure existing functionality continues to work",
          testCases: []
        },
        {
          id: "generated-tests",
          name: "AI-Generated Tests",
          description: "Tests generated with AI assistance",
          testCases: []
        }
      ];
      return testSuites2;
    } catch (error) {
      console.error("Error loading test suites:", error);
      return [];
    }
  }
  const testSuites = await loadTestSuites();
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Test Automation Agent - Test Suites" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-8"> <div> <h2 class="text-3xl font-bold tracking-tight">Test Suites</h2> <p class="text-muted-foreground">Manage and run your test suites</p> </div> <div class="flex justify-between items-center"> <div></div> <div class="space-x-2"> ${renderComponent($$result2, "Button", Button, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result3) => renderTemplate`Create Test Suite` })} ${renderComponent($$result2, "Button", Button, { "client:visible": true, "variant": "outline", "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result3) => renderTemplate`Import Tests` })} </div> </div> ${testSuites.map((suite) => renderTemplate`<div class="mb-8"> ${renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"> <div> ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "text-xl" }, { "default": async ($$result5) => renderTemplate`${suite.name}` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`${suite.description}` })} </div> <div class="flex gap-2"> ${renderComponent($$result4, "Button", Button, { "client:visible": true, "size": "sm", "variant": "outline", "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result5) => renderTemplate`Edit` })} ${renderComponent($$result4, "Button", Button, { "client:visible": true, "size": "sm", "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result5) => renderTemplate`Run Suite` })} </div> </div> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="space-y-4"> <div class="flex justify-between items-center border-b pb-2"> <span class="font-medium">Test Cases (${suite.testCases?.length || 0})</span> <span class="text-sm text-muted-foreground">No tests run yet</span> </div> <div class="space-y-2"> ${suite.testCases && suite.testCases.length > 0 ? suite.testCases.map((test) => renderTemplate`<div class="flex justify-between items-center py-2 px-2 hover:bg-muted/50 rounded-md"> <div class="flex items-center gap-2"> ${test.status && test.status === "passed" && renderTemplate`<span class="h-2 w-2 bg-success rounded-full"></span>`} ${test.status && test.status === "failed" && renderTemplate`<span class="h-2 w-2 bg-destructive rounded-full"></span>`} <span>${test.name || "Unnamed Test"}</span> </div> <div class="flex gap-2"> ${renderComponent($$result4, "Button", Button, { "client:visible": true, "size": "sm", "variant": "ghost", "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result5) => renderTemplate`View Details` })} ${renderComponent($$result4, "Button", Button, { "client:visible": true, "size": "sm", "variant": "outline", "client:component-hydration": "visible", "client:component-path": "/Users/arnabd73/Documents/test-automation-agent/src/components/ui/button", "client:component-export": "Button" }, { "default": async ($$result5) => renderTemplate`Run` })} </div> </div>`) : renderTemplate`<div class="text-center py-4 text-muted-foreground">No test cases found</div>`} </div> </div> ` })} ` })} </div>`)} </div> ` })}`;
}, "/Users/arnabd73/Documents/test-automation-agent/src/pages/tests.astro", void 0);

const $$file = "/Users/arnabd73/Documents/test-automation-agent/src/pages/tests.astro";
const $$url = "/tests";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tests,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
