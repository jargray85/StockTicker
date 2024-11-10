import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Stock from './pages/stock';
import Home from './pages/home';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock/:symbol" element={<Stock />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
