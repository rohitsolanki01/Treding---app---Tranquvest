"use client";
import { motion, useAnimation } from "motion/react";

const pathVariant = {
  normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    pathOffset: [1, 0],
  },
};

const circleVariant = {
  normal: {
    pathLength: 1,
    pathOffset: 0,
    scale: 1,
  },
  animate: {
    pathLength: [0, 1],
    pathOffset: [1, 0],
    scale: [0.5, 1],
  },
};

const UserIcon = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "url(#userGradient)",
  ...props
}) => {
  const controls = useAnimation();
  return (
    <div
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <defs>
          <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="12"
          cy="8"
          r="5"
          animate={controls}
          variants={circleVariant}
        />
        <motion.path
          d="M20 21a8 8 0 0 0-16 0"
          variants={pathVariant}
          transition={{
            delay: 0.2,
            duration: 0.4,
          }}
          animate={controls}
        />
      </svg>
    </div>
  );
};

export { UserIcon };
