import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import ListPage from './components/ListPage';
import DetailPage from './components/DetailPage';

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/investors" element={<ListPage type="investors" />} />
          <Route path="/investors/:id" element={<DetailPage type="investors" />} />
          <Route path="/issuers" element={<ListPage type="issuers" />} />
          <Route path="/issuers/:id" element={<DetailPage type="issuers" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
