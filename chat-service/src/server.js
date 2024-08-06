require('dotenv').config();
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT }, () => {
  console.log(`WebSocket server started on ws://localhost:${process.env.PORT}`);
});

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
