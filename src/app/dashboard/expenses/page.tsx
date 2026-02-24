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
    ChevronDown,
    Download
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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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

    const handleExportPDF = async () => {
        const element = document.getElementById('expense-report');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: '#0c0c0e',
                scale: 2,
                logging: false,
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`GoalTracker_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF. Please try again.");
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
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Spend Analysis</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Track and optimize your daily expenses.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: 'fit-content' }}>
                    <button onClick={() => setIsAddModalOpen(true)} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '14px', whiteSpace: 'nowrap' }}>
                        <Plus size={20} /> Add Spend
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
                        <FileText size={20} /> Export PDF
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
            <div id="expense-report" className="card" style={{ padding: '24px', backgroundColor: '#0c0c0e', border: 'none' }}>
                <div style={{ padding: '0 0 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Expense Summary Report</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Generated on {format(new Date(), 'PPP')}</p>
                    <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Period</span>
                            <p style={{ fontWeight: 700, marginTop: '4px' }}>{dateFilter}</p>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Spent</span>
                            <p style={{ fontWeight: 800, marginTop: '4px', fontSize: '1.25rem', color: 'var(--accent-secondary)' }}>₹{totalSpending.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                                <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</th>
                                <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tag</th>
                                <th style={{ padding: '16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((exp) => (
                                <tr key={exp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '16px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{exp.date}</td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem', fontWeight: 600 }}>{exp.desc}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', fontWeight: 700 }}>{exp.cat}</span>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.925rem', fontWeight: 800, textAlign: 'right' }}>₹{exp.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                            {filteredExpenses.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No transactions found.
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
