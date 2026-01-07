import { motion } from "framer-motion";

const pieces = Array.from({ length: 30 });

export default function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const size = Math.random() * 6 + 6;

        return (
          <motion.div
            key={i}
            initial={{
              y: -20,
              opacity: 0,
              rotate: 0
            }}
            animate={{
              y: "110vh",
              opacity: 1,
              rotate: 360
            }}
            transition={{
              duration: 2.5 + Math.random(),
              delay,
              ease: "easeOut"
            }}
            style={{
              position: "absolute",
              left: `${left}%`,
              width: size,
              height: size,
              backgroundColor: ["#22c55e", "#4ade80", "#86efac"][
                i % 3
              ],
              borderRadius: "2px"
            }}
          />
        );
      })}
    </div>
  );
}
