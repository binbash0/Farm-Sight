import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import IndexPage from './components/Index';
import { Loader } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-farm-green-50 to-nasa-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-farm-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading FarmSight...</p>
        </div>
      </div>
    );
  }

  return (
    <GameProvider>
      <IndexPage />
    </GameProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
