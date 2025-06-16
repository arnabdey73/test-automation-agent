import { M as ManualTestAPI } from '../../../../chunks/manual-test-api_DdLjaSz8.mjs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
export { renderers } from '../../../../renderers.mjs';

// Get dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize ManualTestAPI
const manualTestDir = resolve(__dirname, '../../../../../../manual-tests');
const manualTestApi = new ManualTestAPI(manualTestDir);

const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { sessionId, action } = data;
    
    if (!sessionId || !action) {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Session ID and action are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    await manualTestApi.recordAction(sessionId, action);
    
    return new Response(JSON.stringify({
      status: 'success',
      message: 'Action recorded',
      data: { sessionId, action }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
