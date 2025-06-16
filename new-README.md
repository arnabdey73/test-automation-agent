# Test Automation Agent with Astro

A comprehensive test automation orchestration tool with an Astro UI dashboard.

## Features

- **Unified Astro Interface**: Modern, fast, and responsive UI built with Astro
- **AI-powered Test Generation**: Generate test cases from specifications
- **Visual Regression Testing**: Compare screenshots and detect visual changes
- **Test Prioritization**: Intelligently prioritize tests based on changes
- **Real-time Test Execution**: Watch tests as they run with WebSocket updates
- **Manual Test Simulation**: Record and replay manual test scenarios
- **Playwright Integration**: Built-in support for Playwright tests

## Project Structure

```
test-automation-agent/
├── astro.config.mjs     # Astro configuration
├── package.json         # Project dependencies and scripts
├── setup.js             # Setup script
├── tailwind.config.mjs  # Tailwind CSS configuration
├── public/              # Static assets
├── src/
│   ├── components/      # React and Astro components
│   ├── layouts/         # Astro layouts
│   ├── lib/             # Utility functions and hooks
│   ├── pages/           # Astro pages and routes
│   │   ├── api/         # API endpoints
│   ├── services/        # Service modules
│   │   ├── ai/          # AI modules for test generation
│   │   └── runner/      # Test runner services
│   └── styles/          # Global styles
├── tests/               # Playwright tests
│   ├── generated/       # AI-generated tests
│   ├── regression/      # Regression tests
│   └── ui/              # UI tests
├── manual-tests/        # Manual test recordings
└── test-results/        # Test results and reports
```

## Getting Started

1. Clone the repository
2. Set up your environment:

```bash
# Install dependencies and set up the project
npm run setup
```

3. Run the application:

```bash
# Start the development server
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project
- `npm run preview` - Preview the built project
- `npm run test` - Run all tests
- `npm run test:ui` - Run UI tests
- `npm run test:regression` - Run regression tests
- `npm run test:generated` - Run AI-generated tests
- `npm run test:manual:record` - Record a manual test
- `npm run test:manual:replay` - Replay a manual test
- `npm run report` - Show the test report
- `npm run ai:generate` - Generate test cases
- `npm run ai:visual` - Run visual regression tests
- `npm run ai:prioritize` - Prioritize tests for execution

## Environment Variables

- `OPENAI_API_KEY` - API key for OpenAI (required for AI test generation)

## Technologies

- Astro: Web framework
- React: Component library
- Tailwind CSS: Styling
- Playwright: Testing framework
- OpenAI API: AI-powered test generation
