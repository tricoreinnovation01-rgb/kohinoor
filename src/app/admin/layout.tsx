export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-mt-24 min-h-screen bg-[var(--background)] pt-0">
      {children}
    </div>
  );
}
