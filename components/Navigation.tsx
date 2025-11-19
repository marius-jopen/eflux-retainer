'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="nav-links">
      <Link
        href="/admin"
        className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}
      >
        Admin View
      </Link>
      <Link
        href="/client"
        className={`nav-link ${pathname === '/client' ? 'active' : ''}`}
      >
        Client View
      </Link>
    </nav>
  );
}

