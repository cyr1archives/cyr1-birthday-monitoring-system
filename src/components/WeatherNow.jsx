import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning
} from "lucide-react";

/* ---------------- UTIL ---------------- */

function iconFor(code) {
  if (code === 0) return Sun;
  if (code <= 3) return Cloud;
  if (code <= 61) return CloudRain;
  if (code <= 77) return CloudSnow;
  return CloudLightning;
}

async function fetchWeather(setData) {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    )
      .then(r => r.json())
      .then(json => setData(json.current_weather))
      .catch(() => {});
  });
}

/* ---------------- COMPONENT ---------------- */

export default function WeatherNow() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // initial fetch
    fetchWeather(setData);

    // refresh every 10 minutes
    const interval = setInterval(() => {
      fetchWeather(setData);
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  const Icon = iconFor(data.weathercode);

  return (
    <div className="flex items-center gap-3">
      {/* ICON */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="text-white/80"
      >
        <Icon size={28} />
      </motion.div>

      {/* TEMP */}
      <div className="leading-tight">
        <div className="text-xl font-semibold">
          {Math.round(data.temperature)}°C
        </div>
        <div className="text-xs text-white/50">
          Weather
        </div>
      </div>
    </div>
  );
}
