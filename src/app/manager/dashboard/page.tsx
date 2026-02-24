"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    DollarSign,
    TrendingUp,
    ShieldCheck,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Activity,
    CreditCard,
    LogOut,
    Menu,
    X,
    Bell,
    Settings,
    Trash2,
    Lock,
    Unlock,
    Send,
    RefreshCw
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts";

const SALES_DATA = [
    { name: 'Mon', sales: 4500 },
    { name: 'Tue', sales: 5900 },
    { name: 'Wed', sales: 12000 },
    { name: 'Thu', sales: 8100 },
    { name: 'Fri', sales: 15600 },
    { name: 'Sat', sales: 9500 },
    { name: 'Sun', sales: 7400 },
];

export default function ManagerDashboard() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState("Overview");
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [notificationsSent, setNotificationsSent] = useState(0);
    const [realUsers, setRealUsers] = useState<any[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('manager_token');
        if (!token) {
            router.push('/manager/login');
        } else {
            setIsAuthorized(true);
        }
    }, []);

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) setRealUsers(data.users);
        } catch (err) {
            console.error("Failed to load users:", err);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'Users') fetchUsers();
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.removeItem('manager_token');
        router.push('/manager/login');
    };

    const handleSendNotification = async () => {
        const title = (document.getElementById('notif-title') as HTMLInputElement)?.value;
        const message = (document.getElementById('notif-msg') as HTMLTextAreaElement)?.value;

        if (!title || !message) return alert("Please enter both title and message");

        try {
            const res = await fetch('/api/admin/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, message })
            });
            const data = await res.json();

            if (data.success) {
                alert(`Broadcast Success: ${data.message}`);
                setNotificationsSent(prev => prev + 1);
            } else {
                alert(`Broadcast Failed: ${data.error}`);
            }
        } catch (err) {
            console.error("Failed to send broadcast:", err);
            alert("Something went wrong while sending notification.");
        }
    };

    const handleAddUser = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            plan: formData.get('plan')
        };

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (data.success) {
                alert("User account created and synced with database!");
                setIsAddUserModalOpen(false);
                fetchUsers();
            }
        } catch (err) {
            alert("Error creating user");
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user forever?")) return;
        try {
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            alert("Delete failed");
        }
    };

    if (!isAuthorized) return null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0c0c0e', color: 'white' }}>
            {/* Header */}
            <header style={{
                height: '80px',
                backgroundColor: '#121217',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 40px',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={24} color="white" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Master Console</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <button style={{ color: 'var(--text-muted)' }}><Bell size={20} /></button>
                    <button onClick={fetchUsers} style={{ color: 'var(--text-muted)' }}><RefreshCw size={20} /></button>
                    <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }} />
                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', fontWeight: 600, fontSize: '0.875rem' }}
                    >
                        <LogOut size={18} /> Exit
                    </button>
                </div>
            </header>

            <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Global Management</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Data sync: Connected to SQLite database.</p>
                    </div>
                    <div style={{
                        display: 'flex',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '4px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                    }}>
                        {['Overview', 'Users', 'Broadcasting'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    backgroundColor: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
                                    color: activeTab === tab ? 'white' : 'var(--text-muted)',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'Overview' && (
                    <>
                        <div className="stats-grid" style={{ marginBottom: '40px' }}>
                            <AdminStatCard title="Revenue" value="₹8,45,200" icon={<DollarSign color="var(--success)" />} trend="+12%" trendUp={true} />
                            <AdminStatCard title="Managed Users" value={realUsers.length > 0 ? realUsers.length.toString() : "1,248"} icon={<Users color="var(--accent-primary)" />} trend="Total DB Records" trendUp={true} />
                            <AdminStatCard title="Global Health" value="98%" icon={<Activity color="var(--accent-secondary)" />} trend="Stable" trendUp={true} />
                            <AdminStatCard title="Blasts Sent" value={notificationsSent.toString()} icon={<Send color="var(--warning)" />} trend="Push Queue" trendUp={true} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                            <div className="card" style={{ padding: '32px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>System Audit Logs</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <LogItem event="Database Sync" user="Rakesh" status="Success" time="Just Now" />
                                    <LogItem event="New Signup" user="Aman" status="Success" time="2m ago" />
                                    <LogItem event="Revenue Update" user="System" status="Success" time="5m ago" />
                                </div>
                            </div>
                            <div className="card" style={{ padding: '32px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Audience Distribution</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <ProgressItem label="Pro Members" current={850} total={1200} color="var(--accent-primary)" />
                                    <ProgressItem label="Trial Users" current={200} total={1200} color="var(--accent-secondary)" />
                                    <ProgressItem label="Free Users" current={150} total={1200} color="var(--text-muted)" />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'Users' && (
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Database Records</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Found {realUsers.length} user(s) in the system.</p>
                            </div>
                            <button onClick={() => setIsAddUserModalOpen(true)} className="btn-primary" style={{ padding: '12px 24px' }}>
                                <Users size={18} /> Provision User
                            </button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ padding: '20px 32px', color: 'var(--text-muted)' }}>User Details</th>
                                        <th style={{ padding: '20px 32px', color: 'var(--text-muted)' }}>Plan</th>
                                        <th style={{ padding: '20px 32px', color: 'var(--text-muted)' }}>Created At</th>
                                        <th style={{ padding: '20px 32px', color: 'var(--text-muted)' }}>Control</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {realUsers.length > 0 ? realUsers.map((u) => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '20px 32px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: 700 }}>{u.name}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 32px' }}>
                                                <span style={{
                                                    fontSize: '0.625rem', fontWeight: 800, padding: '4px 10px', borderRadius: '100px',
                                                    backgroundColor: u.plan === 'PRO' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.05)',
                                                    color: u.plan === 'PRO' ? 'var(--accent-primary)' : 'var(--text-muted)'
                                                }}>{u.plan}</span>
                                            </td>
                                            <td style={{ padding: '20px 32px', fontSize: '0.875rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '20px 32px' }}>
                                                <button onClick={() => handleDeleteUser(u.id)} style={{ color: 'var(--error)' }}><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No records found. Click "Provision User" to add one.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'Broadcasting' && (
                    <div className="card" style={{ padding: '60px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent-primary)' }}>
                            <Bell size={40} />
                        </div>
                        <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Push Broadcast</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Reach all active app installations instantly.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Title</label>
                                <input id="notif-title" placeholder="Campaign Title" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Message Content</label>
                                <textarea id="notif-msg" style={{ height: '100px', padding: '16px', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'white' }} />
                            </div>
                            <button onClick={handleSendNotification} className="btn-primary" style={{ padding: '18px', justifyContent: 'center', fontSize: '1.1rem' }}>
                                <Send size={20} /> Launch Campaign
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {isAddUserModalOpen && (
                <div className="modal-overlay" onClick={() => setIsAddUserModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>New User Provision</h3>
                        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <input name="name" placeholder="Full Name" required />
                            <input name="email" placeholder="Email Address" type="email" required />
                            <select name="plan" style={{ padding: '12px', backgroundColor: '#18181f', color: 'white', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                                <option value="FREE">FREE</option>
                                <option value="TRIAL">TRIAL</option>
                                <option value="PRO">PRO</option>
                            </select>
                            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '16px' }}>
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function AdminStatCard({ title, value, icon, trend, trendUp }: any) {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                <div style={{ fontSize: '0.8125rem', color: trendUp ? 'var(--success)' : 'var(--error)', backgroundColor: trendUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '100px', fontWeight: 700 }}>
                    {trend}
                </div>
            </div>
            <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>{title}</p>
                <h4 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{value}</h4>
            </div>
        </div>
    );
}

function LogItem({ event, user, status, time }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{event} ({user})</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{time}</span>
        </div>
    );
}

function ProgressItem({ label, current, total, color }: any) {
    const pct = Math.round((current / total) * 100);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>{label}</span>
                <span style={{ color: 'var(--text-muted)' }}>{current}</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color }} />
            </div>
        </div>
    );
}
