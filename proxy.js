const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const os = require('os');
const WebSocket = require('ws');

const app = express();
const port = 9532;
const host = '0.0.0.0';

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  headers: 'Content-Type',
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello, this is Pie21 proxy server!');
});

app.get('/e621', async (req, res) => {
  try {
    const response = await fetch('https://e621.net' + req.url, {
      headers: {
        'User-Agent': req.get('User-Agent'),
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(port, host, () => {
  const serverAddress = server.address();
  const ip = serverAddress.address === '0.0.0.0' ? getLocalIP() : serverAddress.address;
  console.log(`Server listening at http://${ip}:${port}`);
  console.log(`Server is also accessible via http://${ip}:${port}`);
  console.log(`Server is also accessible via http://localhost:${port}`);
});

// WebSocket setup
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  // Capture console.log messages and send them to the connected clients
  const originalLog = console.log;
  console.log = function (message) {
    originalLog.apply(console, arguments);
    ws.send(JSON.stringify({ type: 'log', message }));
  };

  ws.on('message', (message) => {
    // You can handle incoming messages from clients here if needed
  });

  ws.on('close', () => {
    // Restore the original console.log when the client disconnects
    console.log = originalLog;
  });
});

// Upgrade the HTTP server to a WebSocket server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  for (const key in networkInterfaces) {
    const networkInterface = networkInterfaces[key];
    for (const entry of networkInterface) {
      if (!entry.internal && entry.family === 'IPv4') {
        return entry.address;
      }
    }
  }
  return '127.0.0.1';
}
