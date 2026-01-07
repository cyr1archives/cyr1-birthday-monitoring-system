import { useEffect, useState } from "react";
import { useEmployees } from "../context/EmployeesContext.jsx";
import MiniCalendar from "../components/MiniCalendar.jsx";
import UpcomingCards from "../components/UpcomingCards.jsx";

function WeatherIcon({ condition }) {
  const base = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch (condition) {
    case "Cloudy":
      return (
        <svg {...base}>
          <path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.7 1.5A4 4 0 0 0 6 19z" />
        </svg>
      );

    case "Rainy":
      return (
        <svg {...base}>
          <path d="M17.5 18a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.7 1.5A4 4 0 0 0 6 18z" />
          <line x1="8" y1="20" x2="8" y2="22" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="16" y1="20" x2="16" y2="22" />
        </svg>
      );

    case "Night":
      return (
        <svg {...base}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      );

    default: // Sunny
      return (
        <svg {...base}>
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
  }
}

function isBirthdayToday(dateStr) {
  const d = new Date(dateStr);
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth();
}

export default function Dashboard() {
  const { employees } = useEmployees();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const celebrant = employees.find(e =>
    isBirthdayToday(e.birthday)
  );

  return (
    <div className="space-y-12">
      {/* WEATHER + TIME */}
      <div className="flex items-start gap-6">
  {/* WEATHER */}
<div className="flex flex-col items-center text-white/60 leading-tight">
  <WeatherIcon condition="Sunny" />

  <span className="text-xs uppercase tracking-wide mt-1">
    Sunny
  </span>

  <span className="text-sm font-medium text-white">
    28°C
  </span>
</div>


        {/* TIME + DATE */}
        <div>
          <h1 className="text-6xl font-semibold tracking-tight">
            {now.toLocaleTimeString()}
          </h1>
          <p className="text-white/60 text-lg">
            {now.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </p>
        </div>
      </div>

      {/* HERO + MINI CALENDAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* HERO CARD */}
        <div className="p-10 rounded-3xl bg-card border border-card glow-card hero-animate">
          {celebrant ? (
            <div className="flex items-center gap-8">
              <img
                src={celebrant.image || "/src/assets/avatar-placeholder.png"}
                alt={celebrant.name}
                className="w-36 h-36 rounded-full object-cover border border-white/20"
              />

              <div>
                <h2 className="text-4xl font-semibold">
                  {celebrant.name}
                </h2>
                <p className="text-white/60 text-lg">
                  {celebrant.position} · {celebrant.department}
                </p>

                <span className="inline-block mt-5 px-5 py-2 rounded-full bg-[var(--accent)] text-green-400">
                  Birthday Today 🎉
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xl text-white/60">
              No birthdays today 🎂
            </p>
          )}
        </div>

        {/* MINI CALENDAR */}
        <MiniCalendar />
      </div>

      {/* UPCOMING + RECENT */}
      <UpcomingCards employees={employees} />
    </div>
  );
}
