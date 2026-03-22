import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import ProfilePage from './pages/ProfilePage';
import StreamPage from './pages/StreamPage';
import CollabDetailPage from './pages/CollabDetailPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/stream/:id" element={<StreamPage />} />
          <Route path="/collab/:id" element={<CollabDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
