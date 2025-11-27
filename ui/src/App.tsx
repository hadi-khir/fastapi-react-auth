import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-muted-foreground">
          You have successfully authenticated with the secure API.
        </p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { token } = useAuth();
  // If token exists, we show Dashboard. 
  // In a real app, you might verify validity or validity expiry here as well.
  return token ? <Dashboard /> : <Auth />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}