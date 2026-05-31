import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NAV_ITEMS } from "../utils/constants";

const iconMap = {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  User,
  Settings
};

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();

  const navContent = (
    <>
      <div className="mb-6 flex items-start justify-between gap-2 px-1 lg:mb-8">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-white">Team Task Manager</h1>
          <p className="text-xs text-slate-500">MERN Dashboard</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition sm:py-2.5 ${
                  isActive
                    ? "bg-brand-600/20 text-brand-300"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {Icon ? <Icon size={18} className="shrink-0" /> : null}
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 border-t border-slate-800 pt-4">
        <div className="mb-3 rounded-lg bg-slate-900 px-3 py-2">
          <p className="truncate text-sm font-medium text-white">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
          <span className="mt-1 inline-block rounded bg-brand-600/20 px-2 py-0.5 text-xs text-brand-300 capitalize">
            {user?.role}
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-rose-300 sm:py-2"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-label="Close menu overlay"
          />
        ) : null}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,18rem)] flex-col border-r border-slate-800 bg-slate-950 p-4 shadow-2xl lg:hidden"
          >
            {navContent}
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950/95 p-4 lg:sticky lg:top-0 lg:flex">
        {navContent}
      </aside>
    </>
  );
}
