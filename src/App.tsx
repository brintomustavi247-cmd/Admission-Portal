import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppGate } from './components/AppGate';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import AdmissionDashboard from './page';

const Inner: React.FC = () => {
  const { session, profile, loading } = useAuth();
  const [route, setRoute] = useState<'landing' | 'login' | 'app' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'admin') return 'admin';
    }
    return 'landing';
  });

  /* Hash sync for route (e.g. #/admin) */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'admin') {
        setRoute('admin');
      } else if (route === 'admin') {
        setRoute('app');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [route]);

  /* referral link (?ref=CODE) → সরাসরি register screen */
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref && !session) setRoute('login');
  }, [session]);

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
    return (
      <Admin
        onExit={() => {
          setRoute('app');
          const savedTab = localStorage.getItem('active_tab') || 'home';
          window.location.hash = `/${savedTab}`;
        }}
      />
    );
  }

  return (
    <AppGate>
      <AdmissionDashboard
        onOpenAdmin={() => {
          setRoute('admin');
          window.location.hash = '/admin';
        }}
      />
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