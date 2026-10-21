const express = require('express');
const cors = require('cors');
const { getReply, suggestions } = require('./rules');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/suggestions', (_req, res) => res.json({ suggestions }));

app.post('/api/chat', (req, res) => {
  const { message } = req.body || {};
  if (typeof message !== 'string') {
    return res.status(400).json({ error: '"message" must be a string' });
  }
  const { reply, rule } = getReply(message);
  res.json({ reply, rule, timestamp: new Date().toISOString() });
});

if (require.main === module) {
  const server = app.listen(PORT, '127.0.0.1', () =>
    console.log(`Chatbot server running on http://127.0.0.1:${PORT}`)
  );
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Close the other program or run: set PORT=5001 && npm start`);
    } else {
      console.error(err);
    }
    process.exit(1);
  });
}

module.exports = app;
