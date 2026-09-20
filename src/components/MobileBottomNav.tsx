import React from "react";
import { motion } from "motion/react";
import { Home, Award, Calendar, Search } from "lucide-react";

interface MobileBottomNavProps {
  activeTab: "home" | "eligibility" | "calendar";
  onSelectTab: (tab: "home" | "eligibility" | "calendar") => void;
  onOpenSearch?: () => void;
}

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  isTab: boolean;
  tabKey?: "home" | "eligibility" | "calendar";
  isCenter?: boolean;
};

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
}) => {
  const navItems: NavItem[] = [
    {
      id: "home",
      label: "হোম",
      icon: <Home className="w-5 h-5" />,
      action: () => {
        onSelectTab("home");
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      isTab: true,
      tabKey: "home",
    },
    {
      id: "eligibility",
      label: "যোগ্যতা",
      icon: <Award className="w-6 h-6" />,
      action: () => {
        onSelectTab("eligibility");
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      isTab: true,
      tabKey: "eligibility",
      isCenter: true,
    },
    {
      id: "calendar",
      label: "ক্যালেন্ডার",
      icon: <Calendar className="w-5 h-5" />,
      action: () => {
        onSelectTab("calendar");
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      isTab: true,
      tabKey: "calendar",
    },
    {
      id: "search",
      label: "খুঁজুন",
      icon: <Search className="w-5 h-5" />,
      action: () => onOpenSearch?.(),
      isTab: false,
    },
  ];

  return (
    <div
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 sm:hidden nav-dock mx-4 mb-4 rounded-3xl px-3 pt-2 pb-safe print:hidden"
    >
      <div className="flex items-end justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = item.isTab && activeTab === item.tabKey;

          if (item.isCenter) {
            // Center highlighted button (Eligibility)
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={item.action}
                whileTap={{ scale: 0.92 }}
                className="relative -top-3 flex flex-col items-center justify-center cursor-pointer group"
                aria-label={item.label}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-4 border-white dark:border-[#1e2530] ${
                    isActive
                      ? "bg-gradient-to-tr from-blue-500 to-violet-500 text-white shadow-[0_4px_14px_-2px_rgba(59,130,246,0.5)] ring-4 ring-blue-400/40"
                      : "bg-gradient-to-tr from-blue-500 to-violet-500 text-white shadow-[0_4px_14px_-2px_rgba(59,130,246,0.35)]"
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[10px] mt-1 ${
                    isActive
                      ? "font-black text-blue-700 dark:text-blue-400"
                      : "font-bold text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          }

          // Regular nav item
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={item.action}
              whileTap={{ scale: 0.92 }}
              className={`relative flex flex-col items-center justify-center p-2 transition-colors cursor-pointer ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-500"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-1 w-8 h-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className={isActive ? "scale-110 transition-transform" : ""}>
                {item.icon}
              </div>
              <span
                className={`text-[10px] mt-1 ${
                  isActive ? "font-black" : "font-semibold"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
