import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const EmployeesContext = createContext();

export function EmployeesProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("name");

    if (!error && data) {
      setEmployees(data);
      localStorage.setItem("cyr1_cache", JSON.stringify(data));
    } else {
      const cache = localStorage.getItem("cyr1_cache");
      if (cache) setEmployees(JSON.parse(cache));
    }
    setLoading(false);
  }

  async function addEmployee(emp) {
    const { data } = await supabase
      .from("employees")
      .insert(emp)
      .select()
      .single();

    setEmployees(prev => [...prev, data]);
  }

  async function updateEmployee(emp) {
    await supabase.from("employees").update(emp).eq("id", emp.id);
    setEmployees(prev =>
      prev.map(e => (e.id === emp.id ? emp : e))
    );
  }

  async function deleteEmployee(id) {
    await supabase.from("employees").delete().eq("id", id);
    setEmployees(prev => prev.filter(e => e.id !== id));
  }

  return (
    <EmployeesContext.Provider
      value={{
        employees,
        loading,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        setEmployees
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
}

export function useEmployees() {
  return useContext(EmployeesContext);
}
