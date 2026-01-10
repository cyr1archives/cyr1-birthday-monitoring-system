import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Calendar from "./pages/calendar.jsx";
import Database from "./pages/database.jsx";
import { migrateLocalEmployees } from "./utils/migrateLocalToSupabase.js";

export default function App() {
  useEffect(() => {
    migrateLocalEmployees();
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/database" element={<Database />} />
      </Routes>
    </Layout>
  );
}
