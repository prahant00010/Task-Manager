import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useApp } from "../context/AppContext";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { refreshAll, loading } = useApp();

  useEffect(() => {
    refreshAll().catch(() => {});
  }, [refreshAll]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen min-h-[100dvh] w-full">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2.5 text-slate-300 hover:bg-slate-800 active:bg-slate-700"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="truncate font-semibold text-white">Team Task Manager</span>
        </header>
        <main className="flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8">
          {loading ? (
            <div className="mb-4 h-1 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className="h-full bg-brand-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
            </div>
          ) : null}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-auto w-full max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
