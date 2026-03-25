"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  expiresAt: number;
}

export function CountdownTimer({ expiresAt }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => calcRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(calcRemaining(expiresAt));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [expiresAt]);

  const isUrgent = remaining.totalMs < 24 * 60 * 60 * 1000; // < 24h
  const isExpired = remaining.totalMs <= 0;

  if (isExpired) {
    return (
      <span className="vapor-label text-[#ff2222] vapor-urgent-pulse">
        EXPIRED
      </span>
    );
  }

  return (
    <span
      className={`vapor-label ${
        isUrgent
          ? "text-[#ff2222] vapor-urgent-pulse"
          : "text-[#af8782]"
      }`}
    >
      {remaining.days}d {remaining.hours}h {remaining.minutes}m REMAINING
    </span>
  );
}

function calcRemaining(expiresAt: number) {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, totalMs: 0 };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, totalMs: diff };
}
