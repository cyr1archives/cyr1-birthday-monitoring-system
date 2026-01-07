import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLoginModal({ open, onClose }) {
  const { loginAsAdmin } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!loginAsAdmin(pin)) {
      setError("Invalid PIN");
      return;
    }
    setPin("");
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm mx-4
                   rounded-2xl bg-card border border-card
                   p-6 glow-card"
      >
        <h3 className="text-lg font-semibold mb-2">
          Admin Access
        </h3>

        <p className="text-white/60 text-sm mb-4">
          Enter admin PIN to continue
        </p>

        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          className="w-full px-4 py-2 rounded-xl
                     bg-black/40 border border-white/10
                     focus:outline-none"
          placeholder="••••"
          autoFocus
        />

        {error && (
          <p className="text-red-400 text-sm mt-2">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl glow-btn"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[var(--accent)] text-green-400 glow-btn"
          >
            Unlock
          </button>
        </div>
      </form>
    </div>
  );
}
