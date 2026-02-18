"use client";

import {
    TrendingUp,
    ArrowUpRight,
    Target,
    Calendar,
    Zap,
    CheckCircle2,
    Clock
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
    PieChart,
    Pie,
    Cell
} from "recharts";

const data = [
    { name: 'Jan', completed: 45, pending: 20 },
    { name: 'Feb', completed: 52, pending: 25 },
    { name: 'Mar', completed: 61, pending: 15 },
    { name: 'Apr', completed: 58, pending: 30 },
    { name: 'May', completed: 75, pending: 10 },
    { name: 'Jun', completed: 82, pending: 12 },
];

const COLORS = ['#8b5cf6', '#d946ef', '#10b981', '#f59e0b'];

export default function AnalyticsPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Performance Analytics</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Deep dive into your productivity metrics and goal progress.</p>
            </div>

            {/* Hero Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px'
            }}>
                <MetricCard
                    title="Overall Efficiency"
                    value="92.4%"
                    trend="+4.2%"
                    desc="Based on completed vs scheduled tasks"
                    icon={<Zap size={20} color="var(--warning)" />}
                />
                <MetricCard
                    title="Goal Momentum"
                    value="+12"
                    trend="+2"
                    desc="New goals started this month"
                    icon={<Target size={20} color="var(--accent-primary)" />}
                />
                <MetricCard
                    title="Avg. Completion Time"
                    value="4.5 Days"
                    trend="-0.5 Days"
                    desc="Faster than last month"
                    icon={<Clock size={20} color="var(--accent-secondary)" />}
                />
            </div>

            {/* Main Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Goal Completion History</h3>
                        <select style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                />
                                <Area type="monotone" dataKey="completed" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={3} />
                                <Area type="monotone" dataKey="pending" stroke="var(--text-muted)" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '24px' }}>Status Breakdown</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Completed', value: 45 },
                                        { name: 'In Progress', value: 30 },
                                        { name: 'Delayed', value: 15 },
                                        { name: 'Canceled', value: 10 },
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                        <LegendItem color={COLORS[0]} label="Completed" />
                        <LegendItem color={COLORS[1]} label="In Progress" />
                        <LegendItem color={COLORS[2]} label="Delayed" />
                        <LegendItem color={COLORS[3]} label="Canceled" />
                    </div>
                </div>
            </div>

            {/* Productivity Insights */}
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), transparent)' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-primary)'
                    }}>
                        <TrendingUp size={32} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>Productivity Recommendation</h4>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            You are most productive on <b>Tuesdays and Wednesdays</b>. Your average goal completion rate has increased by 15% since you started tracking daily tasks. Consider breaking down your "Yearly" goals into smaller "Weekly" sprints for even better results.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, desc, icon }: any) {
    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)' }}>{icon}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <ArrowUpRight size={14} /> {trend}
                </span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>{value}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>{title}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{desc}</p>
        </div>
    );
}

function LegendItem({ color, label }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: color }}></div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</span>
        </div>
    );
}
