import { useState } from "react";
import { useEmployees } from "../context/EmployeesContext.jsx";

export default function CreateEmployeeModal({ open, onClose }) {
  const { employees, setEmployees } = useEmployees();

  const [form, setForm] = useState({
    name: "",
    position: "",
    department: "",
    birthday: "",
    image: ""
  });

  if (!open) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCreate() {
    if (!form.name || !form.birthday) {
      alert("Name and birthday are required");
      return;
    }

    setEmployees([
      ...employees,
      {
        ...form,
        id: crypto.randomUUID()
      }
    ]);

    onClose();
    setForm({
      name: "",
      position: "",
      department: "",
      birthday: "",
      image: ""
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md
                      rounded-2xl bg-[#0B0F14]
                      border border-white/10 p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Add Employee
        </h2>

        <div className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name *"
            className="w-full p-2 rounded bg-white/10"
          />

          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Position"
            className="w-full p-2 rounded bg-white/10"
          />

          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
            className="w-full p-2 rounded bg-white/10"
          />

          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white/10"
          />

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            className="w-full p-2 rounded bg-white/10"
          />

          <button
            onClick={handleCreate}
            className="w-full mt-3 px-4 py-2 rounded-xl
                       bg-green-500/20 text-green-400
                       hover:bg-green-500/30"
          >
            Create Employee
          </button>
        </div>
      </div>
    </div>
  );
}
