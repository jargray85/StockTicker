const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://stockticker-backend.onrender.com'
    : 'http://localhost:5001',
  apiKeys: {
    fmp: process.env.REACT_APP_FMP_API_KEY,
    finnhub: process.env.REACT_APP_FINNHUB_API_KEY,
    alphaVantage: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY
  }
};

export default config; 