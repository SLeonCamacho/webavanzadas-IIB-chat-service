require('dotenv').config();
const express = require('express');
const expressWs = require('express-ws');

const app = express();
expressWs(app);

const port = process.env.PORT || 3003;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chat service running');
});

app.ws('/chat', (ws, req) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    const data = JSON.parse(message);

    app.ws.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          user: data.user,
          text: data.text
        }));
      }
    });
  });

  ws.send(JSON.stringify({ user: 'Server', text: 'Welcome to the chat!' }));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.listen(port, () => {
  console.log(`Chat service running on port ${port}`);
});

app.on('error', (error) => {
  console.error(`WebSocket server error: ${error}`);
});
