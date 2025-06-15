import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ManualTestSimulator {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.isRecording = false;
    this.recordedSteps = [];
    this.sessionId = null;
  }

  async initialize() {
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000 // Slow down operations for better visibility
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: { dir: './manual-tests/recordings/' }
    });
  }

  async startRecording(url, sessionId) {
    if (!this.browser) await this.initialize();
    
    this.sessionId = sessionId || `session_${Date.now()}`;
    this.page = await this.context.newPage();
    this.isRecording = true;
    this.recordedSteps = [];

    // Navigate to the starting URL
    await this.page.goto(url);
    
    // Set up event listeners to record user interactions
    await this.setupRecordingListeners();
    
    return {
      sessionId: this.sessionId,
      status: 'recording',
      startUrl: url,
      timestamp: new Date().toISOString()
    };
  }

  async setupRecordingListeners() {
    // Record clicks
    await this.page.exposeFunction('recordClick', (selector, text) => {
      this.recordedSteps.push({
        type: 'click',
        selector,
        text,
        timestamp: Date.now(),
        screenshot: `step_${this.recordedSteps.length + 1}_click.png`
      });
    });

    // Record form inputs
    await this.page.exposeFunction('recordInput', (selector, value) => {
      this.recordedSteps.push({
        type: 'input',
        selector,
        value,
        timestamp: Date.now(),
        screenshot: `step_${this.recordedSteps.length + 1}_input.png`
      });
    });

    // Record navigation
    await this.page.exposeFunction('recordNavigation', (url) => {
      this.recordedSteps.push({
        type: 'navigation',
        url,
        timestamp: Date.now(),
        screenshot: `step_${this.recordedSteps.length + 1}_nav.png`
      });
    });

    // Inject recording script into the page
    await this.page.addInitScript(() => {
      // Record clicks
      document.addEventListener('click', (e) => {
        const selector = getSelector(e.target);
        const text = e.target.textContent?.trim() || '';
        window.recordClick(selector, text);
      });

      // Record form inputs
      document.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          const selector = getSelector(e.target);
          window.recordInput(selector, e.target.value);
        }
      });

      // Record navigation
      let lastUrl = window.location.href;
      setInterval(() => {
        if (window.location.href !== lastUrl) {
          window.recordNavigation(window.location.href);
          lastUrl = window.location.href;
        }
      }, 1000);

      function getSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ')[0]}`;
        return element.tagName.toLowerCase();
      }
    });
  }

  async stopRecording() {
    if (!this.isRecording) return null;

    this.isRecording = false;
    
    // Save the recorded session
    const session = {
      sessionId: this.sessionId,
      steps: this.recordedSteps,
      duration: this.recordedSteps.length > 0 ? 
        this.recordedSteps[this.recordedSteps.length - 1].timestamp - this.recordedSteps[0].timestamp : 0,
      createdAt: new Date().toISOString(),
      totalSteps: this.recordedSteps.length
    };

    await this.saveSession(session);
    await this.cleanup();

    return session;
  }

  async replaySession(sessionId, options = {}) {
    const session = await this.loadSession(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    if (!this.browser) await this.initialize();
    this.page = await this.context.newPage();

    const replayResults = {
      sessionId,
      startTime: Date.now(),
      steps: [],
      status: 'running'
    };

    try {
      for (let i = 0; i < session.steps.length; i++) {
        const step = session.steps[i];
        const stepResult = await this.executeStep(step, options);
        replayResults.steps.push(stepResult);

        // Add delay between steps for better visualization
        if (options.stepDelay) {
          await this.page.waitForTimeout(options.stepDelay);
        }
      }

      replayResults.status = 'completed';
      replayResults.endTime = Date.now();
      replayResults.duration = replayResults.endTime - replayResults.startTime;

    } catch (error) {
      replayResults.status = 'failed';
      replayResults.error = error.message;
    }

    await this.saveReplayResult(replayResults);
    return replayResults;
  }

  async executeStep(step, options) {
    const stepResult = {
      ...step,
      executed: false,
      error: null,
      executionTime: Date.now()
    };

    try {
      switch (step.type) {
        case 'click':
          await this.page.click(step.selector);
          stepResult.executed = true;
          break;

        case 'input':
          await this.page.fill(step.selector, step.value);
          stepResult.executed = true;
          break;

        case 'navigation':
          await this.page.goto(step.url);
          stepResult.executed = true;
          break;

        default:
          throw new Error(`Unknown step type: ${step.type}`);
      }

      // Take screenshot if enabled
      if (options.takeScreenshots) {
        const screenshotPath = `./manual-tests/screenshots/${step.screenshot}`;
        await this.page.screenshot({ path: screenshotPath });
        stepResult.screenshotPath = screenshotPath;
      }

    } catch (error) {
      stepResult.error = error.message;
      stepResult.executed = false;
    }

    return stepResult;
  }

  async saveSession(session) {
    const sessionsDir = './manual-tests/sessions';
    await fs.mkdir(sessionsDir, { recursive: true });
    
    const filePath = path.join(sessionsDir, `${session.sessionId}.json`);
    await fs.writeFile(filePath, JSON.stringify(session, null, 2));
  }

  async loadSession(sessionId) {
    try {
      const filePath = path.join('./manual-tests/sessions', `${sessionId}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async saveReplayResult(result) {
    const resultsDir = './manual-tests/results';
    await fs.mkdir(resultsDir, { recursive: true });
    
    const filePath = path.join(resultsDir, `replay_${result.sessionId}_${Date.now()}.json`);
    await fs.writeFile(filePath, JSON.stringify(result, null, 2));
  }

  async listSessions() {
    try {
      const sessionsDir = './manual-tests/sessions';
      const files = await fs.readdir(sessionsDir);
      const sessions = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const session = await this.loadSession(file.replace('.json', ''));
          sessions.push(session);
        }
      }

      return sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      return [];
    }
  }

  async cleanup() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    
    this.page = null;
    this.context = null;
    this.browser = null;
  }
}

export default ManualTestSimulator;
