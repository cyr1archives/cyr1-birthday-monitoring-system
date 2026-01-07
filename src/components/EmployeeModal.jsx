import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEmployees } from "../context/EmployeesContext.jsx";
import { format } from "date-fns";

export default function EmployeeModal({ employee, onClose }) {
  const { updateEmployee } = useEmployees();

  if (!employee) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center
                   bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* MODAL */}
        <motion.div
          key="modal"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{
            duration: 0.25,
            ease: "easeOut"
          }}
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
                       text-white/60 hover:text-white
                       transition"
          >
            <X size={20} />
          </button>

          {/* CONTENT */}
          <div className="flex flex-col items-center text-center gap-4">
            {/* IMAGE */}
            <img
              src={employee.image}
              alt={employee.name}
              className="w-28 h-28 rounded-2xl object-cover"
            />

            {/* NAME */}
            <h2 className="text-xl font-semibold">
              {employee.name}
            </h2>

            {/* META */}
            <p className="text-white/60 text-sm">
              {employee.position} · {employee.department}
            </p>

            {/* BIRTHDAY */}
            <div className="mt-2 text-sm text-white/70">
              🎂 {format(new Date(employee.birthday), "MMMM dd")}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
