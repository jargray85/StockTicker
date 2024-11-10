import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Stock.css';

const Stock = () => {
    const apiKey = process.env.REACT_APP_FMP_API_KEY;
    const { symbol } = useParams();
    const [stock, setStock] = useState(null);

    const getStock = async () => {
        try {
            const response = await fetch(
                `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`
            );
            const data = await response.json();
            setStock(data[0]);
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    };

    useEffect(() => {
        getStock();
    }, [symbol]);

    const Loaded = () => {
        const priceChange = stock.change.toFixed(2);
        const priceChangePercent = stock.changesPercentage.toFixed(2);
        const isPositive = stock.change > 0;

        return (
            <div className="stock-container">
                <div className="stock-header">
                    <div className="stock-title">
                        <h1>{stock.name}</h1>
                        <span className="stock-symbol">{stock.symbol}</span>
                    </div>
                    <div className="stock-price-container">
                        <h2 className="stock-price">${stock.price.toFixed(2)}</h2>
                        <span className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
                            {isPositive ? '+' : ''}{priceChange} ({priceChangePercent}%)
                        </span>
                    </div>
                </div>

                <div className="stock-details">
                    <div className="detail-card">
                        <h3>Today's Range</h3>
                        <div className="range">
                            <span>${stock.dayLow.toFixed(2)}</span>
                            <div className="range-bar"></div>
                            <span>${stock.dayHigh.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="detail-card">
                        <h3>52 Week Range</h3>
                        <div className="range">
                            <span>${stock.yearLow.toFixed(2)}</span>
                            <div className="range-bar"></div>
                            <span>${stock.yearHigh.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="label">Market Cap</span>
                            <span className="value">${(stock.marketCap / 1e9).toFixed(2)}B</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Volume</span>
                            <span className="value">{(stock.volume / 1e6).toFixed(2)}M</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Avg Volume</span>
                            <span className="value">{(stock.avgVolume / 1e6).toFixed(2)}M</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">P/E Ratio</span>
                            <span className="value">{stock.pe ? stock.pe.toFixed(2) : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
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