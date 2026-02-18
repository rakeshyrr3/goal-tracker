"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Wallet, BarChart3, Settings, LogOut, CheckSquare } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Goals", path: "/dashboard/goals", icon: Target },
        { name: "Expenses", path: "/dashboard/expenses", icon: Wallet },
        { name: "To-Do List", path: "/dashboard/todo", icon: CheckSquare },
        { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
    ];

    return (
        <aside className="sidebar">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Target size={24} color="white" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Goal Tracker</span>
                </div>
            </div>

            <nav style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                backgroundColor: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                fontSize: '0.9375rem',
                                fontWeight: isActive ? 600 : 500,
                                textDecoration: 'none',
                                transition: 'all 0.2s',
                                border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent'
                            }}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    width: '100%',
                    borderRadius: '10px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                }}>
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
