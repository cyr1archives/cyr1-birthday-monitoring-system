import { useState } from "react";
import { useEmployees } from "../context/EmployeesContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { calculateAge } from "../utils/date";
import { importCSV, exportCSV } from "../utils/csv";
import CreateEmployeeModal from "../components/CreateEmployeeModal.jsx";

export default function Database() {
  const { employees, setEmployees } = useEmployees();
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [openCreate, setOpenCreate] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const data = await importCSV(file);
    setEmployees(data);
  }

  function confirmDelete() {
    setEmployees(employees.filter(e => e.id !== toDelete.id));
    setToDelete(null);
  }

  return (
    <div className="space-y-6">
      {/* ACTIONS */}
      {isAdmin && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 rounded-xl bg-[var(--accent)] text-green-400 glow-btn"
          >
            + Add Employee
          </button>

          <label className="px-4 py-2 rounded-xl cursor-pointer bg-[var(--btn-bg)] glow-btn">
            Upload CSV
            <input type="file" hidden accept=".csv" onChange={handleUpload} />
          </label>

          <button
            onClick={() => exportCSV(employees)}
            className="px-4 py-2 rounded-xl bg-[var(--btn-bg)] glow-btn"
          >
            Export CSV
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="rounded-2xl overflow-hidden bg-card border border-card glow-card">
        <table className="w-full text-sm">
          <thead className="bg-black/20">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Birthday</th>
              <th>Age</th>
              {isAdmin && <th className="text-right pr-4">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {employees.map(e => (
              <tr key={e.id} className="border-t border-white/5">
                <td className="p-3">{e.name}</td>
                <td>{e.position}</td>
                <td>{e.department}</td>
                <td>{e.birthday}</td>
                <td>{calculateAge(e.birthday)}</td>

                {isAdmin && (
                  <td className="text-right pr-4">
                    <button
                      onClick={() => setToDelete(e)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-white/50">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE */}
      {isAdmin && (
        <CreateEmployeeModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
        />
      )}

      {/* DELETE CONFIRM */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setToDelete(null)}
          />

          <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-card border border-card p-6 glow-card">
            <h3 className="text-lg font-semibold mb-2">
              Delete Employee
            </h3>

            <p className="text-white/60 text-sm mb-6">
              Delete <span className="text-white">{toDelete.name}</span>? This
              cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setToDelete(null)}
                className="px-4 py-2 rounded-xl glow-btn"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 glow-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
