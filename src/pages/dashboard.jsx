import { useState, useMemo } from "react";
import { useEmployees } from "../context/EmployeesContext.jsx";
import MiniCalendar from "../components/MiniCalendar.jsx";
import EmployeeModal from "../components/EmployeeModal.jsx";
import { format } from "date-fns";

/* ---------------- UTIL ---------------- */

function isBirthdayToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth()
  );
}

function sortByUpcoming(employees) {
  const today = new Date();

  return [...employees].sort((a, b) => {
    const da = new Date(a.birthday);
    const db = new Date(b.birthday);

    da.setFullYear(today.getFullYear());
    db.setFullYear(today.getFullYear());

    if (da < today) da.setFullYear(today.getFullYear() + 1);
    if (db < today) db.setFullYear(today.getFullYear() + 1);

    return da - db;
  });
}

/* ---------------- PAGE ---------------- */

export default function Dashboard() {
  const { employees } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const todayBirthday = employees.find(e =>
    isBirthdayToday(e.birthday)
  );

  const upcoming = useMemo(
    () => sortByUpcoming(employees).slice(0, 3),
    [employees]
  );

  const recent = useMemo(() => {
    const today = new Date();
    return [...employees]
      .filter(e => {
        const d = new Date(e.birthday);
        d.setFullYear(today.getFullYear());
        return d < today;
      })
      .sort((a, b) => new Date(b.birthday) - new Date(a.birthday))
      .slice(0, 3);
  }, [employees]);

  return (
    <div className="space-y-8">
      {/* TOP GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HERO CARD */}
        <div
          onClick={() =>
            todayBirthday && setSelectedEmployee(todayBirthday)
          }
          className={`rounded-3xl p-6 bg-card border border-card
                      glow-card transition cursor-pointer
                      ${!todayBirthday && "opacity-70 cursor-default"}`}
        >
          {todayBirthday ? (
            <div className="flex gap-6 items-center">
              <img
                src={todayBirthday.image}
                className="w-32 h-32 rounded-2xl object-cover"
              />

              <div>
                <h2 className="text-2xl font-semibold">
                  🎉 Birthday Today
                </h2>
                <p className="mt-2 text-lg">
                  {todayBirthday.name}
                </p>
                <p className="text-white/60">
                  {todayBirthday.position} ·{" "}
                  {todayBirthday.department}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-white/50">
              No birthdays today
            </div>
          )}
        </div>

        {/* MINI CALENDAR */}
        <MiniCalendar />
      </div>

      {/* UPCOMING */}
      <section>
        <h3 className="mb-4 text-lg font-medium">
          Upcoming Birthdays
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {upcoming.map(e => (
            <div
              key={e.id}
              onClick={() => setSelectedEmployee(e)}
              className="rounded-2xl p-4 bg-card border border-card
                         glow-card cursor-pointer"
            >
              <img
                src={e.image}
                className="w-14 h-14 rounded-full object-cover mb-2"
              />
              <p className="font-medium">{e.name}</p>
              <p className="text-sm text-white/60">
                {format(new Date(e.birthday), "MMM dd")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT */}
      <section>
        <h3 className="mb-4 text-lg font-medium">
          Recent Birthdays
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recent.map(e => (
            <div
              key={e.id}
              onClick={() => setSelectedEmployee(e)}
              className="rounded-2xl p-4 bg-card border border-card
                         glow-card cursor-pointer opacity-80"
            >
              <img
                src={e.image}
                className="w-14 h-14 rounded-full object-cover mb-2"
              />
              <p className="font-medium">{e.name}</p>
              <p className="text-sm text-white/60">
                {format(new Date(e.birthday), "MMM dd")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* EMPLOYEE MODAL (CRITICAL) */}
      {selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}
