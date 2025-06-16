import { program } from 'commander';
import chalk from 'chalk';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Import ManualTestAPI
import ManualTestAPI from './manual-test-api.js';

// Get dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configure CLI options
program
  .option('--enable-manual-test', 'Enable manual test simulation', true)
  .option('--manual-test-dir <path>', 'Path to manual test directory', '../../../manual-tests')
  .option('--mode <mode>', 'Manual test mode (record or replay)', 'record')
  .option('--test-name <name>', 'Name of the test to record or replay')
  .option('--session-id <id>', 'Session ID for recording', Date.now().toString())
  .parse(process.argv);

const options = program.opts();

async function main() {
  if (!options.enableManualTest) {
    console.error(chalk.red('Manual testing is disabled.'));
    process.exit(1);
  }

  // Initialize ManualTestAPI
  const manualTestDir = resolve(__dirname, options.manualTestDir);
  const manualTestApi = new ManualTestAPI(manualTestDir);

  if (options.mode === 'record') {
    if (!options.testName) {
      console.error(chalk.red('Error: Test name is required for recording.'));
      console.log('Usage: npm run test:manual:record -- --test-name "Login Flow"');
      process.exit(1);
    }

    console.log(chalk.blue(`Recording manual test: ${options.testName}`));
    console.log(chalk.blue(`Session ID: ${options.sessionId}`));
    console.log(chalk.blue(`Actions will be recorded to: ${manualTestDir}`));

    await manualTestApi.startRecording(options.sessionId, options.testName);
    console.log(chalk.green('Recording started.'));
    console.log('Press Ctrl+C to stop recording.');

    // Handle process termination
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\nStopping recording...'));
      await manualTestApi.stopRecording(options.sessionId);
      console.log(chalk.green('Recording completed and saved.'));
      process.exit(0);
    });
  } else if (options.mode === 'replay') {
    if (!options.testName) {
      // List available tests
      const tests = await manualTestApi.listTests();
      
      if (tests.length === 0) {
        console.log(chalk.yellow('No recorded tests found.'));
      } else {
        console.log(chalk.blue('Available tests:'));
        tests.forEach((test, index) => {
          console.log(`${index + 1}. ${test}`);
        });
        console.log('\nUsage: npm run test:manual:replay -- --test-name "Test Name"');
      }
      process.exit(0);
    }

    console.log(chalk.blue(`Replaying manual test: ${options.testName}`));
    
    try {
      const result = await manualTestApi.replayTest(options.testName);
      console.log(chalk.green('Replay completed successfully.'));
      console.log('Result:', result);
      process.exit(0);
    } catch (error) {
      console.error(chalk.red(`Error replaying test: ${error.message}`));
      process.exit(1);
    }
  } else {
    console.error(chalk.red(`Invalid mode: ${options.mode}. Use 'record' or 'replay'.`));
    process.exit(1);
  }
}

main().catch(error => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});
