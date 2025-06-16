/**
 * Client-side utility functions for interacting with the test automation API
 */

// Runner API
export const runnerApi = {
  /**
   * Get the current status of the test runner
   */
  async getStatus() {
    const response = await fetch('/api/runner');
    return response.json();
  },
  
  /**
   * Run a test suite
   * @param {string} suite - The test suite to run
   * @param {string} [grep] - Optional grep pattern to filter tests
   */
  async runTest(suite, grep) {
    const response = await fetch('/api/runner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'run', suite, grep })
    });
    return response.json();
  },
  
  /**
   * Stop the currently running test
   */
  async stopTest() {
    const response = await fetch('/api/runner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stop' })
    });
    return response.json();
  },
  
  /**
   * Connect to the WebSocket for real-time updates
   * @param {Object} handlers - Event handlers for WebSocket events
   * @returns {WebSocket} The WebSocket connection
   */
  connectWebSocket(handlers = {}) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/runner/ws`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Connected to WebSocket');
      if (handlers.onOpen) handlers.onOpen();
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (handlers.onMessage) handlers.onMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      if (handlers.onClose) handlers.onClose();
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (handlers.onError) handlers.onError(error);
    };
    
    return ws;
  }
};

// AI API
export const aiApi = {
  /**
   * Generate test cases from a specification
   * @param {Object} options - Generation options
   */
  async generateTest(options) {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate',
        options
      })
    });
    return response.json();
  },
  
  /**
   * Run visual regression testing
   * @param {Object} options - Visual regression options
   */
  async runVisualTest(options) {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'visual',
        options
      })
    });
    return response.json();
  },
  
  /**
   * Prioritize test cases
   * @param {Object} options - Prioritization options
   */
  async prioritizeTests(options) {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'prioritize',
        options
      })
    });
    return response.json();
  }
};

// Manual Test API
export const manualTestApi = {
  /**
   * Get the list of available manual tests
   */
  async listSessions() {
    const response = await fetch('/api/manual-test/sessions');
    return response.json();
  },
  
  /**
   * Start recording a manual test
   * @param {string} sessionId - The session ID for recording
   * @param {string} testName - The name of the test to record
   */
  async startRecording(sessionId, testName) {
    const response = await fetch('/api/manual-test/record/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, testName })
    });
    return response.json();
  },
  
  /**
   * Record an action during a manual test recording
   * @param {string} sessionId - The session ID of the recording
   * @param {object} action - The action to record
   */
  async recordAction(sessionId, action) {
    const response = await fetch('/api/manual-test/record/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, action })
    });
    return response.json();
  },
  
  /**
   * Stop recording a manual test
   * @param {string} sessionId - The session ID of the recording
   */
  async stopRecording(sessionId) {
    const response = await fetch('/api/manual-test/record/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    return response.json();
  },
  
  /**
   * Replay a manual test
   * @param {string} testName - The name of the test to replay
   */
  async replayTest(testName) {
    const response = await fetch('/api/manual-test/replay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testName })
    });
    return response.json();
  }
};

export default {
  runner: runnerApi,
  ai: aiApi,
  manualTest: manualTestApi
};
