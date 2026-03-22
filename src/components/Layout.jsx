import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Radio, Menu, X } from 'lucide-react';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const nav = [
    { to: '/', label: 'Главная' },
    { to: '/marketplace', label: 'Маркетплейс' },
    { to: '/dashboard', label: 'Кабинет' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <header className="sticky top-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-500 to-[var(--color-accent)] flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Radio<span className="text-[var(--color-accent)]">Tube</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map(n => (
              <Link key={n.to} to={n.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === n.to ? 'text-white bg-white/10' : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5'
                }`}
              >{n.label}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/marketplace"
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-cyan-600 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-opacity ${
                location.pathname === '/marketplace' ? 'invisible' : ''
              }`}
            >
              + Предложить коллаб
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-white/5 bg-[var(--color-bg)]/95 backdrop-blur-xl px-4 py-3 space-y-1">
            {nav.map(n => (
              <Link key={n.to} to={n.to} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  location.pathname === n.to ? 'text-white bg-white/10' : 'text-[var(--color-text-secondary)] hover:text-white'
                }`}
              >{n.label}</Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[var(--color-text-secondary)] text-sm">
            RadioTube — <span className="text-[var(--color-accent)] font-medium">маркетплейс коллабораций</span>.
            Предлагай · Голосуй · Поддерживай · Делись
          </p>
          <p className="text-white/20 text-xs mt-2">© 2026</p>
        </div>
      </footer>
    </div>
  );
}
