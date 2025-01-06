import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { StorePage } from './pages/Store';
import { BotPage } from './pages/Bot';
import { Layout } from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <div className="min-h-screen bg-[#1A1D1F] text-white relative">
            <div 
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{
                backgroundImage: 'url("/background.webp")',
                opacity: 0.1
              }}
            />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/bot" element={<BotPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </Layout>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;