import { useState, useEffect } from "react";
import {
    Target,
    TrendingUp,
    CreditCard,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
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

export default function DashboardPage() {
    const [goals, setGoals] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);

    useEffect(() => {
        const savedGoals = localStorage.getItem('user_goals');
        const savedExpenses = localStorage.getItem('user_expenses');
        if (savedGoals) setGoals(JSON.parse(savedGoals));
        if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

        // Sync event with Manager Portal
        const syncWithAdmin = async () => {
            try {
                await fetch('/api/admin/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: 'Dashboard Viewed',
                        user: 'Local User',
                        status: 'Success'
                    })
                });
            } catch (err) {
                console.warn("Manager portal sync offline");
            }
        };
        syncWithAdmin();
    }, []);

    const totalSpending = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const activeGoalsCount = goals.length;

    // Simple progress calculation
    const avgProgress = goals.length > 0
        ? Math.round(goals.reduce((acc, curr) => acc + (curr.progress || 0), 0) / goals.length)
        : 0;

    const COLORS = ['#8b5cf6', '#d946ef', '#10b981', '#f59e0b'];

    // Group expenses by category for the chart
    const expenseByCategory = expenses.reduce((acc: any, curr: any) => {
        acc[curr.cat] = (acc[curr.cat] || 0) + curr.amount;
        return acc;
    }, {});

    const chartData = Object.keys(expenseByCategory).map(key => ({
        category: key,
        amount: expenseByCategory[key]
    })).slice(0, 4);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Active Goals"
                    value={activeGoalsCount.toString()}
                    icon={<Target color="var(--accent-primary)" />}
                    trend="+2 this week"
                    trendUp={true}
                />
                <StatCard
                    title="Avg. Progress"
                    value={`${avgProgress}%`}
                    icon={<TrendingUp color="var(--accent-secondary)" />}
                    trend="+5.4%"
                    trendUp={true}
                />
                <StatCard
                    title="Total Spending"
                    value={`₹${totalSpending.toLocaleString()}`}
                    icon={<CreditCard color="var(--warning)" />}
                    trend="-12% vs last month"
                    trendUp={true}
                />
                <StatCard
                    title="Performance Score"
                    value="84"
                    icon={<CheckCircle2 color="var(--success)" />}
                    trend="+2 pts"
                    trendUp={true}
                />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                {/* Productivity Trend */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Productivity Trend</h3>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'Mon', completion: 65 },
                                { name: 'Tue', completion: 59 },
                                { name: 'Wed', completion: 80 },
                                { name: 'Thu', completion: 81 },
                                { name: 'Fri', completion: 56 },
                                { name: 'Sat', completion: 55 },
                                { name: 'Sun', completion: 40 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Area type="monotone" dataKey="completion" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorCompletion)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '24px' }}>Expense Categories</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="category" type="category" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                                No expenses recorded yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Productivity Insights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <InsightCard
                    title="Weekly Summary"
                    message={activeGoalsCount > 0 ? `You have ${activeGoalsCount} active goals to focus on!` : "Start by adding your first goal!"}
                    type="success"
                />
                <InsightCard
                    title="Spending Insight"
                    message={totalSpending > 0 ? `Your total spending is ₹${totalSpending.toLocaleString()}. Keep tracking!` : "Record your first expense to see trends."}
                    type="warning"
                />
            </div>

            {/* Recent Goals Section */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Active Goals</h3>
                    <button style={{ color: 'var(--accent-primary)', fontSize: '0.875rem' }}>View All</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {goals.length > 0 ? goals.slice(0, 3).map((goal) => (
                        <GoalItem
                            key={goal.id}
                            title={goal.title}
                            progress={goal.progress || 0}
                            dueDate={goal.dueDate}
                            type={goal.type}
                        />
                    )) : (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No active goals found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, trendUp }: any) {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>
                <span style={{
                    fontSize: '0.75rem',
                    color: trendUp ? 'var(--success)' : 'var(--error)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    backgroundColor: trendUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '12px'
                }}>
                    {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trend}
                </span>
            </div>
            <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>{title}</p>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</h4>
            </div>
        </div>
    );
}

function InsightCard({ title, message, type }: any) {
    const icon = type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle />;
    const color = type === 'success' ? 'var(--success)' : 'var(--warning)';

    return (
        <div className="card" style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            borderLeft: `4px solid ${color}`,
            background: `linear-gradient(to right, ${color}05, transparent)`
        }}>
            <div style={{ color }}>{icon}</div>
            <div>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '2px' }}>{title}</h5>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{message}</p>
            </div>
        </div>
    );
}

function GoalItem({ title, progress, dueDate, type }: any) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '16px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                fontSize: '0.75rem',
                fontWeight: 600
            }}>
                {progress}%
            </div>
            <div style={{ flex: 1 }}>
                <h5 style={{ fontSize: '0.925rem', fontWeight: 600, marginBottom: '4px' }}>{title}</h5>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-muted)'
                    }}>
                        {type}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        Due {dueDate}
                    </span>
                </div>
            </div>
            <button style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                fontSize: '0.875rem',
                color: 'var(--text-primary)'
            }}>
                Update
            </button>
        </div>
    );
}
