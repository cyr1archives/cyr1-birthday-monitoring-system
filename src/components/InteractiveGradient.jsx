import { motion } from "framer-motion";

export default function InteractiveGradient() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* BASE DARK BACKGROUND */}
      <div className="absolute inset-0 bg-[#0A0D12]" />

      {/* DEEP GREEN / BLUE FLOW */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-[160%] h-[160%]"
        animate={{
          backgroundPosition: [
            "0% 50%",
            "100% 50%",
            "0% 50%"
          ]
        }}
        transition={{
          duration: 50,
          ease: "linear",
          repeat: Infinity
        }}
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 25% 30%,
              rgba(34,197,94,0.12),
              transparent 55%
            ),
            radial-gradient(
              circle at 75% 65%,
              rgba(37,99,235,0.10),
              transparent 60%
            )
          `,
          backgroundSize: "220% 220%"
        }}
      />

      {/* SUBTLE PURPLE SHADOW FLOW */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-[160%] h-[160%]"
        animate={{
          backgroundPosition: [
            "100% 0%",
            "0% 100%",
            "100% 0%"
          ]
        }}
        transition={{
          duration: 80,
          ease: "linear",
          repeat: Infinity
        }}
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 50% 50%,
              rgba(88,28,135,0.10),
              transparent 65%
            )
          `,
          backgroundSize: "240% 240%"
        }}
      />

      {/* DARK VIGNETTE (DEPTH) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.55) 100%)"
        }}
      />
    </div>
  );
}
