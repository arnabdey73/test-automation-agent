#!/usr/bin/env node

import fetch from 'node-fetch';

// Configuration
const BASE_URL = 'http://localhost:4000'; // Update if using a different port
const API_ENDPOINTS = [
  '/api/manual-test/sessions',
  '/api/manual-test/test'
];

async function verifyEndpoint(endpoint) {
  try {
    console.log(`Testing endpoint: ${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const status = response.status;
    
    console.log(`  Status: ${status}`);
    
    if (status >= 200 && status < 300) {
      const data = await response.json();
      console.log(`  Response: ${JSON.stringify(data, null, 2)}`);
      return true;
    } else {
      console.error(`  Error: Endpoint returned status ${status}`);
      return false;
    }
  } catch (error) {
    console.error(`  Error testing ${endpoint}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🧪 API Verification Tool');
  console.log('------------------------');
  console.log(`Testing against: ${BASE_URL}`);
  console.log('');
  
  let success = true;
  
  for (const endpoint of API_ENDPOINTS) {
    const result = await verifyEndpoint(endpoint);
    if (!result) success = false;
    console.log('');
  }
  
  if (success) {
    console.log('✅ All API endpoints are working correctly!');
  } else {
    console.log('❌ Some API endpoints have issues. Please check the logs above.');
  }
}

main().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});
