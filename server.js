require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/notify', async (req, res) => {
  const data = req.body;
  try {
    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.N8N_API_KEY
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error de conexión con n8n.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
