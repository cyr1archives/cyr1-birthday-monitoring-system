import { createContext, useContext, useEffect, useState } from "react";
import { saveImage, loadImage } from "../utils/imageStore";

const EmployeesContext = createContext(null);
const STORAGE_KEY = "cyr1_employees";

export function EmployeesProvider({ children }) {
  const [employees, setEmployees] = useState([]);

  // LOAD
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    Promise.all(
      parsed.map(async e => ({
        ...e,
        image: await loadImage(e.id)
      }))
    ).then(setEmployees);
  }, []);

  // SAVE (WITHOUT IMAGE DATA)
  useEffect(() => {
    const safe = employees.map(({ image, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  }, [employees]);

  async function updateEmployee(emp) {
    if (emp.image) {
      await saveImage(emp.id, emp.image);
    }

    setEmployees(prev =>
      prev.map(e => (e.id === emp.id ? emp : e))
    );
  }

  return (
    <EmployeesContext.Provider
      value={{ employees, setEmployees, updateEmployee }}
    >
      {children}
    </EmployeesContext.Provider>
  );
}

export function useEmployees() {
  const ctx = useContext(EmployeesContext);
  if (!ctx) {
    throw new Error("useEmployees must be used inside provider");
  }
  return ctx;
}
