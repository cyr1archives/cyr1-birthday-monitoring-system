import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const ROLE_KEY = "cyr1_role";
const ADMIN_HASH_KEY = "cyr1_admin_hash";

// default PIN = 1234 (hashed)
const DEFAULT_ADMIN_HASH = btoa("1234");

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => {
    return localStorage.getItem(ROLE_KEY) || "viewer";
  });

  const [adminHash, setAdminHash] = useState(() => {
    return localStorage.getItem(ADMIN_HASH_KEY) || DEFAULT_ADMIN_HASH;
  });

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(ADMIN_HASH_KEY, adminHash);
  }, [adminHash]);

  function verifyAdminPin(pin) {
    return btoa(pin) === adminHash;
  }

  function loginAsAdmin(pin) {
    if (verifyAdminPin(pin)) {
      setRole("admin");
      return true;
    }
    return false;
  }

  function logout() {
    setRole("viewer");
  }

  return (
    <AuthContext.Provider
      value={{
        role,
        loginAsAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
