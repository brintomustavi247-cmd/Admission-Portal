import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppGate } from './components/AppGate';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import AdmissionDashboard from './page';
import { LogOut, ShieldCheck } from 'lucide-react';

const Inner: React.FC = () => {
  const { session, profile, loading, signOut } = useAuth();
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
    <>
      <div className="bg-slate-100 dark:bg-[#10141d] border-b border-slate-200/70 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-300">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-2">
          <span className="truncate">
            {session.user.email}
            {profile?.role === 'admin' && (
              <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">ADMIN</span>
            )}
          </span>
          <span className="flex items-center gap-2 shrink-0">
            {profile?.role === 'admin' && (
              <button onClick={() => setRoute('admin')}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-600/20 cursor-pointer">
                <ShieldCheck className="w-3 h-3" /> Admin
              </button>
            )}
            <button onClick={async () => { await signOut(); setRoute('landing'); }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-red-500 font-bold hover:bg-red-500/10 cursor-pointer">
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </span>
        </div>
      </div>
      <AppGate>
        <AdmissionDashboard />
      </AppGate>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}