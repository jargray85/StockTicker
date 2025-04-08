import React, { useState, useEffect } from 'react';
import { createChart } from 'lightweight-charts';

const Indexchart = ({ symbol, displayName, apiKey }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`
        );
        if (!response.ok) {
          throw new Error(`API request for ${symbol} failed`);
        }
        const data = await response.json();
        // Log the full API response for debugging
        console.log(`Alpha Vantage response for ${symbol}:`, data);
        const timeSeries = data["Time Series (5min)"];
        if (!timeSeries) {
          if (data["Note"]) {
            console.error(`API Note for ${symbol}:`, data["Note"]);
          } else if (data["Error Message"]) {
            console.error(`API Error for ${symbol}:`, data["Error Message"]);
          } else {
            console.error(`No time series data available for ${symbol}`);
          }
          return; // Exit without updating chart data
        }
        const processedData = Object.keys(timeSeries).map(timeKey => {
          const datapoint = timeSeries[timeKey];
          return {
            time: Math.floor(new Date(timeKey).getTime() / 1000),
            open: parseFloat(datapoint["1. open"]),
            high: parseFloat(datapoint["2. high"]),
            low: parseFloat(datapoint["3. low"]),
            close: parseFloat(datapoint["4. close"]),
          };
        });
        processedData.sort((a, b) => a.time - b.time);
        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching chart data for', symbol, error);
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [symbol, apiKey]);

  useEffect(() => {
    if (chartData.length === 0) return;

    const chartContainer = document.getElementById(`chart-${symbol.replace(/[^a-zA-Z0-9]/g, '')}`);
    const chart = createChart(chartContainer, {
      width: chartContainer.clientWidth,
      height: 200,
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#000',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      timeScale: {
        timeVisible: true,
      },
    });

    // Use addSeries with type 'line' to add a line series.
    const lineSeries = chart.addSeries({ type: 'line' });
    lineSeries.setData(chartData.map(item => ({ time: item.time, value: item.close })));

    const handleResize = () => {
      chart.applyOptions({ width: chartContainer.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [chartData, symbol]);

  return (
    <div className="index-chart">
      <h3>{displayName}</h3>
      <div 
        id={`chart-${symbol.replace(/[^a-zA-Z0-9]/g, '')}`} 
        style={{ width: '300px', height: '200px' }} 
      />
    </div>
  );
};

export default Indexchart;