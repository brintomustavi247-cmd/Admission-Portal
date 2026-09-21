import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppGate } from './components/AppGate';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import AdmissionDashboard from './page';

const Inner: React.FC = () => {
  const { session, profile, loading } = useAuth();
  const [route, setRoute] = useState<'landing' | 'login' | 'app' | 'admin'>('landing');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1017] flex items-center justify-center text-slate-300 text-sm">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!session) {
    return route === 'login'
      ? <Login onDone={() => setRoute('app')} />
      : <Landing onGetStarted={() => setRoute('login')} />;
  }

  const effective = route === 'landing' ? 'app' : route;

  if (effective === 'admin' && profile?.role === 'admin') {
    return <Admin onExit={() => setRoute('app')} />;
  }

  return (
    <AppGate>
      <AdmissionDashboard onOpenAdmin={() => setRoute('admin')} />
    </AppGate>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
};