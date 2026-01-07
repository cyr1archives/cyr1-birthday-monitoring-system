import { useState } from "react";
import EmployeeModal from "./EmployeeModal.jsx";

function daysBetween(a, b) {
  const MS = 1000 * 60 * 60 * 24;
  return Math.round((b - a) / MS);
}

export default function UpcomingCards({ employees }) {
  const [selected, setSelected] = useState(null);
  const today = new Date();

  const upcoming = employees
    .map(e => {
      const d = new Date(e.birthday);
      const next = new Date(today.getFullYear(), d.getMonth(), d.getDate());
      if (next < today) next.setFullYear(today.getFullYear() + 1);
      return { ...e, target: next, days: daysBetween(today, next) };
    })
    .sort((a, b) => a.target - b.target)
    .slice(0, 3);

  const recent = employees
    .map(e => {
      const d = new Date(e.birthday);
      const last = new Date(today.getFullYear(), d.getMonth(), d.getDate());
      if (last > today) last.setFullYear(today.getFullYear() - 1);
      return { ...e, target: last, days: Math.abs(daysBetween(last, today)) };
    })
    .sort((a, b) => b.target - a.target)
    .slice(0, 3);

  return (
    <>
      <div className="space-y-10">
        {/* UPCOMING */}
        <Section title="Upcoming Birthdays" tone="green">
          {upcoming.map(e => (
            <Card
              key={e.id}
              employee={e}
              onClick={() => setSelected(e)}
            >
              in {e.days} day{e.days !== 1 && "s"}
            </Card>
          ))}
        </Section>

        {/* RECENT */}
        <Section title="Recent Birthdays" tone="muted">
          {recent.map(e => (
            <Card
              key={e.id}
              employee={e}
              onClick={() => setSelected(e)}
            >
              {e.days} day{e.days !== 1 && "s"} ago
            </Card>
          ))}
        </Section>
      </div>

      {/* MODAL */}
      <EmployeeModal
        employee={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

/* ---------------------------------- */

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-white/70">
        {title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  );
}

function Card({ employee, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left p-6 rounded-2xl bg-card border border-card
                 glow-card focus:outline-none"
    >
      <div className="flex items-center gap-4">
        <img
          src={employee.image || "/src/assets/avatar-placeholder.png"}
          className="w-12 h-12 rounded-full object-cover border border-white/20"
        />

        <div>
          <p className="font-medium">{employee.name}</p>
          <p className="text-white/60 text-sm">
            {employee.target.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric"
            })}
          </p>
          <p className="text-xs text-white/50 mt-1">
            {children}
          </p>
        </div>
      </div>
    </button>
  );
}
