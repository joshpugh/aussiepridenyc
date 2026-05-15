import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="font-display text-pink-dark">
            Aussie Pride NYC · Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/registrations" className="text-foreground/70 hover:text-pink-dark">
              Registrations
            </Link>
            <Link href="/" className="text-foreground/70 hover:text-pink-dark">
              View site →
            </Link>
          </nav>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}
