import { initializeRunner } from '../../../services/runner/run.js';

// Initialize runner with default options
const runner = initializeRunner();

export const GET = async ({ request }) => {
  return new Response(JSON.stringify({ 
    status: 'running', 
    ...runner.testState 
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, suite, grep } = data;
    
    if (action === 'run') {
      runner.runTest({ suite, grep });
      return new Response(JSON.stringify({ status: 'started', suite }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else if (action === 'stop') {
      runner.stopTest();
      return new Response(JSON.stringify({ status: 'stopped' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
