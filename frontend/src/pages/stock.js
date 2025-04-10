import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import StockSearch from '../components/StockSearch';
import '../styles/Stock.css';

const Stock = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);

  const formatMarketCap = (value) => {
    if (!value || value === 0) return 'N/A';
    
    // If the value is already in billions
    if (value < 1000) {
      return `$${value.toFixed(2)}B`;
    }
    
    // If the value is in millions
    if (value < 1000000) {
      return `$${(value / 1000).toFixed(2)}B`;
    }
    
    // If the value is in raw format
    return `$${(value / 1e9).toFixed(2)}B`;
  };

  const formatVolume = (value) => {
    if (!value || value === 0) return 'N/A';
    
    // If the value is in millions
    if (value < 1000000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    
    // If the value is in billions
    if (value < 1000000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    
    // If the value is in trillions
    return `${(value / 1000000000).toFixed(1)}B`;
  };

  const getStock = useCallback(async () => {
    try {
      const [quoteResponse, profileResponse] = await Promise.all([
        fetch(`http://localhost:5001/api/stock/quote/${symbol}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }),
        fetch(`http://localhost:5001/api/stock/profile/${symbol}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })
      ]);

      if (!quoteResponse.ok || !profileResponse.ok) {
        throw new Error('API request failed');
      }
      const quoteData = await quoteResponse.json();
      const profileData = await profileResponse.json();
      
      // Log the data to see the structure
      console.log('Quote data:', quoteData);
      console.log('Profile data:', profileData);
      
      setStock({ ...quoteData, ...profileData });
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  }, [symbol]);

  useEffect(() => {
    getStock();
  }, [symbol, getStock]);

  const Loaded = () => {
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
                  {formatMarketCap(stock.marketCapitalization)}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">IPO Date</span>
                <span className="value">
                  {stock.ipo ? new Date(stock.ipo).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">52W High</span>
                <span className="value">
                  ${stock.h ? stock.h.toFixed(2) : 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">52W Low</span>
                <span className="value">
                  ${stock.l ? stock.l.toFixed(2) : 'N/A'}
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