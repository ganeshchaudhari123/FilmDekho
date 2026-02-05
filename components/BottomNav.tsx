'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: 'HOME', href: '/home' },
        { label: 'VIP', href: '/vip' },
        { label: 'LIST', href: '/my-list' },
        { label: 'ME', href: '/profile' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                >
                    <div style={{ width: '20px', height: '20px', backgroundColor: pathname === item.href ? '#FFD700' : '#333', borderRadius: '4px' }}></div>
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}
