"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle, Circle, Palette, Layout, Type } from "lucide-react";

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    theme: string;
    time?: string;
}

const THEMES = [
    { name: "Modern Blue", bg: "rgba(59, 130, 246, 0.1)", border: "#3b82f6", text: "#fff" },
    { name: "Sticky Yellow", bg: "#fef9c3", border: "#facc15", text: "#854d0e" },
    { name: "Glass Pastel", bg: "rgba(255, 255, 255, 0.1)", border: "rgba(255, 255, 255, 0.2)", text: "#fff" },
    { name: "Neon Purple", bg: "rgba(168, 85, 247, 0.1)", border: "#a855f7", text: "#fff" },
    { name: "Mint Fresh", bg: "rgba(34, 197, 94, 0.1)", border: "#22c55e", text: "#fff" },
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

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newTodo: Todo = {
            id: Date.now().toString(),
            text: inputValue,
            completed: false,
            theme: selectedTheme.name,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setTodos([newTodo, ...todos]);
        setInputValue("");
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Rich To-Do Widgets</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Personalize your tasks with interactive themes.</p>
                </div>
            </div>

            {/* Theme Selector */}
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {THEMES.map((theme) => (
                    <button
                        key={theme.name}
                        onClick={() => setSelectedTheme(theme)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '12px',
                            backgroundColor: theme.bg,
                            border: `2px solid ${selectedTheme.name === theme.name ? theme.border : 'transparent'}`,
                            color: theme.name.includes("Sticky") ? theme.text : 'white',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Palette size={16} />
                        {theme.name}
                    </button>
                ))}
            </div>

            {/* Input Section */}
            <form onSubmit={addTodo} style={{ display: 'flex', gap: '12px' }}>
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What needs to be done?"
                    style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        color: 'white',
                        fontSize: '1rem'
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
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={24} />
                </button>
            </form>

            {/* Grid of Todos */}
            <div className="todo-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
            }}>
                {todos.map((todo) => {
                    const theme = THEMES.find(t => t.name === todo.theme) || THEMES[0];
                    const isSticky = theme.name.includes("Sticky");

                    return (
                        <div
                            key={todo.id}
                            style={{
                                padding: '24px',
                                borderRadius: '24px',
                                backgroundColor: theme.bg,
                                border: isSticky ? 'none' : `1px solid ${theme.border}`,
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                textDecoration: todo.completed ? 'line-through' : 'none',
                                opacity: todo.completed ? 0.7 : 1,
                                boxShadow: isSticky ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
                                transform: isSticky ? 'rotate(-1deg)' : 'none'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSticky ? theme.text : 'white' }}
                                >
                                    {todo.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                                </button>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSticky ? 'rgba(0,0,0,0.3)' : 'var(--text-muted)' }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <p style={{
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: isSticky ? theme.text : 'white',
                                margin: 0,
                                flex: 1
                            }}>
                                {todo.text}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: isSticky ? 'rgba(0,0,0,0.4)' : 'var(--text-muted)', fontWeight: 500 }}>
                                    {todo.time}
                                </span>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: theme.border
                                }} />
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
                    padding: '48px'
                }}>
                    <Layout size={48} strokeWidth={1} />
                    <p>No tasks yet. Pick a theme and start adding!</p>
                </div>
            )}
        </div>
    );
}
