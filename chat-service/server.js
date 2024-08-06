require('dotenv').config();
const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chat service running');
});

const server = app.listen(port, () => {
  console.log(`Chat service running on port ${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    const data = JSON.parse(message);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          user: data.user,
          text: data.text
        }));
      }
    });
  });

  ws.send(JSON.stringify({ user: 'Server', text: 'Welcome to the chat!' }));
});

wss.on('error', (error) => {
  console.error(`WebSocket server error: ${error}`);
});
