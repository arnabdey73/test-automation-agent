import resemble from 'resemblejs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import chalk from 'chalk';

// Get dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Default configurations
const defaultConfig = {
  baselineDir: '../tests/visual-baselines',
  actualDir: '../test-results/test-artifacts/chromium',
  diffDir: '../test-results/visual-diff',
  threshold: 0.1, // 0.1% difference threshold by default
};

/**
 * Compare screenshots against baseline images
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Comparison results
 */
export async function compareScreenshots(options = {}) {
  const config = { ...defaultConfig, ...options };
  
  console.log(chalk.blue('🖼️ Running visual regression comparison...'));
  
  try {
    // Ensure directories exist
    await fs.mkdir(path.join(__dirname, config.diffDir), { recursive: true });
    
    // Find all actual screenshots
    const screenshotPaths = await glob(`${path.join(__dirname, config.actualDir)}/**/*.png`);
    
    if (screenshotPaths.length === 0) {
      console.log(chalk.yellow('⚠️ No screenshots found for comparison.'));
      return { success: true, message: 'No screenshots found', results: [] };
    }
    
    console.log(chalk.blue(`Found ${screenshotPaths.length} screenshots to compare`));
    
    const results = [];
    let failedComparisons = 0;
    
    // Process each screenshot
    for (const screenshotPath of screenshotPaths) {
      const relativePath = path.relative(path.join(__dirname, config.actualDir), screenshotPath);
      const baselinePath = path.join(__dirname, config.baselineDir, relativePath);
      const diffPath = path.join(__dirname, config.diffDir, relativePath);
      
      // Create directory for diff if it doesn't exist
      await fs.mkdir(path.dirname(diffPath), { recursive: true });
      
      let comparisonResult;
      
      try {
        // Check if baseline exists
        await fs.access(baselinePath);
        
        // Compare images
        comparisonResult = await compareImages(baselinePath, screenshotPath, diffPath, config.threshold);
        
        if (!comparisonResult.match) {
          failedComparisons++;
          console.log(chalk.red(`❌ Visual difference detected: ${relativePath}`));
          console.log(chalk.red(`   Mismatch percentage: ${comparisonResult.misMatchPercentage}%`));
        } else {
          console.log(chalk.green(`✅ Visual match: ${relativePath}`));
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(chalk.yellow(`⚠️ Baseline does not exist for: ${relativePath}`));
          console.log(chalk.yellow(`   Creating baseline from current screenshot.`));
          
          // Create baseline directory if it doesn't exist
          await fs.mkdir(path.dirname(baselinePath), { recursive: true });
          
          // Copy current screenshot as baseline
          await fs.copyFile(screenshotPath, baselinePath);
          
          comparisonResult = {
            match: true,
            misMatchPercentage: 0,
            baselineCreated: true,
            baselinePath,
            actualPath: screenshotPath,
            diffPath: null
          };
        } else {
          console.error(chalk.red(`Error comparing ${relativePath}:`), error);
          comparisonResult = {
            match: false,
            error: error.message,
            baselinePath,
            actualPath: screenshotPath,
            diffPath: null
          };
          failedComparisons++;
        }
      }
      
      results.push({
        file: relativePath,
        ...comparisonResult
      });
    }
    
    const success = failedComparisons === 0;
    
    if (success) {
      console.log(chalk.green('✅ Visual regression tests passed!'));
    } else {
      console.log(chalk.red(`❌ Visual regression tests failed with ${failedComparisons} mismatches.`));
    }
    
    return {
      success,
      failedComparisons,
      totalComparisons: screenshotPaths.length,
      results
    };
  } catch (error) {
    console.error(chalk.red('Error running visual regression tests:'), error);
    throw error;
  }
}

/**
 * Compare two images using resemble.js
 * @param {string} baselinePath - Path to baseline image
 * @param {string} actualPath - Path to actual image
 * @param {string} diffPath - Path to save difference image
 * @param {number} threshold - Threshold for mismatch percentage
 * @returns {Promise<Object>} - Comparison result
 */
async function compareImages(baselinePath, actualPath, diffPath, threshold) {
  return new Promise(async (resolve, reject) => {
    try {
      const baselineImage = await fs.readFile(baselinePath);
      const actualImage = await fs.readFile(actualPath);
      
      resemble(actualImage)
        .compareTo(baselineImage)
        .ignoreColors()
        .onComplete(async data => {
          const misMatchPercentage = parseFloat(data.misMatchPercentage);
          const match = misMatchPercentage <= threshold;
          
          // Save diff image if there's a mismatch
          if (!match) {
            const diffBuffer = Buffer.from(data.getBuffer().toString('base64'), 'base64');
            await fs.writeFile(diffPath, diffBuffer);
          }
          
          resolve({
            match,
            misMatchPercentage,
            baselinePath,
            actualPath,
            diffPath: match ? null : diffPath
          });
        });
    } catch (error) {
      reject(error);
    }
  });
}

export default {
  compareScreenshots
};
