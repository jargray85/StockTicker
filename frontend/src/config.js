const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://stockticker-backend.onrender.com'
    : 'http://localhost:5001'
};

export default config; 