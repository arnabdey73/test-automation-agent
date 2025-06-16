import ManualTestAPI from '../../../../services/runner/manual-test-api.js';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize ManualTestAPI
const manualTestDir = resolve(__dirname, '../../../../../../manual-tests');
const manualTestApi = new ManualTestAPI(manualTestDir);

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { testName } = data;
    
    if (!testName) {
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Test name is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const result = await manualTestApi.replayTest(testName);
    
    return new Response(JSON.stringify({
      status: 'success',
      message: 'Test replayed successfully',
      data: { testName, result }
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
