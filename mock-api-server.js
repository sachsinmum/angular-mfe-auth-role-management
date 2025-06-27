const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors({
  origin: ['http://localhost:4210', 'http://localhost:4220', 'http://localhost:4221', 'http://localhost:4222'],
  credentials: true
}));
app.use(bodyParser.json());

// Mock data
let users = [
  { id: '1', email: 'admin@example.com', password: 'admin123', roles: ['ADMIN'], mfaEnabled: true, forcePasswordChange: false },
  { id: '2', email: 'user@example.com', password: 'user123', roles: ['USER'], mfaEnabled: false, forcePasswordChange: true }
];

let menu = [
  { screenId: 'DASH', screenName: 'Dashboard', routePath: '/dashboard', iconName: 'pi pi-chart-bar', isMenuItem: true, actions: ['VIEW'] }
];

// Auth endpoints
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({
    token: 'mock-jwt-token',
    user,
    requiresMfa: user.mfaEnabled,
    forcePasswordChange: user.forcePasswordChange
  });
});

app.post('/auth/verify-mfa', (req, res) => {
  const { code } = req.body;
  if (code === '123456') {
    res.json({
      token: 'mock-jwt-token',
      user: users[0],
      requiresMfa: false,
      forcePasswordChange: false
    });
  } else {
    res.status(401).json({ message: 'Invalid MFA code' });
  }
});

app.post('/auth/change-password', (req, res) => {
  const { newPassword } = req.body;
  if (newPassword.length >= 8) {
    res.json({
      token: 'mock-jwt-token',
      user: users[1],
      requiresMfa: false,
      forcePasswordChange: false
    });
  } else {
    res.status(400).json({ message: 'Password must be at least 8 characters' });
  }
});

app.get('/user/profile', (req, res) => {
  res.json(users[0]);
});

app.get('/menu', (req, res) => {
  res.json(menu);
});

// Start server
app.listen(port, () => {
  console.log(`Mock API server running at http://localhost:${port}`);
});
