import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Calendar from "./pages/Calendar.jsx";
import Database from "./pages/database.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <LoadingScreen visible={loading} />

      {!loading && (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />

            {/* Database visible to all, actions restricted inside */}
            <Route path="/database" element={<Database />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}
