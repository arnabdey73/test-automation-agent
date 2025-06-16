import { c as createComponent, g as renderComponent, f as renderScript, e as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_XfSfJGYl.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_B8K-Koss.mjs';
export { renderers } from '../renderers.mjs';

const $$ApiTest = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "API Test" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <h1 class="text-3xl font-bold mb-6">API Endpoint Tests</h1> <div class="bg-white shadow-md rounded-lg p-6 mb-6"> <h2 class="text-xl font-bold mb-4">Manual Test API</h2> <div class="mb-4"> <button id="listSessions" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
List Sessions
</button> <div id="sessionsResult" class="mt-2 p-2 bg-gray-100 rounded"></div> </div> <div class="mb-4"> <h3 class="text-lg font-bold mb-2">Start Recording</h3> <div class="flex gap-2 mb-2"> <input id="sessionId" type="text" placeholder="Session ID" class="border rounded p-2" value="test-session-1"> <input id="testName" type="text" placeholder="Test Name" class="border rounded p-2" value="Test Recording"> </div> <button id="startRecording" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
Start Recording
</button> <div id="startRecordingResult" class="mt-2 p-2 bg-gray-100 rounded"></div> </div> <div class="mb-4"> <h3 class="text-lg font-bold mb-2">Record Action</h3> <div class="flex gap-2 mb-2"> <input id="actionSessionId" type="text" placeholder="Session ID" class="border rounded p-2" value="test-session-1"> <input id="actionType" type="text" placeholder="Action Type" class="border rounded p-2" value="click"> <input id="actionTarget" type="text" placeholder="Target" class="border rounded p-2" value="#button"> </div> <button id="recordAction" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
Record Action
</button> <div id="recordActionResult" class="mt-2 p-2 bg-gray-100 rounded"></div> </div> <div class="mb-4"> <h3 class="text-lg font-bold mb-2">Stop Recording</h3> <div class="flex gap-2 mb-2"> <input id="stopSessionId" type="text" placeholder="Session ID" class="border rounded p-2" value="test-session-1"> </div> <button id="stopRecording" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
Stop Recording
</button> <div id="stopRecordingResult" class="mt-2 p-2 bg-gray-100 rounded"></div> </div> <div class="mb-4"> <h3 class="text-lg font-bold mb-2">Replay Test</h3> <div class="flex gap-2 mb-2"> <input id="replayTestName" type="text" placeholder="Test Name" class="border rounded p-2" value="Test Recording"> </div> <button id="replayTest" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
Replay Test
</button> <div id="replayTestResult" class="mt-2 p-2 bg-gray-100 rounded"></div> </div> </div> </div> ` })} ${renderScript($$result, "/Users/arnabd73/Documents/test-automation-agent/src/pages/api-test.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/arnabd73/Documents/test-automation-agent/src/pages/api-test.astro", void 0);

const $$file = "/Users/arnabd73/Documents/test-automation-agent/src/pages/api-test.astro";
const $$url = "/api-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ApiTest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
