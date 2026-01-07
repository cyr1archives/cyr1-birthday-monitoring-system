import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEmployees } from "../context/EmployeesContext.jsx";
import EmployeeModal from "../components/EmployeeModal.jsx";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  format
} from "date-fns";

/* ---------------- PAGE ---------------- */

export default function Calendar() {
  const { employees } = useEmployees();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  /* BUILD CALENDAR GRID */
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));

    const rows = [];
    let day = start;

    while (day <= end) {
      rows.push(day);
      day = addDays(day, 1);
    }

    return rows;
  }, [currentMonth]);

  /* EMPLOYEES BY DAY */
  function employeesOnDay(date) {
    return employees.filter(e => {
      const bday = new Date(e.birthday);
      return (
        bday.getDate() === date.getDate() &&
        bday.getMonth() === date.getMonth()
      );
    });
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* WEEKDAYS */}
      <div className="grid grid-cols-7 text-xs text-white/60">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="text-center py-2">
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const todaysEmployees = employeesOnDay(day);

          return (
            <div
              key={idx}
              className={`min-h-[90px] rounded-xl p-2 border
                ${
                  isSameMonth(day, currentMonth)
                    ? "bg-white/5 border-white/10"
                    : "bg-black/20 border-white/5 opacity-50"
                }
                ${
                  isSameDay(day, new Date())
                    ? "ring-1 ring-emerald-400"
                    : ""
                }
              `}
            >
              {/* DATE */}
              <div className="text-xs text-white/60">
                {format(day, "d")}
              </div>

              {/* BIRTHDAYS */}
              <div className="mt-1 space-y-1">
                {todaysEmployees.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="flex items-center gap-1 cursor-pointer
                               rounded-md px-1 py-0.5
                               bg-emerald-600/20
                               hover:bg-emerald-600/30"
                  >
                    <img
                      src={emp.image}
                      alt={emp.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs truncate">
                      {emp.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPLOYEE MODAL */}
      {selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}
