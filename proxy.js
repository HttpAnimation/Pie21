const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = 9532;

app.use(cors());

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

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
  console.log(`Localhost will be soon lost so don't bookmark that tab a ip based system will be put in place later :)`)
});
