import { useState } from "react";
import { useEmployees } from "../context/EmployeesContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function EmployeeModal({ employee, onClose }) {
  const { updateEmployee } = useEmployees();
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(employee);

  if (!employee) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setForm(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  }

  function handleSave() {
    updateEmployee(form);
    setEditing(false);
  }

  const birthday = new Date(employee.birthday);
  const age = new Date().getFullYear() - birthday.getFullYear();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md mx-4 rounded-3xl bg-card border border-card p-8 glow-card">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          ✕
        </button>

        {/* IMAGE */}
        <label className="relative flex justify-center cursor-pointer group">
          <img
            src={form.image || "/src/assets/avatar-placeholder.png"}
            className="w-32 h-32 rounded-full object-cover border border-white/20"
          />

          {editing && isAdmin && (
            <>
              <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs">
                Change Photo
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </>
          )}
        </label>

        {/* INFO */}
        <div className="mt-4 text-center space-y-2">
          {editing ? (
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="text-xl bg-transparent border-b border-white/20 text-center"
            />
          ) : (
            <h2 className="text-2xl font-semibold">{employee.name}</h2>
          )}

          <p className="text-white/60">
            {editing ? (
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                className="bg-transparent border-b border-white/20 text-center"
              />
            ) : (
              `${employee.position} · ${employee.department}`
            )}
          </p>
        </div>

        {/* DETAILS */}
        <div className="mt-6 space-y-2 text-sm">
          <Row label="Birthday">
            {editing ? (
              <input
                type="date"
                name="birthday"
                value={form.birthday}
                onChange={handleChange}
                className="bg-transparent border-b border-white/20"
              />
            ) : (
              birthday.toDateString()
            )}
          </Row>

          {!editing && <Row label="Age">{age}</Row>}
        </div>

        {/* ACTIONS */}
        {isAdmin && (
          <div className="mt-8 flex justify-end gap-3">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-xl glow-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-[var(--accent)] text-green-400 glow-btn"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-xl glow-btn"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between text-white/70">
      <span>{label}</span>
      <span className="text-white">{children}</span>
    </div>
  );
}
