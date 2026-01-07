import { useState, useMemo } from "react";
import { format } from "date-fns";
import { useEmployees } from "../context/EmployeesContext.jsx";
import MiniCalendar from "../components/MiniCalendar.jsx";
import EmployeeModal from "../components/EmployeeModal.jsx";

/* ---------------- UTIL ---------------- */

function isBirthdayToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth()
  );
}

function getUpcoming(employees) {
  const today = new Date();

  return [...employees]
    .map(e => {
      const d = new Date(e.birthday);
      d.setFullYear(today.getFullYear());
      if (d < today) d.setFullYear(today.getFullYear() + 1);
      return { ...e, _date: d };
    })
    .sort((a, b) => a._date - b._date)
    .slice(0, 3);
}

function getRecent(employees) {
  const today = new Date();

  return [...employees]
    .map(e => {
      const d = new Date(e.birthday);
      d.setFullYear(today.getFullYear());
      return { ...e, _date: d };
    })
    .filter(e => e._date < today)
    .sort((a, b) => b._date - a._date)
    .slice(0, 3);
}
function daysAgoLabel(date) {
  const today = new Date();
  const d = new Date(date);

  d.setFullYear(today.getFullYear());

  const diffMs = today - d;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

/* ---------------- PAGE ---------------- */

export default function Dashboard() {
  const { employees } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const todayBirthday = employees.find(e =>
    isBirthdayToday(e.birthday)
  );

  const upcoming = useMemo(
    () => getUpcoming(employees),
    [employees]
  );

  const recent = useMemo(
    () => getRecent(employees),
    [employees]
  );

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
                      glow-card transition
                      ${todayBirthday ? "cursor-pointer" : "opacity-70"}`}
        >
          {todayBirthday ? (
            <div className="flex gap-6 items-center">
              <img
                src={todayBirthday.image}
                alt={todayBirthday.name}
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
      {upcoming.length > 0 && (
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
                  alt={e.name}
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
      )}

      {/* RECENT */}
      {recent.length > 0 && (
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
                  alt={e.name}
                  className="w-14 h-14 rounded-full object-cover mb-2"
                />
                <p className="font-medium">{e.name}</p>
                <p className="text-sm text-white/60">
  {format(new Date(e.birthday), "MMM dd")} · {daysAgoLabel(e.birthday)}
</p>
              </div>
            ))}
          </div>
        </section>
      )}

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
