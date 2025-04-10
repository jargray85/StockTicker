import React, { useState, useEffect } from 'react';
import '../styles/NewsFeed.css';
import config from '../config';

const NewsFeed = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/news`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
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
  }, []);

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