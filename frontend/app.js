// API configuration - adjust ports based on your setup
const HOST = window.location.hostname;
const USER_API = `http://${HOST}:4000/user`;
const TODO_API = `http://${HOST}:4001/api/todo`;

// Register a new user account
async function registerUser(email, password) {
  const res = await fetch(`${USER_API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Registration failed');
  }
  return true;
}

// Authenticate user and store JWT token
async function loginUser(email, password) {
  const res = await fetch(`${USER_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.data.token);
    const token = data.data?.token ?? data.data?.data?.token;
    if (!token) {
      throw new Error('Token missing in response');
    }
    localStorage.setItem('token', token);
    return true;
  }
  throw new Error(data?.message || 'Login failed');
}

// Get stored authentication token
function getToken() {
  return localStorage.getItem('token');
}

// Redirect to login if no token found
function requireAuth() {
  if (!getToken()) {
    window.location.href = 'login.html';
  }
}

// Clear token and redirect to login
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Fetch all todos for the authenticated user
async function fetchTodos() {
  const res = await fetch(TODO_API, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to load todos');
  return data.data || [];
}

// Create a new todo
async function addTodo(content) {
  const res = await fetch(TODO_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ content })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to add todo');
  return data.data;
}

// Update an existing todo
async function updateTodo(id, content) {
  const res = await fetch(`${TODO_API}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ content })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to update todo');
  return data.data;
}

// Delete a todo
async function deleteTodo(id) {
  const res = await fetch(`${TODO_API}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Failed to delete todo');
  }
}

export {
  registerUser,
  loginUser,
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  requireAuth,
  logout
};
