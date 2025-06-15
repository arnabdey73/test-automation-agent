import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// OpenAI client initialization
let openai;

/**
 * Initialize the OpenAI client
 * @param {string} apiKey - OpenAI API key
 */
export function initializeOpenAI(apiKey) {
  try {
    openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    return true;
  } catch (error) {
    console.error(chalk.red('Error initializing OpenAI client:'), error);
    return false;
  }
}

/**
 * Generate test cases from a specification
 * @param {Object} spec - Specification object
 * @param {string} testType - Type of test (e.g., 'ui', 'regression', 'api')
 * @returns {Promise<string>} - Generated test code
 */
export async function generateTestFromSpec(spec, testType = 'ui') {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
  }

  console.log(chalk.blue('🧠 Generating test cases from specification...'));
  
  try {
    // Prepare prompt with test type specific instructions
    let testFrameworkInstructions = '';
    
    if (testType === 'ui') {
      testFrameworkInstructions = `
Use Playwright Test API for UI testing with TypeScript.
Include selectors that are robust and won't break easily.
Add assertions that verify both visibility and functionality.
Structure the test with test.describe() and test.beforeEach() for setup.
Include appropriate waits and handle timing issues properly.
Add comments for clarity on each section of the test.
`;
    } else if (testType === 'regression') {
      testFrameworkInstructions = `
Use Playwright Test API with TypeScript.
Focus on regression testing patterns - checking that existing functionality works across different scenarios.
Include data-driven tests where appropriate.
Add assertions that are specific and meaningful.
Structure the test with test.describe() and test.beforeEach() for setup.
Use test.step() for clear test organization.
`;
    } else if (testType === 'api') {
      testFrameworkInstructions = `
Use Playwright Test API with TypeScript for API testing.
Include proper request construction and response validation.
Add assertions for status codes, headers, and response body.
Handle authentication if specified in the spec.
Include error case testing.
Structure with test.describe() and organize by endpoints.
`;
    }
    
    // Create the system prompt
    const systemPrompt = `You are a testing expert that creates high-quality test code from specifications.
You generate clean, maintainable, and effective test cases using Playwright Test.
${testFrameworkInstructions}

Format your response as a complete test file, ready to run.

Only include imports that are actually used in the test.
Ensure all test cases are well-commented and follow best practices.
`;

    // Format the user prompt based on the spec
    const userPrompt = `Generate a complete Playwright test file for the following specification:

${JSON.stringify(spec, null, 2)}

The test should be comprehensive and handle edge cases appropriately.
The output should be a complete TypeScript file that can be executed directly with Playwright.
Include appropriate imports, test groups, and assertions.
`;

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 2500,
    });

    const generatedCode = completion.choices[0].message.content;
    
    console.log(chalk.green('✅ Test generation complete!'));
    
    return generatedCode;
  } catch (error) {
    console.error(chalk.red('Error generating test:'), error);
    throw error;
  }
}

/**
 * Generate test cases from a feature file
 * @param {string} featureFilePath - Path to feature file
 * @returns {Promise<string>} - Generated test code
 */
export async function generateTestFromFeatureFile(featureFilePath) {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
  }

  try {
    // Read feature file
    const featureContent = await fs.readFile(featureFilePath, 'utf8');
    
    console.log(chalk.blue(`🧠 Generating test cases from feature file: ${path.basename(featureFilePath)}`));

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are a testing expert that creates high-quality Playwright test code from Gherkin feature files.
Generate TypeScript code using Playwright Test API.
Include proper test organization, assertions, and setup code.
Make sure to handle all scenarios described in the feature file.
Your output should be a complete test file that can be run directly.` 
        },
        { 
          role: "user", 
          content: `Generate a complete Playwright test file for the following Gherkin feature:

${featureContent}

The output should be a complete TypeScript file that can be executed directly with Playwright.
Include appropriate imports, test groups, and assertions.`
        }
      ],
      temperature: 0.5,
      max_tokens: 2500,
    });

    const generatedCode = completion.choices[0].message.content;
    
    console.log(chalk.green('✅ Test generation from feature file complete!'));
    
    return generatedCode;
  } catch (error) {
    console.error(chalk.red('Error generating test from feature file:'), error);
    throw error;
  }
}

/**
 * Generate test cases from API documentation
 * @param {string} apiDocs - API documentation content
 * @returns {Promise<string>} - Generated test code
 */
export async function generateTestFromAPIDocs(apiDocs) {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
  }

  try {
    console.log(chalk.blue('🧠 Generating API test cases from documentation...'));

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are a testing expert that creates high-quality API test code from API documentation.
Generate TypeScript code using Playwright Test API for API testing.
Include tests for each endpoint with proper request construction and response validation.
Add assertions for status codes, headers, and response body.
Include tests for both successful and error scenarios.
Your output should be a complete test file that can be run directly.` 
        },
        { 
          role: "user", 
          content: `Generate a complete API test file for the following API documentation:

${apiDocs}

The output should be a complete TypeScript file that can be executed directly with Playwright.
Include appropriate imports, test groups, and assertions for each API endpoint.`
        }
      ],
      temperature: 0.5,
      max_tokens: 2500,
    });

    const generatedCode = completion.choices[0].message.content;
    
    console.log(chalk.green('✅ API test generation complete!'));
    
    return generatedCode;
  } catch (error) {
    console.error(chalk.red('Error generating API tests:'), error);
    throw error;
  }
}

/**
 * Generate test improvement suggestions based on test results
 * @param {Object} testResults - Test results object
 * @returns {Promise<string>} - Improvement suggestions
 */
export async function generateTestImprovementSuggestions(testResults) {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Call initializeOpenAI first.');
  }

  try {
    console.log(chalk.blue('🧠 Generating test improvement suggestions...'));

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are a testing expert that analyzes test results and provides actionable improvements.
Focus on test coverage, test reliability, and best practices.
Identify patterns in failures and suggest remediation.
Provide concrete code examples where appropriate.` 
        },
        { 
          role: "user", 
          content: `Analyze the following test results and provide improvement suggestions:

${JSON.stringify(testResults, null, 2)}

Include suggestions for:
1. Improving test reliability
2. Enhancing test coverage
3. Fixing common issues in the failing tests
4. Better test organization if needed`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const suggestions = completion.choices[0].message.content;
    
    console.log(chalk.green('✅ Test improvement suggestions generated!'));
    
    return suggestions;
  } catch (error) {
    console.error(chalk.red('Error generating test improvement suggestions:'), error);
    throw error;
  }
}

export default {
  initializeOpenAI,
  generateTestFromSpec,
  generateTestFromFeatureFile,
  generateTestFromAPIDocs,
  generateTestImprovementSuggestions
};
