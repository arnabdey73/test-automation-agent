import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
export { renderers } from '../../../../renderers.mjs';

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to manual tests directory
const manualTestDir = path.resolve(__dirname, '../../../../../../manual-tests');

const POST = async ({ request }) => {
  try {
    // Get session ID from request body
    let sessionId;
    try {
      const data = await request.json();
      sessionId = data.sessionId;
    } catch (e) {
      // No session ID in JSON body, continue without it
    }

    // Find the most recent recording session if no sessionId was provided
    if (!sessionId) {
      try {
        const files = await fs.readdir(manualTestDir);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        // Sort by modified time, newest first
        const sorted = await Promise.all(jsonFiles.map(async (file) => {
          const stat = await fs.stat(path.join(manualTestDir, file));
          return { file, mtime: stat.mtime };
        }));
        sorted.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
        
        if (sorted.length > 0) {
          const newestFile = sorted[0].file;
          sessionId = path.basename(newestFile, '.json');
        }
      } catch (err) {
        console.error('Error finding active session:', err);
      }
    }
    
    // If we still don't have a sessionId, return an error
    if (!sessionId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No active recording session found'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Load the session file
    const sessionFilePath = path.join(manualTestDir, `${sessionId}.json`);
    let sessionData;
    
    try {
      const fileContent = await fs.readFile(sessionFilePath, 'utf-8');
      sessionData = JSON.parse(fileContent);
      
      // Mark recording as stopped
      sessionData.isRecording = false;
      sessionData.completedAt = new Date().toISOString();
      
      // Save updated session data
      await fs.writeFile(sessionFilePath, JSON.stringify(sessionData, null, 2));
    } catch (err) {
      return new Response(JSON.stringify({
        success: false,
        error: `Could not find or update session ${sessionId}`
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Recording stopped',
      session: sessionData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error stopping recording:', error);
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
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
