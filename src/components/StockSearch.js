import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Home.css';

const Stocksearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const API_KEY = process.env.REACT_APP_FMP_API_KEY;

    const handleSearch = async (query) => {
        if (query.length < 1) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(
                `https://financialmodelingprep.com/api/v3/search-name?query=${query}&limit=5&exchange=NASDAQ,NYSE&apikey=${API_KEY}`
            );
            const data = await response.json();
            setSearchResults(data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    return (
        <>
            <div className="search-container">
                <h1>Search for a stock</h1>
                <input
                    type="text"
                    placeholder="Search stocks..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(e.target.value);
                    }}
                />

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div className="search-results">
                        {searchResults.map(result => (
                            <Link 
                                key={result.symbol}
                                to={`/stock/${result.symbol}`}
                                className="search-result-item"
                                onClick={() => {
                                    setSearchQuery('');
                  setSearchResults([]);
                }}
                            >
                                <span className="symbol">{result.symbol}</span>
                                <span className="name">{result.name}</span>
                                <span className="exchange">{result.exchangeShortName}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Stocksearch