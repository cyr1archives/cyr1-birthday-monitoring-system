import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { EmployeesProvider } from "./context/EmployeesContext.jsx";
import "./index.css"; // ❗ REQUIRED
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <EmployeesProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </EmployeesProvider>
  </AuthProvider>
);
