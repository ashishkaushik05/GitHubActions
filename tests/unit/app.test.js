const request = require('supertest');
const app = require('../../app');

describe('Application Security Tests', () => {
  it('should have security headers', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    expect(response.headers['strict-transport-security']).toBeDefined();
  });

  it('should return 200 for health check endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });

  it('should handle invalid routes with 404', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });

  it('should prevent XSS attacks', async () => {
    const xssPayload = '<script>alert("xss")</script>';
    const response = await request(app)
      .get('/')
      .query({ input: xssPayload });
    
 