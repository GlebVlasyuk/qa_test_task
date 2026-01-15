import { test, expect } from '../../fixtures/fixtures';

test.describe('Health Check API, @api', () => {
  test('GET /health - should return health status', async ({ api }) => {
    const response = await api.healthCheck();
    expect(response.status).toBe('ok');
  });
});
