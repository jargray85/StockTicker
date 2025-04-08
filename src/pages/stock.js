import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import StockSearch from '../components/Stocksearch';
import '../styles/Stock.css';

// Use your Finnhub API key
const API_KEY = process.env.REACT_APP_FH_API_KEY;

const Stock = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);

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
          <StockSearch />
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