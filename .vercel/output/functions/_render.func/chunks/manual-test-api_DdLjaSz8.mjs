import express from 'express';

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
function createSimulator() {
  // Check if we're in a serverless environment
  const isServerless = process.env.VERCEL === '1' || process.env.IS_SERVERLESS === 'true';
  
  if (isServerless) {
    console.log('Using serverless-compatible manual test simulator (mock functionality)');
    return new ServerlessManualTestSimulator();
  } else {
    console.log('Using full browser automation manual test simulator');
    // Import the real simulator dynamically to avoid build issues in serverless environments
    return import('./simulator_DN40ipog.mjs').then(module => {
      const ManualTestSimulator = module.default;
      return new ManualTestSimulator();
    }).catch(error => {
      console.error('Failed to load browser simulator, falling back to serverless version:', error);
      return new ServerlessManualTestSimulator();
    });
  }
}

class ManualTestAPI {
  constructor() {
    this.router = express.Router();
    this.simulator = null;
    this.setupRoutes();
    this.initializeSimulator();
  }
  
  async initializeSimulator() {
    try {
      // Use the factory function to get the appropriate simulator based on environment
      this.simulator = await createSimulator();
    } catch (error) {
      console.error('Failed to initialize manual test simulator:', error);
    }
  }

  setupRoutes() {
    // Start recording a manual test session
    this.router.post('/record/start', async (req, res) => {
      try {
        const { url, sessionId } = req.body;
        
        if (!url) {
          return res.status(400).json({ error: 'URL is required' });
        }

        const session = await this.simulator.startRecording(url, sessionId);
        res.json({ success: true, session });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Stop recording
    this.router.post('/record/stop', async (req, res) => {
      try {
        const session = await this.simulator.stopRecording();
        res.json({ success: true, session });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Replay a recorded session
    this.router.post('/replay/:sessionId', async (req, res) => {
      try {
        const { sessionId } = req.params;
        const options = req.body || {};
        
        const result = await this.simulator.replaySession(sessionId, options);
        res.json({ success: true, result });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get list of recorded sessions
    this.router.get('/sessions', async (req, res) => {
      try {
        const sessions = await this.simulator.listSessions();
        res.json({ success: true, sessions });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get specific session details
    this.router.get('/sessions/:sessionId', async (req, res) => {
      try {
        const { sessionId } = req.params;
        const session = await this.simulator.loadSession(sessionId);
        
        if (!session) {
          return res.status(404).json({ error: 'Session not found' });
        }
        
        res.json({ success: true, session });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Delete a session
    this.router.delete('/sessions/:sessionId', async (req, res) => {
      try {
        const { sessionId } = req.params;
        const fs = await import('fs/promises');
        const path = await import('path');
        
        // Delete session file
        const sessionPath = path.join('./manual-tests/sessions', `${sessionId}.json`);
        
        // Check if the session exists first
        try {
          await fs.access(sessionPath);
        } catch (error) {
          return res.status(404).json({ error: 'Session not found' });
        }
        
        // Delete the session file
        await fs.unlink(sessionPath);
        
        // Also try to delete related files if they exist
        try {
          // Try to find and delete recording files
          const recordingsDir = './manual-tests/recordings';
          const recordingFiles = await fs.readdir(recordingsDir);
          const sessionRecordings = recordingFiles.filter(file => file.includes(sessionId));
          for (const file of sessionRecordings) {
            await fs.unlink(path.join(recordingsDir, file));
          }
        } catch (error) {
          console.log('No recordings to delete or error deleting recordings:', error.message);
        }
        
        try {
          // Try to find and delete screenshot files
          const screenshotsDir = './manual-tests/screenshots';
          const screenshotFiles = await fs.readdir(screenshotsDir);
          const sessionScreenshots = screenshotFiles.filter(file => file.includes(sessionId));
          for (const file of sessionScreenshots) {
            await fs.unlink(path.join(screenshotsDir, file));
          }
        } catch (error) {
          console.log('No screenshots to delete or error deleting screenshots:', error.message);
        }
        
        try {
          // Try to find and delete replay result files
          const resultsDir = './manual-tests/results';
          const resultFiles = await fs.readdir(resultsDir);
          const sessionResults = resultFiles.filter(file => file.includes(sessionId));
          for (const file of sessionResults) {
            await fs.unlink(path.join(resultsDir, file));
          }
        } catch (error) {
          console.log('No result files to delete or error deleting results:', error.message);
        }
        
        res.json({ success: true, message: 'Session deleted with all related files' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

export { ManualTestAPI as M };
