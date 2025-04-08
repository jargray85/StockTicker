import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Stock.css';

// Use your Finnhub API key
const API_KEY = process.env.REACT_APP_FH_API_KEY;

const Stock = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Search using Finnhub's search endpoint
  const handleSearch = async (query) => {
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${API_KEY}`
      );
      const data = await response.json();
      // Finnhub returns results in the "result" field; limit to the top 5
      setSearchResults(data.result ? data.result.slice(0, 5) : []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch stock quote and profile concurrently from Finnhub
  const getStock = useCallback(async () => {
    try {
      const [quoteResponse, profileResponse] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`)
      ]);

      if (!quoteResponse.ok || !profileResponse.ok) {
        throw new Error('API request failed');
      }
      const quoteData = await quoteResponse.json();
      const profileData = await profileResponse.json();
      // Combine the quote and profile data
      setStock({ ...quoteData, ...profileData });
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  }, [symbol]);

  useEffect(() => {
    getStock();
  }, [symbol, getStock]);

  // Function to handle selecting a search result
  const handleSelect = (item) => {
    console.log('Selected:', item);
    // Navigate to the new stock page using a full-page reload.
    window.location.assign(`/stock/${item.symbol}`);
    // Clear the search input and results
    setSearchQuery('');
    setSearchResults([]);
  };

  const Loaded = () => {
    // Finnhub quote: c = current price, h = high, l = low, o = open, pc = previous close
    const currentPrice = stock.c;
    const previousClose = stock.pc;
    const priceChange = currentPrice - previousClose;
    const priceChangePercent = previousClose ? ((priceChange / previousClose) * 100) : 0;
    const isPositive = priceChange >= 0;

    return (
      <>
        <div className="search-container">
          <h1>Search for a stock</h1>
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <div className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map(result => (
                  <div
                    key={result.symbol}
                    className="search-result-item"
                    onClick={() => handleSelect(result)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="symbol">{result.symbol}</span> - <span className="name">{result.description}</span>
                  </div>
                ))
              ) : null}
            </div>
          )}
        </div>

        <div className="stock-container">
          <div className="stock-header">
            <div className="stock-title">
              <h1>{stock.name || stock.ticker}</h1>
              <span className="stock-symbol">{stock.ticker}</span>
            </div>
            <div className="stock-price-container">
              <h2 className="stock-price">${currentPrice.toFixed(2)}</h2>
              <span className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="stock-details">
            <div className="detail-card">
              <h3>Today's Range</h3>
              <div className="range">
                <span>${stock.l ? stock.l.toFixed(2) : 'N/A'}</span>
                <div className="range-bar"></div>
                <span>${stock.h ? stock.h.toFixed(2) : 'N/A'}</span>
              </div>
            </div>

            <div className="detail-card">
              <h3>Exchange</h3>
              <div className="detail-value">
                <span>{stock.exchange || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Market Cap</span>
                <span className="value">
                  {stock.marketCapitalization ? `$${(stock.marketCapitalization / 1e9).toFixed(2)}B` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading = () => (
    <div className="loading-container">
      <div className="loading">Loading...</div>
    </div>
  );

  return stock ? <Loaded /> : <Loading />;
};

export default Stock;