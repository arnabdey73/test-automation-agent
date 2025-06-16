import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to manual tests directory
const manualTestDir = path.resolve(__dirname, '../../../../../../manual-tests');

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { sessionId, testName, url } = data;
    
    if (!sessionId || !testName) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Session ID and test name are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    if (!url) {
      return new Response(JSON.stringify({
        success: false,
        error: 'URL is required to start recording'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Create directory if it doesn't exist
    try {
      await fs.mkdir(manualTestDir, { recursive: true });
    } catch (err) {
      // Directory already exists, continue
    }
    
    // Create a new test session
    const sessionData = {
      sessionId,
      testName,
      startUrl: url,
      createdAt: new Date().toISOString(),
      steps: [],
      isRecording: true
    };
    
    // Save session data to file
    const sessionFilePath = path.join(manualTestDir, `${sessionId}.json`);
    await fs.writeFile(sessionFilePath, JSON.stringify(sessionData, null, 2));
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Recording started',
      session: sessionData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error starting recording:', error);
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
