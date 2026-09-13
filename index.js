const express = require('express');
const axios = require('axios'); // <-- Add this!
const app = express();
app.use(express.json());

const PORT = 3000;

// Store your API keys securely here (use environment variables in production)
const kalshiApiKey = '8046b0ef-4cf2-4940-927e-a57b887bb688';
const polymarketApiKey = '0xdbfbf26408f0a1ae8868441d6aecebb90b9ba4c306ce5e5cf410bb895eb791d2';

// Example: Fetch market data from Kalshi
app.get('/market/:id', async (req, res) => {
  const marketId = req.params.id;
  // Replace with the correct API URL from Kalshi's docs
  try {
    const response = await axios.get(`https://trade-api.kalshi.com/v1/markets/${marketId}`, {
      headers: { 'Authorization': `Bearer ${kalshiApiKey}` }
    });
    res.json(response.data);
  } catch (e) {
    console.error(e);
    res.json({ error: 'Error fetching market data' });
  }
});

// Example: Place an order
app.post('/order', async (req, res) => {
  const { marketId, side, size } = req.body;
  try {
    const response = await axios.post(`https://trade-api.kalshi.com/v1/orders`, {
      marketId,
      side,
      size
    }, {
      headers: { 'Authorization': `Bearer ${kalshiApiKey}` }
    });
    res.json(response.data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error placing order' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));