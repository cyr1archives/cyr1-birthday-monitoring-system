import { useState, useRef, useEffect } from "react";
import { playSound } from "../../utils/sound";

export default function NotificationBell({
  notifications = [],
  onDismiss,
  onClearAll
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unread = notifications.length > 0;

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Sound when new notification appears
  useEffect(() => {
    if (notifications.length > 0) {
      playSound("notify");
    }
  }, [notifications.length]);

  return (
    <div ref={ref} className="relative">
      {/* BELL */}
      <button
        onClick={() => {
          setOpen(o => !o);
          playSound("click");
        }}
        className="relative p-2 rounded-full
                   hover:bg-white/10
                   transition glow-btn"
        aria-label="Notifications"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-white/80 ${unread ? "bell-pulse" : ""}`}
        >
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>

        {/* DOT */}
        {unread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-400" />
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-72
                     rounded-2xl bg-card border border-card
                     glow-card shadow-xl
                     origin-top-right animate-dropdown"
        >
          {/* HEADER */}
          <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
            <span className="text-sm font-medium">
              Notifications
            </span>

            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-white/50 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-white/50">
                No notifications
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className="px-4 py-3 text-sm flex justify-between gap-2
                             hover:bg-white/5 border-b border-white/5"
                >
                  <span>{n.message}</span>
                  <button
                    onClick={() => onDismiss(n.id)}
                    className="text-white/40 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
