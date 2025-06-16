/**
 * Manual Test Simulator - Serverless Compatible Version
 * 
 * This version provides mock functionality for serverless environments (like Vercel)
 * where browser automation via Playwright is not possible.
 * 
 * For development or server environments, use the full simulator.js implementation.
 */

class ServerlessManualTestSimulator {
  constructor() {
    this.isRecording = false;
    this.recordedSteps = [];
    this.sessionId = null;
  }

  async initialize() {
    console.log('Initializing serverless manual test simulator (mock functionality)');
    return true;
  }

  async startRecording(url, sessionId) {
    this.isRecording = true;
    this.sessionId = sessionId;
    this.recordedSteps = [];
    
    console.log(`[Mock] Started recording session ${sessionId} for URL: ${url}`);
    
    return {
      success: true,
      message: 'Started recording session (serverless mock)',
      sessionId: this.sessionId
    };
  }

  async stopRecording() {
    this.isRecording = false;
    
    console.log(`[Mock] Stopped recording session ${this.sessionId}`);
    
    return {
      success: true,
      message: 'Stopped recording session (serverless mock)',
      sessionId: this.sessionId,
      steps: this.recordedSteps
    };
  }

  async recordAction(action) {
    if (!this.isRecording) {
      return { 
        success: false,
        error: 'No active recording session' 
      };
    }
    
    const mockStep = {
      type: action.type,
      selector: action.selector,
      value: action.value,
      timestamp: Date.now(),
      screenshot: 'mock-screenshot.png'
    };
    
    this.recordedSteps.push(mockStep);
    
    console.log(`[Mock] Recorded ${action.type} action`);
    
    return {
      success: true,
      message: `Recorded ${action.type} action (serverless mock)`
    };
  }

  async getSessions() {
    return {
      success: true,
      sessions: [
        {
          sessionId: 'mock-session-1',
          steps: 5,
          duration: 12345,
          createdAt: new Date().toISOString()
        }
      ]
    };
  }

  async getSessionDetails(sessionId) {
    return {
      success: true,
      session: {
        sessionId: sessionId || 'mock-session-1',
        steps: this.recordedSteps.length || 5,
        duration: 12345,
        createdAt: new Date().toISOString(),
        steps: this.recordedSteps.length > 0 ? this.recordedSteps : [
          { 
            type: 'navigation',
            url: 'https://example.com',
            timestamp: Date.now() - 5000
          }
        ]
      }
    };
  }

  async replaySession(sessionId) {
    console.log(`[Mock] Replaying session ${sessionId}`);
    
    return {
      success: true,
      message: `Replayed session ${sessionId} (serverless mock)`,
      result: {
        sessionId: sessionId,
        steps: 5,
        passedSteps: 5,
        failedSteps: 0
      }
    };
  }

  async close() {
    console.log('[Mock] Closed simulator');
    this.isRecording = false;
    this.recordedSteps = [];
    this.sessionId = null;
  }
}

// Create a function to determine which simulator to use based on environment
export function createSimulator() {
  // Check if we're in a serverless environment
  const isServerless = process.env.VERCEL === '1' || process.env.IS_SERVERLESS === 'true';
  
  if (isServerless) {
    console.log('Using serverless-compatible manual test simulator (mock functionality)');
    return new ServerlessManualTestSimulator();
  } else {
    console.log('Using full browser automation manual test simulator');
    // Import the real simulator dynamically to avoid build issues in serverless environments
    return import('./simulator.js').then(module => {
      const ManualTestSimulator = module.default;
      return new ManualTestSimulator();
    }).catch(error => {
      console.error('Failed to load browser simulator, falling back to serverless version:', error);
      return new ServerlessManualTestSimulator();
    });
  }
}

export default ServerlessManualTestSimulator;
