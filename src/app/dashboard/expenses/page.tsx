"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    FileText,
    Search,
    Filter,
    DollarSign,
    MoreVertical,
    X,
    Trash2,
    Edit2
} from "lucide-react";

const INITIAL_EXPENSES = [
    { id: "1", date: "2024-10-22", desc: "Vercel Pro Subscription", cat: "Tools", amount: 2000 },
    { id: "2", date: "2024-10-21", desc: "Facebook Ads - Campaign A", cat: "Ads", amount: 45000 },
    { id: "3", date: "2024-10-20", desc: "Coworking Space", cat: "Business", amount: 15000 },
    { id: "4", date: "2024-10-19", desc: "Adobe Creative Cloud", cat: "Tools", amount: 5300 },
    { id: "5", date: "2024-10-18", desc: "Domain Renewal", cat: "Tools", amount: 1200 },
];

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [formData, setFormData] = useState({ amount: "", desc: "", cat: "Tools", date: new Date().toISOString().split('T')[0] });

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('user_expenses');
        if (saved) {
            setExpenses(JSON.parse(saved));
        } else {
            setExpenses(INITIAL_EXPENSES);
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        if (expenses.length > 0) {
            localStorage.setItem('user_expenses', JSON.stringify(expenses));
        }
    }, [expenses]);

    const filteredExpenses = expenses.filter(exp =>
        exp.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.cat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSaveExpense = (e: React.FormEvent) => {
        e.preventDefault();
        const newExp = {
            id: Date.now().toString(),
            ...formData,
            amount: parseFloat(formData.amount as string) || 0
        };
        setExpenses([newExp, ...expenses]);
        setIsAddModalOpen(false);
        setFormData({ amount: "", desc: "", cat: "Tools", date: new Date().toISOString().split('T')[0] });
    };

    const handleDeleteExpense = (id: string) => {
        if (confirm("Delete this expense?")) {
            setExpenses(expenses.filter(e => e.id !== id));
            setActiveMenu(null);
        }
    };

    const handleExport = (type: 'pdf' | 'csv') => {
        if (type === 'pdf') {
            window.print();
        } else {
            // CSV Export
            const headers = "Date,Description,Category,Amount\n";
            const csvData = expenses.map(e => `${e.date},${e.desc},${e.cat},${e.amount}`).join("\n");
            const blob = new Blob([headers + csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
        }
    };

    const totalSpending = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const dailyAvg = totalSpending / (expenses.length || 1);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="print:p-0">
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Expense Management</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Track and categorize your spending.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: 'fit-content' }}>
                    <button onClick={() => setIsAddModalOpen(true)} className="btn-primary" style={{ whiteSpace: 'nowrap', flex: 1 }}>
                        <Plus size={18} /> Add
                    </button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => handleExport('pdf')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                borderRadius: '10px',
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>
                            <FileText size={18} /> PDF
                        </button>
                        <button
                            onClick={() => handleExport('csv')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                borderRadius: '10px',
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>
                            <Search size={18} /> CSV
                        </button>
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns
                gridTemplateRows: 'repeat(2, auto)', // 2 rows
                gap: '24px'
            }}>
                <SummaryCard title="Total Spending" value={`₹${totalSpending.toLocaleString()}`} color="var(--accent-primary)" />
                <SummaryCard title="Daily Average" value={`₹${dailyAvg.toFixed(2)}`} color="var(--success)" />
                <SummaryCard title="Top Category" value={expenses.length > 0 ? expenses[0].cat : "N/A"} color="var(--accent-secondary)" />
                <SummaryCard title="Transactions" value={expenses.length.toString()} color="var(--warning)" />
            </div>

            <div className="card" style={{ padding: '0' }}>
                <div className="no-print" style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            placeholder="Search transactions..."
                            style={{ width: '100%', paddingLeft: '40px' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => alert("Advanced filters coming soon!")}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Filter size={18} />
                        Filters
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Description</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Category</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Amount</th>
                                <th className="no-print" style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', width: '50px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((exp) => (
                                <ExpenseRow
                                    key={exp.id}
                                    id={exp.id}
                                    date={exp.date}
                                    desc={exp.desc}
                                    cat={exp.cat}
                                    amount={`₹${exp.amount.toLocaleString()}`}
                                    isMenuOpen={activeMenu === exp.id}
                                    onMenuToggle={() => setActiveMenu(activeMenu === exp.id ? null : exp.id)}
                                    onDelete={() => handleDeleteExpense(exp.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Expense Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
                    <div className="modal-content" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Add New Expense</h3>
                            <button onClick={() => setIsAddModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveExpense} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Amount (₹)</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.125rem', fontWeight: 'bold' }}>₹</div>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="0.00"
                                        style={{ width: '100%', paddingLeft: '48px' }}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
                                <input
                                    value={formData.desc}
                                    onChange={e => setFormData({ ...formData, desc: e.target.value })}
                                    placeholder="e.g. Server hosting"
                                    required
                                />
                            </div>
                            <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
                                    <select
                                        value={formData.cat}
                                        onChange={e => setFormData({ ...formData, cat: e.target.value })}
                                        style={{ backgroundColor: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px' }}
                                    >
                                        <option>Tools</option>
                                        <option>Ads</option>
                                        <option>Business</option>
                                        <option>Marketing</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: '12px', justifyContent: 'center' }}>
                                Save Expense
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({ title, value, color }: any) {
    return (
        <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{title}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</h3>
        </div>
    );
}

function ExpenseRow({ id, date, desc, cat, amount, isMenuOpen, onMenuToggle, onDelete }: any) {
    return (
        <tr style={{ borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
            <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{date}</td>
            <td style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 600 }}>{desc}</td>
            <td style={{ padding: '16px 24px' }}>
                <span style={{
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-primary)'
                }}>
                    {cat}
                </span>
            </td>
            <td style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: 700 }}>{amount}</td>
            <td className="no-print" style={{ padding: '16px 24px', textAlign: 'right', position: 'relative' }}>
                <button
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onMenuToggle();
                    }}
                    style={{
                        color: 'var(--text-muted)',
                        padding: '8px',
                        borderRadius: '50%',
                        transition: 'background 0.2s',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none'
                    }}
                    className="hover:bg-glass"
                >
                    <MoreVertical size={18} />
                </button>

                {isMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '80%',
                        right: '24px',
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '8px',
                        zIndex: 10,
                        width: '120px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                    }}>
                        <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '10px',
                            fontSize: '0.8125rem',
                            color: 'var(--text-secondary)',
                            borderRadius: '4px',
                            textAlign: 'left',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }} className="hover-item">
                            <Edit2 size={14} /> Edit
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '10px',
                                fontSize: '0.8125rem',
                                color: 'var(--error)',
                                borderRadius: '4px',
                                textAlign: 'left',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }} className="hover-item">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}
