export default function MiniCalendar() {
  const today = new Date();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="p-8 rounded-3xl bg-card border border-card glow-card">
      <h3 className="text-lg font-semibold mb-4 text-white/70">
        {today.toLocaleString("default", {
          month: "long",
          year: "numeric"
        })}
      </h3>

      <div className="grid grid-cols-7 gap-2 text-center">
        {["S","M","T","W","T","F","S"].map(d => (
          <div key={d} className="text-xs text-white/40">{d}</div>
        ))}

        {days.map(d => (
          <div
            key={d}
            className={`h-10 flex items-center justify-center rounded-lg
              ${d === today.getDate()
                ? "bg-[var(--accent)] text-green-400"
                : "text-white/70"
              }`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
