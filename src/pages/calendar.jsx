import { useState } from "react";
import { useEmployees } from "../context/EmployeesContext.jsx";
import EmployeeModal from "../components/EmployeeModal.jsx";

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const matrix = [];
  let week = Array(firstDay).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }

  return matrix;
}

export default function Calendar() {
  const { employees } = useEmployees();
  const today = new Date();

  const [current, setCurrent] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDay, setSelectedDay] = useState(null);
  const [dayEmployees, setDayEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const year = current.getFullYear();
  const month = current.getMonth();
  const matrix = getMonthMatrix(year, month);

  function nextMonth() {
    setCurrent(new Date(year, month + 1, 1));
  }

  function prevMonth() {
    setCurrent(new Date(year, month - 1, 1));
  }

  function birthdaysOn(day) {
    return employees.filter(e => {
      const d = new Date(e.birthday);
      return d.getDate() === day && d.getMonth() === month;
    });
  }

  function openDay(day) {
    const list = birthdaysOn(day);
    if (!list.length) return;
    setSelectedDay(day);
    setDayEmployees(list);
  }

  function closeDayModal() {
    setSelectedDay(null);
    setDayEmployees([]);
  }

  return (
    <>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {current.toLocaleString("default", {
              month: "long",
              year: "numeric"
            })}
          </h1>

          <div className="flex gap-2">
            <button onClick={prevMonth} className="px-4 py-2 rounded-xl glow-btn">
              ←
            </button>
            <button onClick={nextMonth} className="px-4 py-2 rounded-xl glow-btn">
              →
            </button>
          </div>
        </div>

        {/* WEEKDAYS */}
        <div className="grid grid-cols-7 text-center text-sm text-white/50">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7 gap-3">
          {matrix.flat().map((day, i) => {
            if (!day)
              return (
                <div key={i} className="h-28 rounded-xl bg-card/30" />
              );

            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            const birthdays = birthdaysOn(day);

            return (
              <button
                key={i}
                onClick={() => openDay(day)}
                className={`h-28 p-2 rounded-xl border border-card bg-card
                  text-left relative
                  ${isToday ? "ring-1 ring-green-400" : ""}
                  glow-card`}
              >
                <div className="text-sm font-medium mb-1">
                  {day}
                </div>

                <div className="flex flex-wrap gap-1">
                  {birthdays.map(e => (
                    <img
                      key={e.id}
                      src={e.image || "/src/assets/avatar-placeholder.png"}
                      title={e.name}
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DAY MODAL */}
      {selectedDay && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDayModal}
          />

          <div className="relative w-full max-w-sm mx-4
                          rounded-3xl bg-card border border-card
                          p-6 glow-card">
            <h3 className="text-xl font-semibold mb-4">
              {current.toLocaleString("default", { month: "long" })} {selectedDay}
            </h3>

            <div className="space-y-3">
              {dayEmployees.map(e => (
                <button
                  key={e.id}
                  onClick={() => setSelectedEmployee(e)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl
                             bg-white/5 hover:bg-white/10 text-left"
                >
                  <img
                    src={e.image || "/src/assets/avatar-placeholder.png"}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />

                  <div>
                    <p className="font-medium">{e.name}</p>
                    <p className="text-white/60 text-sm">
                      {e.position}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EMPLOYEE MODAL */}
      <EmployeeModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </>
  );
}
