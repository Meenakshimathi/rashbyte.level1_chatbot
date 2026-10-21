# RuleBot – Rule-Based Chatbot (Node.js + React)

A simple chatbot that replies to predefined user inputs using pattern-matching rules.

```
chatbot/
├── server/            Node.js + Express backend
│   ├── rules.js       <- all chatbot rules live here
│   ├── server.js      API: POST /api/chat, GET /api/suggestions
│   └── test.js        rule tests
└── client/            React (Vite) frontend
    └── src/App.jsx    chat UI
```

## Run it in VS Code

**Prerequisite:** install [Node.js](https://nodejs.org) (v18 or newer). Check with `node -v`.

1. In VS Code: **File → Open Folder…** and choose the `chatbot` folder (the one containing `package.json`).
2. Open a terminal: **Terminal → New Terminal** (`` Ctrl+` ``).
3. Install everything (one time):
   ```bash
   npm run install-all
   ```
4. Start backend and frontend together:
   ```bash
   npm run dev
   ```
   You should see `Chatbot server running on http://127.0.0.1:5000` and the Vite URL.
5. Open **http://localhost:5173** in your browser and start chatting.

Keep that terminal running. Stop with `Ctrl+C`.

If you see "Cannot reach the server" in the chat, the backend isn't running — check the terminal for errors.

### Run the tests
```bash
cd server
npm test
```

## Adding your own rules

Edit `server/rules.js` and add an object to the `rules` array:

```js
{
  name: 'shipping_cost',
  patterns: [/\bshipping (cost|fee|charges?)\b/i],
  reply: 'Shipping is free on orders above ₹999.',
},
```

Rules are checked top to bottom; the first match wins. Restart the server (`Ctrl+C`, then `npm start`) after changes.

## Test the API without the UI
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"what are your hours"}'
```
