import { hasOrderTimeMismatch } from './activityTimeOrder';

/**
 * Test cases for hasOrderTimeMismatch function
 * 
 * Run these tests to verify the utility function works correctly
 */

// Test 1: Activities in correct time order - should return false
const correctOrder = [
  { startTime: '2024-01-01T09:00:00', endTime: '2024-01-01T10:00:00' },
  { startTime: '2024-01-01T10:00:00', endTime: '2024-01-01T11:00:00' },
  { startTime: '2024-01-01T11:00:00', endTime: '2024-01-01T12:00:00' },
];
console.log('Test 1 - Correct order:', hasOrderTimeMismatch(correctOrder)); // Should be false

// Test 2: Activities in wrong time order - should return true
const wrongOrder = [
  { startTime: '2024-01-01T09:00:00', endTime: '2024-01-01T10:00:00' },
  { startTime: '2024-01-01T08:00:00', endTime: '2024-01-01T09:00:00' }, // Earlier time but later in list
];
console.log('Test 2 - Wrong order:', hasOrderTimeMismatch(wrongOrder)); // Should be true

// Test 3: Overlapping times - should return true
const overlapping = [
  { startTime: '2024-01-01T09:00:00', endTime: '2024-01-01T11:00:00' },
  { startTime: '2024-01-01T10:00:00', endTime: '2024-01-01T12:00:00' }, // Starts before first ends
];
console.log('Test 3 - Overlapping:', hasOrderTimeMismatch(overlapping)); // Should be true

// Test 4: Missing time information - should return false (skips comparison)
const missingTimes = [
  { startTime: '2024-01-01T09:00:00', endTime: '2024-01-01T10:00:00' },
  { startTime: undefined, endTime: undefined },
  { startTime: '2024-01-01T11:00:00', endTime: '2024-01-01T12:00:00' },
];
console.log('Test 4 - Missing times:', hasOrderTimeMismatch(missingTimes)); // Should be false

// Test 5: Single activity - should return false
const singleActivity = [
  { startTime: '2024-01-01T09:00:00', endTime: '2024-01-01T10:00:00' },
];
console.log('Test 5 - Single activity:', hasOrderTimeMismatch(singleActivity)); // Should be false

// Test 6: Empty array - should return false
const emptyArray: { startTime?: string; endTime?: string }[] = [];
console.log('Test 6 - Empty array:', hasOrderTimeMismatch(emptyArray)); // Should be false
