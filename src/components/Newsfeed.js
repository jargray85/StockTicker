import React, { useState, useEffect } from 'react';
import '../styles/NewsFeed.css';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const API_KEY = process.env.REACT_APP_FH_API_KEY;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [API_KEY]);

  return (
    <div className="newsfeed">
      <h2>News</h2>
      {news.length > 0 ? (
        <ul className="news-list">
          {news.map((article) => (
            <li key={article.id} className="news-item">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h3 className="news-headline">{article.headline}</h3>
              </a>
              <p className="news-source">
                {article.source} - {new Date(article.datetime * 1000).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading news...</p>
      )}
    </div>
  );
};

export default NewsFeed;