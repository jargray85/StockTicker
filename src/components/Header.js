import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const [indices, setIndices] = useState([]);
    const API_KEY = process.env.REACT_APP_FMP_API_KEY;

    useEffect(() => {
        const fetchIndices = async () => {
            try {
                const fetchSymbol = async (symbol, displayName) => {
                    const response = await fetch(`https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${API_KEY}`);
                    if (!response.ok) {
                        throw new Error(`API request for ${symbol} failed`);
                    }
                    const data = await response.json();
                    return data.map(item => {
                        const computedChangePercentage = item.changesPercentage !== undefined ? item.changesPercentage :
                            (item.previousClose ? ((item.price - item.previousClose) / item.previousClose) * 100 : undefined);
                        return {
                            ...item,
                            displayName,
                            price: item.price,
                            changesPercentage: computedChangePercentage
                        };
                    });
                };

                const [spData, nasdaqData] = await Promise.all([
                    fetchSymbol('^GSPC', 'S&P 500'),
                    fetchSymbol('^IXIC', 'NASDAQ')
                ]);

                const combinedData = [...spData, ...nasdaqData];
                console.log('Combined data:', combinedData);
                setIndices(combinedData);
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
                            <span className={`index-change ${index.changesPercentage !== undefined ? (index.changesPercentage > 0 ? 'positive' : 'negative') : ''}`}>
                                {index.changesPercentage !== undefined ? (index.changesPercentage > 0 ? '+' : '') + index.changesPercentage.toFixed(2) + '%' : 'N/A'}
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
