const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// STATUS
app.get('/api/status', (req, res) => {
  try {
    const user = db.prepare(
      'SELECT balance FROM users WHERE username = ?'
    ).get('demo');

    res.json({ balance: user.balance });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load status' });
  }
});

// INVEST
app.post('/api/invest', (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const user = db.prepare(
      'SELECT * FROM users WHERE username = ?'
    ).get('demo');

    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const newBalance = user.balance - amount;

    db.prepare(
      'UPDATE users SET balance = ? WHERE id = ?'
    ).run(newBalance, user.id);

    db.prepare(
      'INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)'
    ).run(user.id, 'invest', amount);

    res.json({ invested: amount, balance: newBalance });
  } catch (e) {
    res.status(500).json({ error: 'Investment failed' });
  }
});

app.listen(PORT, () => {
  console.log(🚀 SLH server running on http://localhost:);
});
