import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
export { renderers } from '../../../renderers.mjs';

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to manual tests directory
const manualTestDir = path.resolve(__dirname, '../../../../../manual-tests');

const GET = async ({ request }) => {
  try {
    // Create directory if it doesn't exist
    try {
      await fs.mkdir(manualTestDir, { recursive: true });
    } catch (err) {
      // Directory already exists, continue
    }

    // List all test sessions in the manual tests directory
    const files = await fs.readdir(manualTestDir);
    const sessions = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(manualTestDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const session = JSON.parse(content);
          sessions.push({
            sessionId: session.sessionId || path.basename(file, '.json'),
            createdAt: session.createdAt || new Date().toISOString(),
            totalSteps: session.steps?.length || 0
          });
        } catch (err) {
          console.error(`Error reading session ${file}:`, err);
        }
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      sessions: sessions
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error listing test sessions:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
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
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
