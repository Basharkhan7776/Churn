// Test setup file
import { mock, beforeAll, afterAll } from 'bun:test';

// Global test setup
beforeAll(() => {
  // Set up any global test configuration
  console.log('🧪 Setting up test environment...');
});

afterAll(() => {
  // Clean up any global test configuration
  console.log('🧹 Cleaning up test environment...');
}); 