import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [indices, setIndices] = useState([]);
    const API_KEY = 'c70eede2154ffd89e1d9381562d4ed23';

    useEffect(() => {
        const fetchIndices = async () => {
            try {
                const response = await fetch(
                    `https://financialmodelingprep.com/api/v3/quote/SPY,DIA,QQQ?apikey=${API_KEY}`
                );

                if (!response.ok) {
                    throw new Error('API request failed');
                }

                const data = await response.json();
                
                const mappedData = data.map(item => ({
                    ...item,
                    displayName: item.symbol === 'SPY' ? 'S&P 500' :
                                item.symbol === 'DIA' ? 'DOW' :
                                'NASDAQ'
                }));

                setIndices(mappedData);
            } catch (error) {
                console.error('Error fetching indices:', error);
                setIndices([]);
            }
        };

        fetchIndices();
        const interval = setInterval(fetchIndices, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header">
            <div className="market-indices">
                {indices && indices.length > 0 ? (
                    indices.map(index => (
                        <div key={index.symbol} className="index-item">
                            <span className="index-name">{index.displayName}</span>
                            <span className="index-price">{index.price.toFixed(2)}</span>
                            <span className={`index-change ${index.changesPercentage > 0 ? 'positive' : 'negative'}`}>
                                {index.changesPercentage > 0 ? '+' : ''}{index.changesPercentage.toFixed(2)}%
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="loading">Loading market data...</div>
                )}
            </div>
        </header>
    );
}

export default Header;