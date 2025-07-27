const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const FILE = 'users.json';

function readUsers() {
  const data = fs.readFileSync(FILE);
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  let users = readUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  users.push({ email, password, requests: [] });
  writeUsers(users);
  res.json({ message: 'Signed up successfully' });
});

app.post('/request', (req, res) => {
  const { email, username, type } = req.body;
  let users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.requests.push({ username, type, date: new Date() });
  writeUsers(users);
  res.json({ message: 'Request saved' });
});

app.get('/history', (req, res) => {
  const { email } = req.query;
  let users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ requests: user.requests });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
