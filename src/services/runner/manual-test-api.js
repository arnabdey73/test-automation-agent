import express from 'express';
import ManualTestSimulator from '../ai/manual-test/simulator.js';

class ManualTestAPI {
  constructor() {
    this.router = express.Router();
    this.simulator = new ManualTestSimulator();
    this.setupRoutes();
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

export default ManualTestAPI;
