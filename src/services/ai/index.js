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
      
      // Generate test from spec file
      if (options.spec) {
        const specPath = path.resolve(options.spec);
        const specData = await fs.readFile(specPath, 'utf8');
        let spec;
        
        if (specPath.endsWith('.json')) {
          spec = JSON.parse(specData);
        } else if (specPath.endsWith('.yaml') || specPath.endsWith('.yml')) {
          const YAML = (await import('yaml')).default;
          spec = YAML.parse(specData);
        } else {
          console.error(chalk.red('Error: Specification file must be JSON or YAML.'));
          process.exit(1);
        }
        
        generatedTest = await testGenerator.generateTestFromSpec(spec, options.type);
        
        if (!outputFilename) {
          const baseName = path.basename(specPath, path.extname(specPath));
          outputFilename = `${baseName}.test.ts`;
        }
      }
      // Generate test from feature file
      else if (options.feature) {
        const featurePath = path.resolve(options.feature);
        
        generatedTest = await testGenerator.generateTestFromFeatureFile(featurePath);
        
        if (!outputFilename) {
          const baseName = path.basename(featurePath, path.extname(featurePath));
          outputFilename = `${baseName}.spec.ts`;
        }
      }
      // Generate test from API docs
      else if (options.apiDocs) {
        const apiDocsPath = path.resolve(options.apiDocs);
        const apiDocs = await fs.readFile(apiDocsPath, 'utf8');
        
        generatedTest = await testGenerator.generateTestFromAPIDocs(apiDocs);
        
        if (!outputFilename) {
          const baseName = path.basename(apiDocsPath, path.extname(apiDocsPath));
          outputFilename = `${baseName}-api.test.ts`;
        }
      }
      else {
        console.error(chalk.red('Error: Must provide either --spec, --feature, or --api-docs option.'));
        process.exit(1);
      }
      
      // Write generated test to file
      if (generatedTest) {
        // Default output directory is ../tests
        const outputDir = path.dirname(outputFilename) !== '.' 
          ? path.dirname(outputFilename)
          : path.join(__dirname, '..', 'tests', options.type);
        
        // Create output directory if it doesn't exist
        await fs.mkdir(outputDir, { recursive: true });
        
        const outputPath = path.dirname(outputFilename) !== '.'
          ? outputFilename
          : path.join(outputDir, path.basename(outputFilename));
        
        await fs.writeFile(outputPath, generatedTest);
        
        console.log(chalk.green(`✅ Generated test written to: ${outputPath}`));
      }
    } catch (error) {
      console.error(chalk.red('Error generating test:'), error);
      process.exit(1);
    }
  });

// Visual regression command
program
  .command('visual')
  .description('Run visual regression tests')
  .option('-b, --baseline <path>', 'Path to baseline images directory')
  .option('-a, --actual <path>', 'Path to actual screenshots directory')
  .option('-d, --diff <path>', 'Path to output diff images')
  .option('-t, --threshold <number>', 'Comparison threshold (0-100)', '0.1')
  .option('-o, --output <path>', 'Output path for results JSON')
  .action(async (options) => {
    try {
      const config = {};
      
      if (options.baseline) {
        config.baselineDir = options.baseline;
      }
      
      if (options.actual) {
        config.actualDir = options.actual;
      }
      
      if (options.diff) {
        config.diffDir = options.diff;
      }
      
      if (options.threshold) {
        config.threshold = parseFloat(options.threshold);
      }
      
      const results = await visualRegression.compareScreenshots(config);
      
      // Write results to file if specified
      if (options.output) {
        await fs.writeFile(options.output, JSON.stringify(results, null, 2));
        console.log(chalk.blue(`📊 Visual regression results written to: ${options.output}`));
      }
      
      // Exit with appropriate code
      process.exit(results.success ? 0 : 1);
    } catch (error) {
      console.error(chalk.red('Error running visual regression tests:'), error);
      process.exit(1);
    }
  });

// Test prioritization command
program
  .command('prioritize')
  .description('Prioritize tests based on historical results')
  .option('-h, --history <path>', 'Path to test history file')
  .option('-d, --test-dir <path>', 'Directory containing test files')
  .option('-o, --output <path>', 'Output path for prioritized test list')
  .option('-c, --count <number>', 'Number of top tests to include', '0')
  .action(async (options) => {
    try {
      const config = {};
      
      if (options.history) {
        config.historyFile = options.history;
      }
      
      if (options.testDir) {
        config.testDir = options.testDir;
      }
      
      const prioritizedTests = await testPrioritization.prioritizeTests(config);
      
      // Limit number of tests if specified
      const count = parseInt(options.count, 10);
      const results = count > 0 ? prioritizedTests.slice(0, count) : prioritizedTests;
      
      // Display results
      console.log(chalk.blue('\n🔢 Test Priorities:'));
      
      for (let i = 0; i < Math.min(10, results.length); i++) {
        const test = results[i];
        console.log(chalk.cyan(`${i + 1}. ${test.relativePath} (Score: ${test.normalizedPriority})`));
      }
      
      if (results.length > 10) {
        console.log(chalk.gray(`... and ${results.length - 10} more tests`));
      }
      
      // Write results to file if specified
      if (options.output) {
        await fs.writeFile(options.output, JSON.stringify(results, null, 2));
        console.log(chalk.blue(`📊 Prioritization results written to: ${options.output}`));
      }
    } catch (error) {
      console.error(chalk.red('Error prioritizing tests:'), error);
      process.exit(1);
    }
  });

// Update test history command
program
  .command('update-history')
  .description('Update test history with new results')
  .requiredOption('-r, --results <path>', 'Path to test results JSON file')
  .option('-h, --history <path>', 'Path to test history file')
  .action(async (options) => {
    try {
      // Load test results
      const resultsPath = path.resolve(options.results);
      const resultsData = await fs.readFile(resultsPath, 'utf8');
      const testResults = JSON.parse(resultsData);
      
      // Update history
      const updatedHistory = await testPrioritization.updateTestHistory(
        testResults,
        options.history
      );
      
      console.log(chalk.green(`✅ Updated history for ${Object.keys(updatedHistory).length} tests`));
    } catch (error) {
      console.error(chalk.red('Error updating test history:'), error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();
