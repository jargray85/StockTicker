require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
  origin: '*',  // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes
app.use(express.json());

// Finnhub API endpoints
app.get('/api/stock/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log(`Fetching quote for ${symbol}...`);
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    const data = await response.json();
    console.log(`Quote data for ${symbol}:`, JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error(`Error fetching quote for ${req.params.symbol}:`, error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stock/profile/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stock/search', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${q}&token=${process.env.FINNHUB_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Financial Modeling Prep API endpoints
app.get('/api/indices', async (req, res) => {
  try {
    const symbols = [
      { symbol: '^GSPC', displayName: 'S&P 500' },
      { symbol: '^DJI', displayName: 'Dow Jones' },
      { symbol: '^IXIC', displayName: 'NASDAQ' }
    ];
    const indices = [];

    for (const { symbol, displayName } of symbols) {
      console.log(`Fetching data for ${symbol}...`);
      const url = `https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${process.env.FMP_API_KEY}`;
      console.log(`Request URL: ${url}`);

      const response = await axios.get(url);
      console.log(`Response for ${symbol}:`, response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        const data = response.data[0];
        const computedChangePercentage = data.changesPercentage !== undefined ? data.changesPercentage :
          (data.previousClose ? ((data.price - data.previousClose) / data.previousClose) * 100 : undefined);
        
        indices.push({
          symbol: symbol,
          displayName: displayName,
          price: parseFloat(data.price) || 0,
          changesPercentage: computedChangePercentage || 0,
          volume: parseInt(data.volume) || 0,
          timestamp: new Date().toISOString()
        });
      } else {
        console.warn(`No data received for ${symbol}`);
      }
    }

    console.log('Final indices data:', indices);
    res.json(indices);
  } catch (error) {
    console.error('Error fetching indices:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
      console.error('Status:', error.response.status);
    }
    res.status(500).json({ 
      error: 'Failed to fetch market indices',
      message: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// Alpha Vantage API endpoints
app.get('/api/chart/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 