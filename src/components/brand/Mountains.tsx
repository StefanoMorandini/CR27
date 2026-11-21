/** Profilo stilizzato delle montagne ticinesi, per gli sfondi. */
export function Mountains({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 320" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        className="drift-slow"
        fill="var(--blue-soft)"
        d="M0 320V170l90-60 70 40 110-95 90 70 60-30 120 105 80-55 100 70 95-120 120 95 70-35 110 80 90-70 120 75 85-40 100 60 90-45v190z"
      />
      <path
        className="drift"
        fill="#dfe8f4"
        opacity=".7"
        d="M0 320V230l120-50 90 45 130-80 100 70 140-95 110 85 90-40 140 75 120-60 110 55 130-85 110 70 90-30 100 50v95z"
      />
    </svg>
  );
}
