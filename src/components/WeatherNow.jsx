import { useEffect, useState } from "react";

export default function WeatherNow() {
  const [w, setW] = useState(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async p => {
      const r = await fetch(`https://wttr.in/${p.coords.latitude},${p.coords.longitude}?format=j1`);
      const d = await r.json();
      const c = d.current_condition[0];
      setW({ temp: c.temp_C, icon: c.weatherIconUrl[0].value });
    });
  }, []);

  if (!w) return null;
  return (
    <div className="flex items-center gap-2">
      <img src={w.icon} className="w-8 h-8" />
      <span>{w.temp}°C</span>
    </div>
  );
}
