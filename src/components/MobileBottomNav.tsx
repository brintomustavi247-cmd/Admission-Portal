import React from "react";
import { motion } from "motion/react";
import { Home, Award, Calendar, Search, Settings } from "lucide-react";

interface MobileBottomNavProps {
  activeTab: "home" | "eligibility" | "calendar";
  onSelectTab: (tab: "home" | "eligibility" | "calendar") => void;
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
    className="relative w-full flex flex-col items-center justify-center p-2 transition-all cursor-pointer group min-h-[56px]"
  >
    {active && (
      <motion.div
        layoutId="mobile-nav-bg"
        className="absolute inset-1 rounded-2xl bg-gradient-to-br from-sky-500/10 to-violet-500/10 dark:from-sky-500/20 dark:to-violet-500/20 border border-sky-300/30 dark:border-sky-500/30"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
    <motion.div
      className={`relative z-10 transition-colors ${
        active
          ? "text-sky-600 dark:text-sky-400"
          : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
      }`}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.div>
    <span
      className={`text-[9px] mt-1 relative z-10 font-bold transition-all ${
        active
          ? "text-sky-700 dark:text-sky-300 font-black"
          : "text-slate-500 dark:text-slate-500"
      }`}
    >
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
  <motion.div
    id="mobile-bottom-navigation"
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 25, delay: 0.2 }}
    className="fixed bottom-0 left-0 right-0 z-40 sm:hidden px-3 pb-3 print:hidden"
    style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
  >
    <div
      className="rounded-3xl bg-white/95 dark:bg-[#1e2530]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-slate-900/20 dark:shadow-black/40 px-1 pt-1"
      style={{
        boxShadow:
          "0 -8px 32px rgba(15,23,42,0.15), 0 -2px 8px rgba(15,23,42,0.08)",
      }}
    >
      <div className="grid grid-cols-5 items-end gap-0.5">
        <Item
          label="হোম"
          icon={
            <Home
              className="w-5 h-5"
              strokeWidth={activeTab === "home" ? 2.5 : 2}
            />
          }
          active={activeTab === "home"}
          onClick={() => {
            onSelectTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        <Item
          label="খুঁজুন"
          icon={<Search className="w-5 h-5" strokeWidth={2} />}
          onClick={() => onOpenSearch?.()}
        />

        {/* Center Elevated Eligibility Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            onSelectTab("eligibility");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="relative -top-4 w-full flex flex-col items-center justify-center cursor-pointer group"
        >
          <motion.div
            animate={{
              boxShadow:
                activeTab === "eligibility"
                  ? [
                      "0 8px 24px rgba(59,130,246,0.4)",
                      "0 12px 32px rgba(139,92,246,0.5)",
                      "0 8px 24px rgba(59,130,246,0.4)",
                    ]
                  : "0 8px 20px rgba(59,130,246,0.3)",
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border-4 border-white dark:border-[#151a23] transition-all ${
              activeTab === "eligibility"
                ? "bg-gradient-to-tr from-sky-500 via-blue-500 to-violet-500 ring-4 ring-sky-400/40 dark:ring-sky-500/30"
                : "bg-gradient-to-tr from-blue-600 to-violet-600"
            }`}
          >
            <Award className="w-7 h-7 text-white" strokeWidth={2.5} />
            {activeTab === "eligibility" && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-white/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
          <span
            className={`text-[10px] mt-1 font-bold transition-colors ${
              activeTab === "eligibility"
                ? "font-black text-sky-700 dark:text-sky-400"
                : "text-slate-700 dark:text-slate-400"
            }`}
          >
            যোগ্যতা
          </span>
        </motion.button>

        <Item
          label="ক্যালেন্ডার"
          icon={
            <Calendar
              className="w-5 h-5"
              strokeWidth={activeTab === "calendar" ? 2.5 : 2}
            />
          }
          active={activeTab === "calendar"}
          onClick={() => {
            onSelectTab("calendar");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        <Item
          label="সেটিংস"
          icon={<Settings className="w-5 h-5" strokeWidth={2} />}
          onClick={() => onOpenSettings?.()}
        />
      </div>
    </div>
  </motion.div>
);
