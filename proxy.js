const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 9532;

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
        'User-Agent': req.get('User-Agent'), // Pass through the User-Agent header
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
