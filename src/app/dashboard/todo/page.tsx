"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle, Circle, Palette, Layout, Calendar, Clock } from "lucide-react";
import confetti from "canvas-confetti";

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    theme: string;
    time?: string;
    date?: string;
}

const THEMES = [
    { name: "Deep Blue", bg: "rgba(59, 130, 246, 0.1)", border: "#3b82f6", text: "#fff" },
    { name: "Neon Purple", bg: "rgba(168, 85, 247, 0.1)", border: "#a855f7", text: "#fff" },
    { name: "Mint Fresh", bg: "rgba(34, 197, 94, 0.1)", border: "#22c55e", text: "#fff" },
    { name: "Sunset Gold", bg: "rgba(245, 158, 11, 0.1)", border: "#f59e0b", text: "#fff" },
    { name: "Rose Pink", bg: "rgba(244, 63, 94, 0.1)", border: "#f43f5e", text: "#fff" },
];

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);

    useEffect(() => {
        const saved = localStorage.getItem('user_todos');
        if (saved) setTodos(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('user_todos', JSON.stringify(todos));
    }, [todos]);

    const triggerConfetti = () => {
        const colors = ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'];
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors,
            shapes: ['square']
        });
    };

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const now = new Date();
        const newTodo: Todo = {
            id: Date.now().toString(),
            text: inputValue,
            completed: false,
            theme: selectedTheme.name,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
        };

        setTodos([newTodo, ...todos]);
        setInputValue("");
    };

    const toggleTodo = (id: string) => {
        setTodos(prev => prev.map(t => {
            if (t.id === id && !t.completed) {
                triggerConfetti();
            }
            return t.id === id ? { ...t, completed: !t.completed } : t;
        }));
    };

    const deleteTodo = (id: string) => {
        if (confirm("Delete this task?")) {
            setTodos(todos.filter(t => t.id !== id));
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Daily Tasks</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Organize your day with simple, effective lists.</p>
                </div>
            </div>

            {/* Theme Selector */}
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }} className="no-scrollbar">
                {THEMES.map((theme) => (
                    <button
                        key={theme.name}
                        onClick={() => setSelectedTheme(theme)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '12px',
                            background: theme.bg,
                            border: `2px solid ${selectedTheme.name === theme.name ? 'var(--accent-primary)' : 'transparent'}`,
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            boxShadow: selectedTheme.name === theme.name ? '0 0 15px rgba(139, 92, 246, 0.3)' : 'none'
                        }}
                    >
                        <Palette size={16} />
                        {theme.name}
                    </button>
                ))}
            </div>

            {/* Input Section */}
            <form onSubmit={addTodo} style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Capture your next big goal..."
                    style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        color: 'white',
                        fontSize: '0.925rem',
                        outline: 'none',
                        minWidth: 0 // Prevent input from pushing out flex items
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '0 24px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--accent-primary)',
                        color: 'white',
                        border: 'none',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}
                >
                    <Plus size={24} />
                </button>
            </form>

            {/* Grid of Todos */}
            <div className="todo-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
            }}>
                {todos.map((todo) => {
                    const theme = THEMES.find(t => t.name === todo.theme) || THEMES[0];
                    const isRainbow = theme.name === "Rainbow";

                    return (
                        <div
                            key={todo.id}
                            style={{
                                padding: '24px',
                                borderRadius: '28px',
                                background: theme.bg,
                                border: `1px solid ${theme.border}`,
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                textDecoration: todo.completed ? 'line-through' : 'none',
                                opacity: todo.completed ? 0.6 : 1,
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
                                transition: 'all 0.3s ease',
                                transform: todo.completed ? 'scale(0.98)' : 'scale(1)'
                            }}
                        >

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
                                >
                                    {todo.completed ? <CheckCircle size={28} color="var(--success)" /> : <Circle size={28} color="var(--text-muted)" />}
                                </button>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '8px', borderRadius: '12px' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <p style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: 'white',
                                margin: 0,
                                flex: 1,
                                lineHeight: 1.4
                            }}>
                                {todo.text}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <Calendar size={14} />
                                    {todo.date || 'Today'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <Clock size={14} />
                                    {todo.time}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {todos.length === 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    color: 'var(--text-muted)',
                    gap: '16px',
                    padding: '80px 24px',
                    textAlign: 'center'
                }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '30px', backgroundColor: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <Layout size={40} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Empty Canvas</h3>
                    <p style={{ maxWidth: '300px' }}>Pick a theme and start capturing your tasks. Your future self will thank you!</p>
                </div>
            )}
        </div>
    );
}
