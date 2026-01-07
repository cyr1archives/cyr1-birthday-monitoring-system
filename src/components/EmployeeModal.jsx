import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Save, Trash2, Shield } from "lucide-react";
import { format } from "date-fns";
import { useEmployees } from "../context/EmployeesContext.jsx";

/* ---------------- CONFIG ---------------- */

const ADMIN_PIN = "1234";

/* ---------------- UTIL ---------------- */

function readImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

/* ---------------- COMPONENT ---------------- */

export default function EmployeeModal({ employee, onClose }) {
  const { updateEmployee, setEmployees } = useEmployees();

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState(employee);

  const [isAdmin, setIsAdmin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  /* LOAD ADMIN STATE */
  useEffect(() => {
    setIsAdmin(localStorage.getItem("cyr1_isAdmin") === "true");
  }, []);

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const image = await readImage(file);
    updateField("image", image);
  }

  function handleSave() {
    updateEmployee(form);
    onClose();
  }

  function handleDelete() {
    setEmployees(prev =>
      prev.filter(e => e.id !== employee.id)
    );
    onClose();
  }

  function submitPin() {
    if (pinInput === ADMIN_PIN) {
      localStorage.setItem("cyr1_isAdmin", "true");
      setIsAdmin(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center
                   bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md
                     rounded-3xl p-6
                     bg-[#0f131a]
                     border border-white/10
                     shadow-2xl"
        >
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4
                       text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>

          {/* CONFIRM DELETE */}
          {confirmDelete ? (
            <div className="text-center space-y-4">
              <h2 className="text-lg font-semibold text-red-400">
                Delete Employee?
              </h2>

              <p className="text-white/60 text-sm">
                This action cannot be undone.
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 rounded-xl
                             bg-red-600 hover:bg-red-500"
                >
                  Delete
                </button>

                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 px-4 py-2 rounded-xl
                             bg-white/10 hover:bg-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : !editing ? (
            /* -------- VIEW MODE -------- */
            <div className="flex flex-col items-center text-center gap-4">
              <img
                src={employee.image}
                alt={employee.name}
                className="w-28 h-28 rounded-2xl object-cover"
              />

              <h2 className="text-xl font-semibold">
                {employee.name}
              </h2>

              <p className="text-white/60 text-sm">
                {employee.position} · {employee.department}
              </p>

              <div className="text-sm text-white/70">
                🎂 {format(new Date(employee.birthday), "MMMM dd")}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded-xl
                             bg-white/10 hover:bg-white/20
                             flex items-center gap-2"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                {isAdmin ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="px-4 py-2 rounded-xl
                               bg-red-600/20 text-red-400
                               hover:bg-red-600/30
                               flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                ) : (
                  <button
                    onClick={() => setPinInput("")}
                    className="px-4 py-2 rounded-xl
                               bg-white/5 text-white/60
                               flex items-center gap-2"
                  >
                    <Shield size={16} />
                    Admin Only
                  </button>
                )}
              </div>

              {/* PIN ENTRY */}
              {!isAdmin && (
                <div className="w-full pt-4 space-y-2">
                  <input
                    type="password"
                    value={pinInput}
                    onChange={e => setPinInput(e.target.value)}
                    placeholder="Enter Admin PIN"
                    className="w-full px-3 py-2 rounded-xl
                               bg-white/5 border border-white/10"
                  />
                  {pinError && (
                    <p className="text-xs text-red-400">
                      Invalid PIN
                    </p>
                  )}
                  <button
                    onClick={submitPin}
                    className="w-full px-4 py-2 rounded-xl
                               bg-emerald-600 hover:bg-emerald-500"
                  >
                    Unlock Admin
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* -------- EDIT MODE -------- */
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <img
                  src={form.image}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <label className="text-xs cursor-pointer text-white/60 hover:text-white">
                  Change Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <input
                className="w-full px-3 py-2 rounded-xl
                           bg-white/5 border border-white/10"
                value={form.name}
                onChange={e => updateField("name", e.target.value)}
                placeholder="Name"
              />

              <input
                className="w-full px-3 py-2 rounded-xl
                           bg-white/5 border border-white/10"
                value={form.position}
                onChange={e =>
                  updateField("position", e.target.value)
                }
                placeholder="Position"
              />

              <input
                className="w-full px-3 py-2 rounded-xl
                           bg-white/5 border border-white/10"
                value={form.department}
                onChange={e =>
                  updateField("department", e.target.value)
                }
                placeholder="Department"
              />

              <input
                type="date"
                className="w-full px-3 py-2 rounded-xl
                           bg-white/5 border border-white/10"
                value={form.birthday}
                onChange={e =>
                  updateField("birthday", e.target.value)
                }
              />

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 rounded-xl
                             bg-emerald-600 hover:bg-emerald-500
                             flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 px-4 py-2 rounded-xl
                             bg-white/10 hover:bg-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
