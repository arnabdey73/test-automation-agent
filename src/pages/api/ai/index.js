import testGenerator from '../../../services/ai/gpt-test-generator.js';
import visualRegression from '../../../services/ai/visual-regression.js';
import testPrioritization from '../../../services/ai/test-prioritization.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { action, options } = data;
    
    // Initialize OpenAI if needed
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY environment variable is not set' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Initialize OpenAI client for test generator
    testGenerator.initializeOpenAI(process.env.OPENAI_API_KEY);
    
    let result;
    switch (action) {
      case 'generate':
        if (options.spec) {
          const specPath = path.resolve(options.spec);
          result = await testGenerator.generateFromSpec(specPath);
        } else if (options.feature) {
          const featurePath = path.resolve(options.feature);
          result = await testGenerator.generateFromGherkin(featurePath);
        } else if (options.apiDocs) {
          const apiDocsPath = path.resolve(options.apiDocs);
          result = await testGenerator.generateFromApiDocs(apiDocsPath);
        } else {
          return new Response(JSON.stringify({ 
            error: 'Please provide a specification file, feature file, or API documentation' 
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        
        if (result && options.output) {
          // Create directory if it doesn't exist
          const outputDir = path.dirname(options.output);
          await fs.mkdir(outputDir, { recursive: true });
          
          // Write generated test to file
          await fs.writeFile(options.output, result);
        }
        break;
        
      case 'visual':
        result = await visualRegression.compareScreenshots({
          screenshotsDir: path.resolve(options.dir || '../test-results/screenshots'),
          baselineDir: path.resolve(options.baselineDir || '../test-results/baselines'),
          updateBaselines: options.updateBaselines || false,
          threshold: parseFloat(options.threshold || '0.1')
        });
        break;
        
      case 'prioritize':
        result = await testPrioritization.prioritizeTests({
          testDir: path.resolve(options.testDir || '../tests'),
          changesOnly: options.changesOnly || false
        });
        
        if (options.output) {
          // Create directory if it doesn't exist
          const outputDir = path.dirname(options.output);
          await fs.mkdir(outputDir, { recursive: true });
          
          // Write prioritized tests to file
          await fs.writeFile(options.output, JSON.stringify(result, null, 2));
        }
        break;
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
    }
    
    return new Response(JSON.stringify({ 
      status: 'success',
      result
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
