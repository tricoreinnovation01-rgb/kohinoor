const ROWS = [
  {
    label: "Email",
    value: "deeyastha2@gmail.com",
    href: "mailto:deeyastha2@gmail.com",
  },
  {
    label: "Phone",
    value: "9840109920",
    href: "tel:9840109920",
  },
  {
    label: "Studio",
    value: "Madhyapur Thimi, Nepal",
    href: null as string | null,
  },
  {
    label: "Instagram",
    value: "@kohinoor",
    href: "https://instagram.com",
  },
  {
    label: "Commissions",
    value: "Portrait & study waitlist — winter 2026",
    href: null as string | null,
  },
] as const;

function RowIcon({ type }: { type: string }) {
  if (type === "email") {
    return (
      <path
        d="M4 6h16v12H4V6zm0 0 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    );
  }
  if (type === "phone") {
    return (
      <path
        d="M6.5 3h2l1.5 5-2 1a12 12 0 0 0 5.5 5.5l1-2 5 1.5v2a2 2 0 0 1-2.2 2c-8.5 0-15.3-6.8-15.3-15.3a2 2 0 0 1 2-2.2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    );
  }
  if (type === "map") {
    return (
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    );
  }
  if (type === "ig") {
    return (
      <path
        d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-1.5h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    );
  }
  if (type === "brush") {
    return (
      <path
        d="M4 19V5m0 14h16M8 7v10m4-7v7m4-4v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    );
  }
  return (
    <path
      d="M4 19V5m0 14h16M8 7v10m4-7v7m4-4v4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
    />
  );
}

const ICONS = ["email", "phone", "map", "ig", "brush"] as const;

export function ContactInfo() {
  return (
    <div className="space-y-2">
      {ROWS.map((row, i) => (
        <div
          key={row.label}
          className="flex gap-4 border-b border-[var(--border)] py-6 last:border-b-0"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--border)] text-[var(--gold-deep)]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <RowIcon type={ICONS[i]} />
            </svg>
          </div>
          <div>
            <p className="label-caps text-[var(--muted)]">{row.label}</p>
            {row.href ? (
              <a
                href={row.href}
                className="mt-1 block text-sm font-light text-[var(--secondary)] transition hover:text-[var(--gold-deep)]"
              >
                {row.value}
              </a>
            ) : (
              <p className="mt-1 text-sm font-light text-[var(--secondary)]">
                {row.value}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
