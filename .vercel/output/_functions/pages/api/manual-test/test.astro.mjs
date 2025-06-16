export { renderers } from '../../../renderers.mjs';

// Create a simple API test endpoint
const GET = async () => {
  return new Response(JSON.stringify({ 
    status: 'success',
    message: 'Manual test sessions API working!'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
