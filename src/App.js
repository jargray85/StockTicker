import './App.css';
// import route and our components
import {Route, Routes} from 'react-router-dom'
import Nav from './components/Nav';
import Price from './pages/price';
import Stocks from './pages/stocks';

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes >
        <Route path='/stocks' element={<Stocks />} />
        <Route path='/price/:symbol' element={<Price />} />
      </Routes>
    </div>
  );
}

export default App;
