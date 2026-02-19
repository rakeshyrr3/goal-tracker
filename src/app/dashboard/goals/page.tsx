"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    ChevronRight,
    MoreHorizontal,
    AlertCircle,
    X,
    Target,
    Calendar,
    Clock,
    ArrowRight,
    Trash2,
    Edit2,
    CheckCircle,
    TrendingUp
} from "lucide-react";
import confetti from "canvas-confetti";

const INITIAL_GOALS_DATA = [
    {
        id: "1",
        title: "Scale Revenue to ₹10k/mo",
        desc: "Focus on high-ticket sales and recurring subscriptions.",
        progress: 65,
        dueDate: "2024-12-31",
        type: "Yearly",
        status: "Active",
        updates: ["Initial setup completed", "First 5 sales calls made"]
    },
    {
        id: "2",
        title: "Launch Product on Product Hunt",
        desc: "Prepare marketing assets and outreach list.",
        progress: 40,
        dueDate: "2024-11-15",
        type: "Monthly",
        status: "Active",
        updates: ["Landing page designed", "Drafted announcement post"]
    }
];

export default function GoalsPage() {
    const [goals, setGoals] = useState<any[]>([]);
    const [filter, setFilter] = useState("All");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [activeGoalMenuId, setActiveGoalMenuId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        desc: "",
        type: "Daily",
        dueDate: ""
    });

    const [dailyLog, setDailyLog] = useState("");

    // Load goals from local storage
    useEffect(() => {
        const savedGoals = localStorage.getItem('user_goals');
        if (savedGoals) {
            setGoals(JSON.parse(savedGoals));
        } else {
            setGoals(INITIAL_GOALS_DATA);
        }
    }, []);

    // Save goals to local storage
    useEffect(() => {
        localStorage.setItem('user_goals', JSON.stringify(goals));
    }, [goals]);

    const selectedGoal = goals.find(g => g.id === selectedGoalId) || null;

    const filteredGoals = goals.filter(goal => {
        if (filter === "All") return goal.status === "Active";
        if (filter === "Completed") return goal.status === "Completed";
        return goal.type === filter;
    });

    const triggerConfetti = () => {
        const colors = ['#8b5cf6', '#d946ef', '#10b981', '#f59e0b', '#3b82f6'];
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors,
            shapes: ['square']
        });
    };

    const handleSaveGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;

        if (isEditing && activeGoalMenuId) {
            setGoals(prev => prev.map(g =>
                g.id === activeGoalMenuId
                    ? { ...g, ...formData }
                    : g
            ));
        } else {
            const newGoal = {
                id: Date.now().toString(),
                ...formData,
                progress: 0,
                status: "Active",
                updates: ["Goal created " + new Date().toLocaleDateString()]
            };
            setGoals(prev => [newGoal, ...prev]);
            triggerConfetti();
        }

        setIsCreateModalOpen(false);
        setIsEditing(false);
        setFormData({ title: "", desc: "", type: "Daily", dueDate: "" });
    };

    const handleEditClick = (goal: any) => {
        setFormData({
            title: goal.title,
            desc: goal.desc,
            type: goal.type,
            dueDate: goal.dueDate
        });
        setIsEditing(true);
        setIsCreateModalOpen(true);
        setActiveGoalMenuId(null);
    };

    const handleUpdateProgress = (id: string) => {
        setGoals(prev => prev.map(g => {
            if (g.id === id) {
                const nextProgress = Math.min(g.progress + 10, 100);
                if (nextProgress === 100) triggerConfetti();
                return {
                    ...g,
                    progress: nextProgress,
                    status: nextProgress === 100 ? "Completed" : g.status,
                    updates: [`Increased progress to ${nextProgress}%`, ...(g.updates || [])]
                };
            }
            return g;
        }));
    };

    const handleAddDailyLog = (id: string) => {
        if (!dailyLog.trim()) return;
        setGoals(prev => prev.map(g => {
            if (g.id === id) {
                return {
                    ...g,
                    updates: [dailyLog, ...(g.updates || [])]
                };
            }
            return g;
        }));
        setDailyLog("");
    };

    const handleMarkAsComplete = (id: string) => {
        setGoals(prev => prev.map(g => {
            if (g.id === id) {
                triggerConfetti();
                return { ...g, progress: 100, status: "Completed", updates: ["Goal marked as completed", ...(g.updates || [])] };
            }
            return g;
        }));
        setSelectedGoalId(null);
    };

    const handleDeleteGoal = (id: string) => {
        if (confirm("Are you sure you want to delete this goal?")) {
            setGoals(prev => prev.filter(g => g.id !== id));
            setActiveGoalMenuId(null);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} onClick={() => setActiveGoalMenuId(null)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Goals</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track your long-term and short-term objectives.</p>
                </div>
                <button className="btn-primary" onClick={() => {
                    setIsEditing(false);
                    setFormData({ title: "", desc: "", type: "Daily", dueDate: "" });
                    setIsCreateModalOpen(true);
                }}>
                    <Plus size={18} />
                    Create New Goal
                </button>
            </div>

            <div className="tabs-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', overflow: 'visible' }}>
                <TabItem label="All" active={filter === "All"} onClick={() => setFilter("All")} count={goals.filter(g => g.status === "Active").length} />
                <TabItem label="Daily" active={filter === "Daily"} onClick={() => setFilter("Daily")} count={goals.filter(g => g.type === "Daily" && g.status === "Active").length} />
                <TabItem label="Weekly" active={filter === "Weekly"} onClick={() => setFilter("Weekly")} count={goals.filter(g => g.type === "Weekly" && g.status === "Active").length} />
                <TabItem label="Monthly" active={filter === "Monthly"} onClick={() => setFilter("Monthly")} count={goals.filter(g => g.type === "Monthly" && g.status === "Active").length} />
                <TabItem label="Yearly" active={filter === "Yearly"} onClick={() => setFilter("Yearly")} count={goals.filter(g => g.type === "Yearly" && g.status === "Active").length} />
                <TabItem label="Completed" active={filter === "Completed"} onClick={() => setFilter("Completed")} count={goals.filter(g => g.status === "Completed").length} />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px'
            }}>
                {filteredGoals.map(goal => (
                    <GoalCard
                        key={goal.id}
                        goal={goal}
                        onViewDetails={() => setSelectedGoalId(goal.id)}
                        isMenuOpen={activeGoalMenuId === goal.id}
                        onMenuToggle={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setActiveGoalMenuId(activeGoalMenuId === goal.id ? null : goal.id);
                        }}
                        onEdit={() => handleEditClick(goal)}
                        onDelete={() => handleDeleteGoal(goal.id)}
                    />
                ))}
                {filteredGoals.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                        No goals found in this category.
                    </div>
                )}
            </div>

            {/* Create Goal Modal */}
            {isCreateModalOpen && (
                <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{isEditing ? "Edit Goal" : "Create New Goal"}</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveGoal} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Goal Title</label>
                                <input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Master React in 30 days"
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
                                <textarea
                                    value={formData.desc}
                                    onChange={e => setFormData({ ...formData, desc: e.target.value })}
                                    placeholder="Tell us more about this goal..."
                                    style={{ height: '100px', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', color: 'white', outline: 'none' }}
                                ></textarea>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        style={{ backgroundColor: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px' }}
                                    >
                                        <option>Daily</option>
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                        <option>Yearly</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Date</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: '12px', justifyContent: 'center' }}>
                                {isEditing ? "Update Goal" : "Save Goal"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Goal Detail Modal */}
            {selectedGoal && (
                <div className="modal-overlay" onClick={() => setSelectedGoalId(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'sticky', top: 0, backgroundColor: 'var(--card-bg)', zIndex: 10, paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                    color: 'var(--accent-primary)',
                                    fontSize: '0.75rem',
                                    fontWeight: 700
                                }}>
                                    {selectedGoal.type} Goal
                                </div>
                                <button onClick={() => setSelectedGoalId(null)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{selectedGoal.title}</h3>
                        </div>

                        <div style={{ flex: 1 }}>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>{selectedGoal.desc}</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        <Clock size={16} /> Due: {selectedGoal.dueDate}
                                    </div>
                                    <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{selectedGoal.progress}%</div>
                                </div>
                                <div style={{ height: '12px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${selectedGoal.progress}%`,
                                        transition: 'width 0.3s ease',
                                        background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))'
                                    }}></div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertCircle size={16} /> Goal Updates / Daily Status
                                </h4>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                    <input
                                        value={dailyLog}
                                        onChange={(e) => setDailyLog(e.target.value)}
                                        placeholder="What did you do today for this goal?"
                                        style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                    />
                                    <button
                                        onClick={() => handleAddDailyLog(selectedGoal.id)}
                                        className="btn-primary"
                                        style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                                    >Update Status</button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                                    {selectedGoal.updates && selectedGoal.updates.map((log: string, idx: number) => (
                                        <div key={idx} style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                                            {log}
                                        </div>
                                    ))}
                                    {(!selectedGoal.updates || selectedGoal.updates.length === 0) && (
                                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                                            No updates added yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ position: 'sticky', bottom: 0, backgroundColor: 'var(--card-bg)', zIndex: 10, paddingTop: '16px', marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {selectedGoal.status !== "Completed" && (
                                    <>
                                        <button
                                            onClick={() => handleUpdateProgress(selectedGoal.id)}
                                            className="btn-primary"
                                            style={{ flex: 1, justifyContent: 'center' }}
                                        >
                                            <TrendingUp size={18} /> Quick +10%
                                        </button>
                                        <button
                                            onClick={() => handleMarkAsComplete(selectedGoal.id)}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                padding: '12px',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border-color)',
                                                color: 'white',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                backgroundColor: 'rgba(255,255,255,0.02)'
                                            }}
                                            className="hover:bg-glass"
                                        >
                                            <CheckCircle size={18} /> Mark Completed
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function GoalCard({ goal, onViewDetails, isMenuOpen, onMenuToggle, onEdit, onDelete }: any) {
    const { title, desc, progress, dueDate, type } = goal;
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        display: 'inline-block'
                    }}>
                        {type}
                    </span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{title}</h3>
                </div>
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={onMenuToggle}
                        style={{
                            color: 'var(--text-muted)',
                            padding: '4px',
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}
                        className="hover:bg-glass"
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    {isMenuOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            backgroundColor: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '8px',
                            zIndex: 10,
                            width: '120px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                        }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                                style={{
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
                </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>{desc}</p>

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{progress}% Progress</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Target: {dueDate}</span>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div title="Updates" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={14} /> {goal.updates ? goal.updates.length : 0} Updates
                    </div>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                    style={{
                        fontSize: '0.875rem',
                        color: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none'
                    }}>
                    View Details <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}

function TabItem({ label, active, count, onClick }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: active ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 400,
                whiteSpace: 'nowrap',
                border: active ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
                cursor: 'pointer'
            }}
        >
            {label}
            <span style={{
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '6px',
                backgroundColor: active ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                color: active ? 'white' : 'var(--text-muted)'
            }}>
                {count}
            </span>
        </button>
    );
}
