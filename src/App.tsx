import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Institutions from './pages/Institutions';
import InstitutionDetail from './pages/InstitutionDetail';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import RequestInstitution from './pages/RequestInstitution';
import ProtectedRoute from './components/ProtectedRoute';

// Component to handle GitHub Pages 404 redirects
function RedirectHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we have a stored redirect from 404.html
    const redirectRoute = sessionStorage.getItem('ghp_redirect');
    if (redirectRoute) {
      sessionStorage.removeItem('ghp_redirect');
      // Navigate to the stored route
      navigate(redirectRoute, { replace: true });
    }
  }, [navigate]);
  
  return null;
}

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <BrowserRouter basename={basename}>
      <RedirectHandler />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/institutions/:id" element={<InstitutionDetail />} />
          <Route path="/request-institution" element={<RequestInstitution />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
