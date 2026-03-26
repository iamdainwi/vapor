export function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-xl bg-[#5e2c91]/20 flex items-center justify-center mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ba9eff" strokeWidth="1.5">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-[#f9f5f8] tracking-tight mb-2">
        The void awaits
      </h3>
      <p className="text-sm text-[#adaaad] max-w-sm leading-relaxed">
        Paste a URL above to begin. Your AI-summarized articles will appear here and self-destruct after 7 days.
      </p>
    </div>
  );
}
