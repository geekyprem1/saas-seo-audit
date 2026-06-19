export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className ?? "h-7 w-7"}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
      <path
        d="M9 22V10h4.2c2.7 0 4.5 1.4 4.5 3.7 0 1.5-.8 2.6-2.1 3.1l2.6 5.2h-2.7l-2.3-4.8h-1.6V22H9zm2.6-6.6h1.5c1.3 0 2.1-.6 2.1-1.7s-.8-1.7-2.1-1.7h-1.5v3.4z"
        fill="white"
      />
      <circle cx="23" cy="11" r="2.5" fill="white" opacity="0.85" />
    </svg>
  );
}