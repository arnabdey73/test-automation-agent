# Test Automation Agent

A comprehensive test automation orchestration tool with a modern web UI dashboard built with Astro and Playwright.

## Project Structure

```bash
test-automation-agent/
├── agent-ui/                # Web UI built with Astro + React
├── tests/                   # Playwright-based test suites
│   ├── ui/                  # UI test cases
│   ├── regression/          # Regression test cases
│   ├── generated/           # AI-generated test cases
│   └── visual-baselines/    # Baseline images for visual comparison
├── runner/                  # Node.js server to orchestrate testing
├── ai/                      # AI-powered testing features
│   ├── samples/             # Sample specifications for test generation
│   ├── manual-test/         # Manual test simulation
│   ├── gpt-test-generator.js  # GPT-based test generation
│   ├── visual-regression.js   # Screenshot comparison for UI regression
│   └── test-prioritization.js # Test prioritization based on history
├── config/                  # Test configuration files
├── test-results/            # Test results and artifacts
│   └── visual-diff/         # Visual regression comparison results
├── manual-tests/            # Manual test simulation artifacts
│   ├── sessions/            # Recorded test session data
│   ├── recordings/          # Video recordings of test sessions
│   ├── screenshots/         # Screenshots captured during tests
│   └── results/             # Replay results and analysis
├── azure-pipelines.yml      # CI/CD configuration for Azure DevOps
└── package.json             # Root package.json with workspace configuration
```

## Tech Stack

| Component       | Tool                 |
| --------------- | -------------------- |
| UI Framework    | Astro with React     |
| Testing Library | Playwright           |
| Test Runner     | Playwright Test      |
| UI Controls     | Tailwind CSS         |
| Report Output   | HTML report + logs   |
| CI Integration  | Vercel deploy        |

## Features

- **Modern Dashboard**: Real-time view of test execution and results
- **Test Suite Management**: Organize and execute test suites
- **Comprehensive Reports**: Detailed reports with metrics and visualizations
- **Configurable Environment**: Easy configuration for different test environments
- **CI/CD Integration**: Built-in support for Azure DevOps and Vercel deployment
- **AI-Powered Test Generation**: Automatically generate test cases using AI
- **Visual Regression Testing**: Detect UI changes with automated screenshot comparisons
- **Test Prioritization**: Intelligent test prioritization based on historical data

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/test-automation-agent.git
cd test-automation-agent
```

1. Install dependencies:

```bash
npm install
```

1. Install Playwright browsers:

```bash
cd tests
npx playwright install
cd ..
```

### Running the Application

Start the development server:

```bash
npm run dev
```

This will:

- Start the Astro UI at `http://localhost:3000`
- Start the runner API server at `http://localhost:3001`

### Running Tests

Run all tests:

```bash
npm test
```

Run specific test suites:

```bash
npm run test:ui        # Run UI tests
npm run test:regression # Run regression tests
```

View the HTML report:

```bash
npm run report
```

## Project Components

### Agent UI

The Agent UI is built with Astro and React, providing a modern and responsive interface for managing and monitoring tests. It includes:

- Dashboard for test execution overview
- Test suite management
- Detailed test results and reports
- Configuration interface

### Tests

Tests are written using Playwright Test, a modern end-to-end testing framework. The project includes:

- UI tests for testing the user interface
- Regression tests for ensuring functionality works as expected
- Configurable test environments
- AI-generated test cases for enhanced coverage
- Visual baselines for visual regression testing

### Runner

The runner is a Node.js server that orchestrates test execution and provides real-time updates via WebSockets. It includes:

- REST API for test management
- WebSocket server for real-time updates
- Test execution orchestration

### AI Features

The AI features provide advanced testing capabilities, including:

- Test case generation using GPT models
- Visual regression testing with automated screenshot comparisons
- Test prioritization based on historical test data

#### GPT-based Test Generation

The test automation agent integrates OpenAI's GPT models to automatically generate test cases from specifications, feature files, or API documentation.

##### Usage

Generate tests from a JSON specification:

```bash
npm run ai:generate:spec -- --spec ./ai/samples/login-spec.json --output ./tests/generated/login.test.ts
```

Generate tests from a feature file:

```bash
npm run ai:generate:feature -- --feature ./ai/samples/shopping-cart.feature --output ./tests/generated/shopping-cart.test.ts
```

Generate API tests from documentation:

```bash
npm run ai:generate:api -- --api-docs ./ai/samples/api-docs.md --output ./tests/generated/api.test.ts
```

#### Visual Regression Testing

The agent includes built-in visual regression testing capabilities that compare screenshots against baselines to detect UI changes.

##### Usage

Run visual regression tests:

```bash
npm run test:visual
```

Update baseline images:

```bash
npm run test:visual:update
```

#### Test Prioritization

The agent uses historical test results to prioritize tests based on failure rates, execution times, and recent code changes.

##### Usage

Run tests in prioritized order:

```bash
npm run test:priority
```

Update test history:

```bash
npm run ai:history:update
```

#### Manual Test Simulation

The agent includes a powerful manual test simulation feature that allows you to record, replay, and manage manual browser sessions. This is useful for capturing complex user interactions that are difficult to script.

##### Usage

Start the manual test simulation interface:

```bash
npm run test:manual:record
```

This will start a server with endpoints for managing manual test sessions and open a web interface for recording and replaying test sessions.

The manual test simulation feature provides:

- **Browser Recording**: Record real user interactions in a browser session
- **Step-by-Step Replay**: Replay recorded sessions with configurable delays
- **Screenshots**: Capture screenshots for each interaction
- **Session Management**: Browse, view, and delete recorded sessions
- **API Access**: Programmatic access to record and replay functionality
- **Video Recording**: Capture video recordings of manual sessions

The manual test simulation uses Playwright to control a browser instance and can be integrated with your automated testing workflow.

### Configuration

AI features can be configured in the `config/ai-config.json` file:

```json
{
  "openai": {
    "model": "gpt-4o",
    "temperature": 0.2,
    "maxTokens": 4096
  },
  "testGeneration": { ... },
  "visualRegression": { ... },
  "testPrioritization": { ... }
}
```

Additionally, set the `OPENAI_API_KEY` environment variable for GPT-based test generation:

```bash
export OPENAI_API_KEY="your-api-key"
```

### Configuration

The configuration directory contains settings for:

- Test environments (development, staging, production)
- Test execution parameters
- Reporting options
- CI/CD integration settings

## Deployment

### Azure DevOps Setup

The project uses Azure DevOps for CI/CD pipelines. To set up:

1. Import the repository into Azure DevOps
2. Create a pipeline using the `azure-pipelines.yml` file in the root
3. Add the following pipeline variables in Azure DevOps:
   - `VERCEL_TOKEN`: Your Vercel deployment token
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `OPENAI_API_KEY`: Your OpenAI API key for AI features (optional if not using AI features)

### Vercel Deployment

The UI component is configured to deploy on Vercel:

1. Create a new project in Vercel
2. Link it to your repository
3. Set the following settings:
   - **Framework Preset**: Astro
   - **Root Directory**: agent-ui
   - **Build Command**: npm run build
   - **Output Directory**: dist
   - **Environment Variables**: Add any required environment variables

Or deploy directly using Vercel CLI:

```bash
cd agent-ui
vercel --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
