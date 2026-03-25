export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-start justify-center py-24">
      <h2 className="vapor-display text-[#e5e2e1] mb-4">NOTHING HERE.</h2>
      <p className="vapor-headline text-[#af8782] mb-2">
        PASTE A URL ABOVE.
      </p>
      <p className="vapor-label text-[#ff2222] vapor-urgent-pulse">
        TIME IS WASTING.
      </p>
    </div>
  );
}
