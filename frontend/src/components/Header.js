import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const [indices, setIndices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIndices = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('http://localhost:5001/api/indices');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Received indices data:', data);
                
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format: expected an array');
                }
                
                const validIndices = data.filter(index => 
                    index && 
                    typeof index === 'object' && 
                    index.symbol && 
                    typeof index.price === 'number'
                );
                
                console.log('Filtered valid indices:', validIndices);
                setIndices(validIndices);
            } catch (err) {
                console.error('Error fetching indices:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchIndices();
        const interval = setInterval(fetchIndices, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatPercentage = (value) => {
        if (value === undefined || value === null || isNaN(value)) {
            return 'N/A';
        }
        const formattedValue = parseFloat(value).toFixed(2);
        return formattedValue > 0 ? `+${formattedValue}%` : `${formattedValue}%`;
    };

    return (
        <header className="header">
            <div className="nav">
                <Link to='/'>
                    <div>Stockticker</div>
                </Link>
            </div>
            <div className="market-indices">
                {loading ? (
                    <div className="loading">Loading indices...</div>
                ) : error ? (
                    <div className="error">Error: {error}</div>
                ) : indices.length === 0 ? (
                    <div className="no-data">No index data available</div>
                ) : (
                    indices.map((index) => (
                        <div key={index.symbol} className="index-item">
                            <span className="index-name">{index.displayName || index.symbol}</span>
                            <span className="index-price">${index.price.toFixed(2)}</span>
                            <span className={`index-change ${index.changesPercentage >= 0 ? 'positive' : 'negative'}`}>
                                {formatPercentage(index.changesPercentage)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </header>
    );
}

export default Header;
