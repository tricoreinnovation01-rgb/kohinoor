import Link from "next/link";

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function ShopSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  return (
    <div className="container-narrow py-24 text-center">
      <p className="text-xs font-medium tracking-[0.25em] uppercase text-[var(--muted)]">
        Thank you
      </p>
      <h1 className="mt-4 text-4xl font-light">Payment received</h1>
      <p className="mx-auto mt-6 max-w-md text-sm text-[var(--muted)]">
        Your order is confirmed. You will receive a receipt by email.
        {session_id && (
          <span className="mt-2 block font-mono text-xs opacity-70">
            Session: {session_id.slice(0, 24)}…
          </span>
        )}
      </p>
      <Link
        href="/shop"
        className="mt-10 inline-block rounded-full border border-[var(--border)] px-6 py-3 text-sm"
      >
        Back to shop
      </Link>
    </div>
  );
}
