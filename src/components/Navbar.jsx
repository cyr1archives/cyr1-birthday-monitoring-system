import { NavLink } from "react-router-dom";
import NotificationBell from "./notifications/NotificationBell.jsx";
import { useNotifications } from "./notifications/useNotifications.jsx";
import logo from "../assets/logo.svg";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AdminLoginModal from "./AdminLoginModal.jsx";

export default function Navbar() {
  const notif = useNotifications();
  const { role, logout } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);


  return (
    <header className="h-16 px-6 flex items-center border-b border-white/5">
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        <span className="font-semibold tracking-wide">
          CYR1 Birthday Monitoring
        </span>
      </div>

      {/* NAV (CENTER) */}
      <nav className="mx-auto flex gap-8 text-sm items-center">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        <NavLink to="/database">Database</NavLink>

        {/* NEW: POST NOW */}
        <a
  href="https://business.facebook.com/latest/composer"
  target="_blank"
  rel="noopener noreferrer"
  className="text-white/70 hover:text-white transition"
>
  Post Now
</a>

        {role === "admin" ? (
          <button
            onClick={logout}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Logout Admin
          </button>
        ) : (
          <button
            onClick={() => setShowAdmin(true)}
            className="text-xs text-white/60 hover:text-white"
          >
            Admin Login
          </button>
        )}

<AdminLoginModal
  open={showAdmin}
  onClose={() => setShowAdmin(false)}
/>

      </nav>

      {/* NOTIFICATIONS */}
      <NotificationBell {...notif} />
    </header>
  );
}
