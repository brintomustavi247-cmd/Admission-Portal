import React from 'react';
import { motion } from 'motion/react';
import { Home, Award, Calendar, Search, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'eligibility' | 'calendar';
  onSelectTab: (tab: 'home' | 'eligibility' | 'calendar') => void;
  onOpenSearch?: () => void;
  onOpenSettings?: () => void;
}

const Item: React.FC<{
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}> = ({ label, icon, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative w-full flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
      active ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'
    }`}
  >
    {active && (
      <motion.div
        layoutId="mobile-nav-indicator"
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r from-sky-500 to-violet-500"
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    )}
    {icon}
    <span className={`text-[10px] mt-1 ${active ? 'font-black' : 'font-semibold'}`}>
      {label}
    </span>
  </button>
);

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenSettings,
}) => (
  <div
    id="mobile-bottom-navigation"
    className="fixed bottom-0 left-0 right-0 z-40 sm:hidden mx-3 mb-3 rounded-3xl bg-white/95 dark:bg-[#1e2530]/95 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] px-1 pt-2.5 pb-safe print:hidden"
  >
    <div className="grid grid-cols-5 items-end">
      <Item
        label="হোম"
        icon={<Home className="w-5 h-5" />}
        active={activeTab === 'home'}
        onClick={() => {
          onSelectTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <Item
        label="খুঁজুন"
        icon={<Search className="w-5 h-5" />}
        onClick={() => onOpenSearch?.()}
      />

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          onSelectTab('eligibility');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="relative -top-3 w-full flex flex-col items-center justify-center cursor-pointer"
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-white dark:border-[#151a23] shadow-lg transition-all ${
            activeTab === 'eligibility'
              ? 'bg-gradient-to-tr from-sky-500 to-violet-500 ring-2 ring-sky-300/50 dark:ring-sky-600/40'
              : 'bg-gradient-to-tr from-blue-600 to-violet-600'
          }`}
        >
          <Award className="w-6 h-6 text-white" />
        </div>
        <span
          className={`text-[10px] mt-1 ${
            activeTab === 'eligibility'
              ? 'font-black text-sky-700 dark:text-sky-400'
              : 'font-bold text-slate-600 dark:text-slate-400'
          }`}
        >
          যোগ্যতা
        </span>
      </motion.button>

      <Item
        label="ক্যালেন্ডার"
        icon={<Calendar className="w-5 h-5" />}
        active={activeTab === 'calendar'}
        onClick={() => {
          onSelectTab('calendar');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <Item
        label="সেটিংস"
        icon={<Settings className="w-5 h-5" />}
        onClick={() => onOpenSettings?.()}
      />
    </div>
  </div>
);
