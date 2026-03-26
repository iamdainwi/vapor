"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  expiresAt: number;
  variant?: "bar" | "text";
}

export function CountdownTimer({ expiresAt, variant = "bar" }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => calcRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(calcRemaining(expiresAt));
    }, 60000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const isExpired = remaining.totalMs <= 0;
  const percentage = remaining.percentage;

  // Color based on urgency
  const barColor =
    percentage > 50
      ? "bg-[#ba9eff]"
      : percentage > 20
        ? "bg-amber-500"
        : "bg-red-500";

  if (isExpired) {
    if (variant === "text") {
      return <span className="text-xs text-red-400 tracking-widest uppercase font-medium">Expired</span>;
    }
    return (
      <div className="w-full h-1 bg-[#262528] rounded-full overflow-hidden">
        <div className="h-full w-0 rounded-full" />
      </div>
    );
  }

  // Text variant — shows "4H REMAINING" like the design
  if (variant === "text") {
    const label = remaining.days > 0
      ? `${remaining.days}d remaining`
      : `${remaining.hours}h remaining`;
    return (
      <span className="text-xs text-[#48474a] tracking-widest uppercase font-medium">
        {label}
      </span>
    );
  }

  // Bar variant — the "decay bar" with neon glow
  return (
    <div className="w-full h-1 bg-[#262528] rounded-full overflow-hidden">
      <div
        className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-linear ${percentage > 20 ? "decay-bar-glow" : ""}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function calcRemaining(expiresAt: number) {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, totalMs: 0, percentage: 0 };

  const totalDuration = 7 * 24 * 60 * 60 * 1000;
  const percentage = Math.min(100, Math.max(0, (diff / totalDuration) * 100));

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, totalMs: diff, percentage };
}
