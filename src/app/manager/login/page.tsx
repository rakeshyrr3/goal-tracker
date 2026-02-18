"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, User, ArrowRight } from "lucide-react";

export default function ManagerLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simple hardcoded check for the manager portal
        if (username === "admin" && password === "goaltracker@2026") {
            setTimeout(() => {
                localStorage.setItem('manager_token', 'true');
                router.push('/manager/dashboard');
            }, 1000);
        } else {
            setTimeout(() => {
                setError("Invalid credentials. Please contact developer.");
                setIsLoading(false);
            }, 800);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#050507',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'inherit'
        }}>
            <div className="card" style={{
                maxWidth: '400px',
                width: '100%',
                padding: '40px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-color)',
                borderRadius: '32px'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
                }}>
                    <Shield size={32} color="white" />
                </div>

                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Manager Portal</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '32px' }}>
                    Authorized access only
                </p>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--error)',
                        padding: '12px',
                        borderRadius: '12px',
                        fontSize: '0.8125rem',
                        marginBottom: '24px',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', paddingLeft: '48px' }}
                            required
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', paddingLeft: '48px' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary"
                        style={{ marginTop: '12px', justifyContent: 'center', padding: '16px' }}
                    >
                        {isLoading ? "Verifying..." : "Secure Login"} <ArrowRight size={18} />
                    </button>
                </form>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '32px' }}>
                    Copyright © 2026 Admin Management Suite
                </p>
            </div>
        </div>
    );
}
