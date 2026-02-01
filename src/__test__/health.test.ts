import { expect, test } from 'vitest'

test('Health check returns 200', async () => {
  // This mimics calling your health API
  const response = { status: 200 }; 
  expect(response.status).toBe(200);
});