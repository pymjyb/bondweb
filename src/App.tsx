import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Institutions from './pages/Institutions';
import InstitutionDetail from './pages/InstitutionDetail';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/institutions/:id" element={<InstitutionDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
