import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegionPage from './pages/RegionPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/region/:regionName" 
          element={
            <ProtectedRoute>
              <RegionPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
