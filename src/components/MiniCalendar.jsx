import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameDay,
  isSameMonth
} from "date-fns";

export default function MiniCalendar() {
  const today = new Date();
  const start = startOfWeek(startOfMonth(today));
  const end = endOfWeek(endOfMonth(today));

  const days = [];
  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return (
    <div className="rounded-3xl p-5 bg-card border border-card">
      <h3 className="mb-3">{format(today, "MMMM yyyy")}</h3>

      <div className="grid grid-cols-7 text-xs text-white/50 mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=>(
          <div key={`wd-${i}`} className="text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day,i)=>(
          <div
            key={`day-${format(day,"yyyy-MM-dd")}-${i}`}
            className={`h-8 flex items-center justify-center rounded-lg
              ${!isSameMonth(day,today) ? "text-white/30":""}
              ${isSameDay(day,today) ? "bg-white/20 font-bold":"hover:bg-white/10"}
            `}
          >
            {format(day,"d")}
          </div>
        ))}
      </div>
    </div>
  );
}
