/**
 * Unit tests for the AICI Challenge API using Jest.
 *
 * These tests exercise both the User Service (port 4000) and the Todo Service (port 4001)
 * Adjust USER_SERVICE_URL and
 * TODO_SERVICE_URL if your services run on different hosts or ports.
 *
 * To run the tests:
 *   1. Install dependencies: npm install jest axios
 *   2. Run `npm test` (ensure you have a jest configuration or use npx jest api.test.js).
 */

const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4000';
const TODO_SERVICE_URL = process.env.TODO_SERVICE_URL || 'http://localhost:4001';

describe('User Service', () => {
  let testEmail;
  const password = 'TestPassword123!';
  let userId;
  const nonExistentId = 'e4e861da-3b1c-4c1c-9ae6-81c709c9328a';
  let authToken;

  test('Health check (User) returns service status', async () => {
    const response = await axios.get(`${USER_SERVICE_URL}/`);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('success');
    expect(response.data.data.message).toMatch(/User Service is running/i);
  });

  test('Register user - success', async () => {
    testEmail = `user_${Date.now()}@example.com`;
    const response = await axios.post(`${USER_SERVICE_URL}/user/register`, {
      email: testEmail,
      password,
    });
    expect(response.status).toBe(201);
    expect(response.data.status).toBe('success');
    expect(response.data.data).toHaveProperty('id');
    expect(response.data.data.email).toBe(testEmail);
    userId = response.data.data.id;
  });

  test('Register user - conflict (email already in use)', async () => {
    try {
      await axios.post(`${USER_SERVICE_URL}/user/register`, {
        email: testEmail,
        password,
      });
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(409);
      expect(response.data.status).toBe('error');
      expect(response.data.message).toMatch(/email already in use/i);
    }
  });

  test('Login user - success', async () => {
    const response = await axios.post(`${USER_SERVICE_URL}/user/login`, {
      email: testEmail,
      password,
    });
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('success');
    expect(response.data.data).toHaveProperty('token');
    authToken = response.data.data.token;
  });

  test('Login user - failure (invalid credentials)', async () => {
    try {
      await axios.post(`${USER_SERVICE_URL}/user/login`, {
        email: testEmail,
        password: 'wrongpassword',
      });
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(401);
      expect(response.data.status).toBe('error');
      expect(response.data.message).toMatch(/invalid credentials/i);
    }
  });

  test('Get user by ID - success', async () => {
    const headers = { Authorization: `Bearer ${authToken}` };
    const response = await axios.get(`${USER_SERVICE_URL}/user/${userId}`, { headers });
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('success');
    expect(response.data.data.id).toBe(userId);
    expect(response.data.data.email).toBe(testEmail);
  });

  test('Get user by ID - not found', async () => {
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
      await axios.get(`${USER_SERVICE_URL}/user/${nonExistentId}`, { headers });
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
      expect(response.data.status).toBe('error');
      expect(response.data.message).toMatch(/user not found|not found/i);
    }
  });
});

describe('Todo Service', () => {
  let authToken;
  let todoId;
  const notExistingTodoId = '072ace85-9f8d-469a-9d9a-4047c7d65ce3'
  beforeAll(async () => {
    const testEmail = `todo_user_${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    await axios.post(`${USER_SERVICE_URL}/user/register`, { email: testEmail, password });
    const loginRes = await axios.post(`${USER_SERVICE_URL}/user/login`, { email: testEmail, password });
    authToken = loginRes.data.data.token;
  });

  test('Health check (Todo) returns service status', async () => {
    const response = await axios.get(`${TODO_SERVICE_URL}/`);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('success');
    expect(response.data.data.message).toMatch(/todo service is running/i);
  });

  test('Create todo - unauthorized (missing token)', async () => {
    try {
      await axios.post(`${TODO_SERVICE_URL}/api/todo`, { content: 'Build App' });
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(401);
      expect(response.data.status).toBe('error');
      expect(response.data.message).toMatch(/missing or invalid authorization header/i);
    }
  });

  test('Create todo - success', async () => {
    const headers = { Authorization: `Bearer ${authToken}` };
    const response = await axios.post(
      `${TODO_SERVICE_URL}/api/todo`,
      { content: 'Build App' },
      { headers },
    );
    expect(response.status).toBe(201);
    expect(response.data.status).toBe('success');
    expect(response.data.data).toHaveProperty('id');
    expect(response.data.data.content).toBe('Build App');
    todoId = response.data.data.id;
  });

  test('List todos - success', async () => {
    const headers = { Authorization: `Bearer ${authToken}` };
    const response = await axios.get(`${TODO_SERVICE_URL}/api/todo`, { headers });
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('success');
    expect(Array.isArray(response.data.data)).toBe(true);
    const ids = response.data.data.map((t) => t.id);
    expect(ids).toContain(todoId);
  });

  test('Update todo - unauthorized', async () => {
    try {
      await axios.put(`${TODO_SERVICE_URL}/api/todo/${todoId}`, { content: 'Build Mobile App' });
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(401);
      expect(response.data.status).toBe('error');
      expect(response.data.message).toMatch(/missing or invalid authorization header/i);
    }
  });

  test('Update todo - success', async () => {
    const headers = { Authorization: `Bearer ${authToken}` };
    const response = await axios.put(
      `${TODO_SERVICE_URL}/api/todo/${todoId}`,
      { content: 'Build Mobile App' },
      { headers },
    );
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('success');
    expect(response.data.data.id).toBe(todoId);
    expect(response.data.data.content).toBe('Build Mobile App');
  });

  test('Update todo - not found', async () => {
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
      await axios.put(
        `${TODO_SERVICE_URL}/api/todo/${notExistingTodoId}`,
        { content: 'Does not exist' },
        { headers },
      );
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
      expect(response.data.status).toBe('error');
      expect(response.data.message).toMatch(/not found/i);
    }
  });

  test('Delete todo - unauthorized', async () => {
    try {
      await axios.delete(`${TODO_SERVICE_URL}/api/todo/${todoId}`);
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(401);
      expect(response.data.status).toBe('error');
      expect(response.data.message).toMatch(/missing or invalid authorization header/i);
    }
  });

  test('Delete todo - success', async () => {
    const headers = { Authorization: `Bearer ${authToken}` };
    const response = await axios.delete(`${TODO_SERVICE_URL}/api/todo/${todoId}`, { headers });
    expect([200, 204]).toContain(response.status);
  });

  test('Delete todo - not found', async () => {
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
      await axios.delete(`${TODO_SERVICE_URL}/api/todo/${notExistingTodoId}`, { headers });
    } catch (error) {
      const { response } = error;
      expect(response.status).toBe(404);
      expect(response.data.status).toBe('error');
      expect(response.data.message).toMatch(/not found/i);
    }
  });
});
