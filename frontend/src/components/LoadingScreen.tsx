"use client";

import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out after 1.8s
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    // Remove from DOM after fade completes (0.7s fade)
    const hideTimer = setTimeout(() => setVisible(false), 2500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`${styles.overlay} ${fadeOut ? styles.fadeOut : ""}`}>
      {/* Animated background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      <div className={styles.content}>
        {/* Logo mark — animated leaf/bolt */}
        <div className={styles.logoMark}>
          <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.logoSvg}
          >
            {/* Outer ring */}
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#c9ff3b"
              strokeWidth="2"
              strokeDasharray="226"
              strokeDashoffset="226"
              className={styles.ringDraw}
            />
            {/* T-shirt icon */}
            <path
              d="M28 22 L20 30 L27 33 L27 58 L53 58 L53 33 L60 30 L52 22 C52 22 48 28 40 28 C32 28 28 22 28 22Z"
              fill="#c9ff3b"
              strokeLinejoin="round"
              className={styles.boltPop}
            />
          </svg>
        </div>

        {/* Brand name */}
        <div className={styles.brandName}>
          <span className={styles.terra}>TERRA</span>
          <span className={styles.spacer}> </span>
          <span className={styles.fit}>FIT</span>
        </div>

        {/* Tagline */}
        <p className={styles.tagline}>ELEVATE YOUR PERFORMANCE</p>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} />
        </div>
      </div>
    </div>
  );
}
