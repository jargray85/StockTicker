import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const [indices, setIndices] = useState([]);
    const API_KEY = process.env.REACT_APP_FMP_API_KEY;

    useEffect(() => {
        const fetchIndices = async () => {
            try {
                const response = await fetch(
                    `https://financialmodelingprep.com/api/v3/quote/SPY,DIA?apikey=${API_KEY}`
                );

                if (!response.ok) {
                    throw new Error('API request failed');
                }

                const data = await response.json();
                
                const mappedData = data.map(item => ({
                    ...item,
                    displayName: item.symbol === 'SPY' ? 'S&P 500' :
                                item.symbol === 'DIA' ? 'DOW' :
                                'NASDAQ',
                    price: item.symbol === 'DIA' ? item.price * 100 :
                           item.symbol === 'SPY' ? item.price * 10 :
                           item.price
                }));
                console.log('Mapped data:', mappedData);
                setIndices(mappedData);
            } catch (error) {
                console.error('Error fetching indices:', error);
                setIndices([]);
            }
        };

        fetchIndices();
        const interval = setInterval(fetchIndices, 60000);
        return () => clearInterval(interval);
    }, [API_KEY]);

    return (
        <header className="header">
            <div className="nav">
                <Link to='/'>
                    <div>Stockticker</div>
                </Link>
            </div>
            <div className="market-indices">
                {indices && indices.length > 0 ? (
                    indices.map(index => (
                        <div key={index.symbol} className="index-item">
                            <span className="index-name">{index.displayName}</span>
                            <span className="index-price">{index.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}</span>
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
