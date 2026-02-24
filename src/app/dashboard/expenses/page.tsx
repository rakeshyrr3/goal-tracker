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
    Edit2,
    Calendar,
    ChevronDown
} from "lucide-react";
import {
    format,
    isWithinInterval,
    startOfDay,
    endOfDay,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    parseISO
} from "date-fns";

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
    const [dateFilter, setDateFilter] = useState("All"); // All, Day, Month, Year, Custom
    const [customRange, setCustomRange] = useState({ start: "", end: "" });
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
        localStorage.setItem('user_expenses', JSON.stringify(expenses));
    }, [expenses]);

    const filteredExpenses = expenses.filter(exp => {
        const matchesSearch = exp.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exp.cat.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        const expDate = parseISO(exp.date);
        const now = new Date();

        if (dateFilter === "Day") {
            return isWithinInterval(expDate, { start: startOfDay(now), end: endOfDay(now) });
        }
        if (dateFilter === "Month") {
            return isWithinInterval(expDate, { start: startOfMonth(now), end: endOfMonth(now) });
        }
        if (dateFilter === "Year") {
            return isWithinInterval(expDate, { start: startOfYear(now), end: endOfYear(now) });
        }
        if (dateFilter === "Custom" && customRange.start && customRange.end) {
            return isWithinInterval(expDate, {
                start: startOfDay(parseISO(customRange.start)),
                end: endOfDay(parseISO(customRange.end))
            });
        }

        return true;
    });

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

    const handleExportPDF = () => {
        const printContent = document.getElementById('expense-report');
        if (printContent) {
            window.print();
        }
    };

    const totalSpentToday = expenses.filter(e => {
        const d = parseISO(e.date);
        return d >= startOfDay(new Date()) && d <= endOfDay(new Date());
    }).reduce((acc, curr) => acc + curr.amount, 0);

    const expenseByCategory = expenses.reduce((acc: any, curr: any) => {
        acc[curr.cat] = (acc[curr.cat] || 0) + curr.amount;
        return acc;
    }, {});

    const topCategory = Object.keys(expenseByCategory).length > 0
        ? Object.keys(expenseByCategory).reduce((a, b) => expenseByCategory[a] > expenseByCategory[b] ? a : b)
        : "None";

    const totalSpending = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalAllTime = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="print:p-0">
            {/* Header Section */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Expense Analysis</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Detailed breakdown of your financial flow.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: 'fit-content' }}>
                    <button onClick={() => setIsAddModalOpen(true)} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '14px', whiteSpace: 'nowrap' }}>
                        <Plus size={20} /> Add Expense
                    </button>
                    <button
                        onClick={handleExportPDF}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            borderRadius: '14px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}>
                        <FileText size={20} /> Export Report
                    </button>
                </div>
            </div>

            {/* Quick Stats - 2x2 */}
            <div className="no-print" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
            }}>
                <SummaryCard title="Total Spend" value={`₹${totalAllTime.toLocaleString()}`} color="#8b5cf6" />
                <SummaryCard title="Today Spend" value={`₹${totalSpentToday.toLocaleString()}`} color="#10b981" />
                <SummaryCard title="Top Category" value={topCategory} color="#d946ef" />
                <SummaryCard title="Transactions" value={filteredExpenses.length.toString()} color="#f59e0b" />
            </div>

            {/* Filters Section */}
            <div className="no-print card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        display: 'flex',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '4px',
                        width: '100%',
                        overflowX: 'auto',
                        justifyContent: 'flex-start'
                    }} className="no-scrollbar">
                        {["All", "Day", "Month", "Year", "Custom"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setDateFilter(f)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    backgroundColor: dateFilter === f ? 'var(--accent-primary)' : 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    flexShrink: 0
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            placeholder="Find by description or tag..."
                            style={{ width: '100%', paddingLeft: '42px', paddingRight: '16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {dateFilter === "Custom" && (
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>START DATE</label>
                            <input
                                type="date"
                                value={customRange.start}
                                onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                                style={{ padding: '8px', fontSize: '0.875rem' }}
                            />
                        </div>
                        <div style={{ color: 'var(--text-muted)' }}>→</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>END DATE</label>
                            <input
                                type="date"
                                value={customRange.end}
                                onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                                style={{ padding: '8px', fontSize: '0.875rem' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content / Report Section */}
            <div id="expense-report" className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div className="only-print" style={{ padding: '40px 40px 20px', display: 'none' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Expense Report</h1>
                    <p style={{ color: '#666' }}>Generated on {format(new Date(), 'PPP')}</p>
                    <div style={{ marginTop: '24px', display: 'flex', gap: '40px' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Filter Range</span>
                            <p style={{ fontWeight: 'bold' }}>{dateFilter}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Total Amount</span>
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{totalSpending.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '20px 24px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tag</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount</th>
                                <th className="no-print" style={{ padding: '20px 24px', width: '50px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((exp) => (
                                <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="hover:bg-glass">
                                    <td style={{ padding: '20px 24px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{exp.date}</td>
                                    <td style={{ padding: '20px 24px', fontSize: '0.9375rem', fontWeight: 600 }}>{exp.desc}</td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', fontWeight: 700 }}>{exp.cat}</span>
                                    </td>
                                    <td style={{ padding: '20px 24px', fontSize: '1rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>₹{exp.amount.toLocaleString()}</td>
                                    <td className="no-print" style={{ padding: '20px 24px', textAlign: 'right' }}>
                                        <div style={{ position: 'relative' }}>
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === exp.id ? null : exp.id)}
                                                style={{ padding: '8px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            {activeMenu === exp.id && (
                                                <div style={{ position: 'absolute', top: '100%', right: 0, zIndex: 50, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '6px', boxShadow: '0 10px 15px rgba(0,0,0,0.4)', width: '120px' }}>
                                                    <button onClick={() => handleDeleteExpense(exp.id)} style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.8125rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                                                        <Trash2 size={14} /> Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredExpenses.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <FileText size={40} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.3 }} />
                                        No transactions found for the selected filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Expense Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
                    <div className="modal-content" onClick={(e: React.MouseEvent) => e.stopPropagation()} style={{ borderRadius: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Record Expense</h3>
                            <button onClick={() => setIsAddModalOpen(false)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveExpense} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Amount (₹)</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)', fontSize: '1.25rem', fontWeight: 800 }}>₹</div>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="0"
                                        style={{ width: '100%', padding: '16px 16px 16px 48px', fontSize: '1.25rem', fontWeight: 700 }}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
                                <input
                                    value={formData.desc}
                                    onChange={e => setFormData({ ...formData, desc: e.target.value })}
                                    placeholder="What was this for?"
                                    style={{ padding: '14px' }}
                                    required
                                />
                            </div>
                            <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
                                    <select
                                        value={formData.cat}
                                        onChange={e => setFormData({ ...formData, cat: e.target.value })}
                                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}
                                    >
                                        <option>Tools</option>
                                        <option>Travel</option>
                                        <option>Groceries</option>
                                        <option>Online Shopping</option>
                                        <option>Food</option>
                                        <option>Movie</option>
                                        <option>Makeover</option>
                                        <option>Gadgets</option>
                                        <option>Rent</option>
                                        <option>Stationary</option>
                                        <option>Ads</option>
                                        <option>Business</option>
                                        <option>Marketing</option>
                                        <option>Personal</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        style={{ width: '100%', padding: '14px' }}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: '12px', justifyContent: 'center', padding: '16px', borderRadius: '14px', fontSize: '1rem' }}>
                                Confirm Expense
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
        <div className="card" style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            borderLeft: `3px solid ${color}`,
            background: 'rgba(255,255,255,0.02)'
        }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{title}</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{value}</h3>
        </div>
    );
}

