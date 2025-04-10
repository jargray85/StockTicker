import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import config from '../config';

const StockSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (item) => {
    console.log('Selected:', item);
    navigate(`/stock/${item.symbol}`);
    setQuery(item.symbol);
    setResults([]);
  };

  const fetchSearchResults = useCallback(async (searchTerm) => {
    if (!searchTerm) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/api/stock/search?q=${encodeURIComponent(searchTerm)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error || ''}`);
      }
      const data = await response.json();
      setResults(data.result || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError(error.message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSearchResults(query);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query, fetchSearchResults]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for a stock symbol or company..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && (
        <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}
      {query && (
        <div className="search-results">
          {isLoading ? (
            <div>Loading...</div>
          ) : results && results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.symbol}
                className="search-result-item"
                onClick={() => handleSelect(item)}
              >
                <strong>{item.symbol}</strong> - {item.description}
              </div>
            ))
          ) : (
            <div>No results found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;