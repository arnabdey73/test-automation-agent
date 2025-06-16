import { program } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Import AI modules
import testGenerator from './gpt-test-generator.js';
import visualRegression from './visual-regression.js';
import testPrioritization from './test-prioritization.js';

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure CLI
program
  .name('test-ai')
  .description('AI-powered test automation tools')
  .version('1.0.0');

// Generate test command
program
  .command('generate')
  .description('Generate test cases from specifications')
  .option('-s, --spec <path>', 'Path to specification file (JSON or YAML)')
  .option('-o, --output <path>', 'Output path for generated test')
  .option('-t, --type <type>', 'Test type (ui, regression, api)', 'ui')
  .option('-f, --feature <path>', 'Path to feature file (Gherkin)')
  .option('-a, --api-docs <path>', 'Path to API documentation file')
  .action(async (options) => {
    try {
      // Check for API key
      if (!process.env.OPENAI_API_KEY) {
        console.error(chalk.red('Error: OPENAI_API_KEY environment variable is not set.'));
        process.exit(1);
      }
      
      // Initialize OpenAI client
      testGenerator.initializeOpenAI(process.env.OPENAI_API_KEY);
      
      let generatedTest = null;
      let outputFilename = options.output;
      
      // Generate test based on input type
      if (options.spec) {
        console.log(chalk.blue('Generating test from specification file...'));
        const specPath = path.resolve(options.spec);
        generatedTest = await testGenerator.generateFromSpec(specPath);
      } else if (options.feature) {
        console.log(chalk.blue('Generating test from Gherkin feature file...'));
        const featurePath = path.resolve(options.feature);
        generatedTest = await testGenerator.generateFromGherkin(featurePath);
      } else if (options.apiDocs) {
        console.log(chalk.blue('Generating test from API documentation...'));
        const apiDocsPath = path.resolve(options.apiDocs);
        generatedTest = await testGenerator.generateFromApiDocs(apiDocsPath);
      } else {
        console.error(chalk.red('Error: Please provide a specification file (--spec), feature file (--feature), or API documentation (--api-docs).'));
        process.exit(1);
      }
      
      if (generatedTest) {
        // Determine output path
        if (!outputFilename) {
          const testType = options.type || 'ui';
          const baseName = path.basename(
            options.spec || options.feature || options.apiDocs || 'test',
            path.extname(options.spec || options.feature || options.apiDocs || '')
          );
          outputFilename = path.resolve(process.cwd(), `../tests/generated/${baseName}.test.ts`);
        }
        
        // Create directory if it doesn't exist
        const outputDir = path.dirname(outputFilename);
        await fs.mkdir(outputDir, { recursive: true });
        
        // Write generated test to file
        await fs.writeFile(outputFilename, generatedTest);
        console.log(chalk.green(`Test successfully generated and saved to ${outputFilename}`));
      }
    } catch (error) {
      console.error(chalk.red(`Error generating test: ${error.message}`));
      process.exit(1);
    }
  });

// Visual regression command
program
  .command('visual')
  .description('Run visual regression testing')
  .option('-u, --update-baselines', 'Update baseline screenshots')
  .option('-d, --dir <path>', 'Screenshots directory', '../test-results/screenshots')
  .option('-b, --baseline-dir <path>', 'Baseline screenshots directory', '../test-results/baselines')
  .option('-t, --threshold <number>', 'Comparison threshold (0-1)', '0.1')
  .action(async (options) => {
    try {
      console.log(chalk.blue('Running visual regression testing...'));
      
      const results = await visualRegression.compareScreenshots({
        screenshotsDir: path.resolve(options.dir),
        baselineDir: path.resolve(options.baselineDir),
        updateBaselines: options.updateBaselines,
        threshold: parseFloat(options.threshold)
      });
      
      if (options.updateBaselines) {
        console.log(chalk.green(`Baseline screenshots updated successfully.`));
      } else {
        console.log(chalk.blue(`\nVisual Comparison Results:`));
        console.log(`Total screenshots analyzed: ${results.total}`);
        console.log(`Passed: ${results.passed}`);
        console.log(`Failed: ${results.failed}`);
        console.log(`New: ${results.new}`);
        
        if (results.failed > 0) {
          console.log(chalk.yellow(`\nDifferences found in ${results.failed} screenshots.`));
          console.log('Difference reports saved to: ' + path.resolve('../test-results/visual-diff'));
          process.exit(1);
        } else {
          console.log(chalk.green('\nAll screenshots match their baselines.'));
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error in visual regression testing: ${error.message}`));
      process.exit(1);
    }
  });

// Prioritize tests command
program
  .command('prioritize')
  .description('Prioritize test cases for execution')
  .option('-d, --test-dir <path>', 'Test directory', '../tests')
  .option('-o, --output <path>', 'Output JSON file for prioritized tests', '../test-results/priority.json')
  .option('-c, --changes-only', 'Only prioritize tests for changed files', false)
  .action(async (options) => {
    try {
      console.log(chalk.blue('Prioritizing test cases...'));
      
      const prioritizedTests = await testPrioritization.prioritizeTests({
        testDir: path.resolve(options.testDir),
        changesOnly: options.changesOnly
      });
      
      // Create directory if it doesn't exist
      const outputDir = path.dirname(options.output);
      await fs.mkdir(outputDir, { recursive: true });
      
      // Write prioritized tests to file
      await fs.writeFile(options.output, JSON.stringify(prioritizedTests, null, 2));
      
      console.log(chalk.green(`Prioritized ${prioritizedTests.length} test cases.`));
      console.log(`Output saved to: ${options.output}`);
    } catch (error) {
      console.error(chalk.red(`Error prioritizing tests: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
