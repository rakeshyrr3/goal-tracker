"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, ChevronLeft, Target } from "lucide-react";
import Link from "next/link";
import { syncLocalDataToBackend } from "@/lib/sync";

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || !password) {
            alert("Please enter both username and password.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Login failed');

            localStorage.setItem('user_id', result.userId);
            localStorage.setItem('user_name', result.name || "");
            localStorage.setItem('is_logged_in', 'true');

            // Sync local data to cloud
            try {
                await syncLocalDataToBackend(result.userId);
            } catch (syncError) {
                console.warn("Cloud sync deferred:", syncError);
            }

            router.push('/dashboard');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '100%',
                    maxWidth: '450px',
                }}
            >
                <Link href="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    marginBottom: '32px'
                }}>
                    <ChevronLeft size={20} /> Back
                </Link>

                <div className="card" style={{
                    padding: '40px',
                    borderRadius: '32px',
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px'
                    }}>
                        <Target size={32} color="white" />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Login to continue your progress</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="input-group" style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Mobile or Email</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter mobile or email"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                                <Link href="#" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>Forgot?</Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ marginTop: '8px', justifyContent: 'center', padding: '18px', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Logging in...' : 'Login'} <ArrowRight size={20} />
                        </button>
                    </form>

                    <p style={{ marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Don't have an account? <Link href="/auth/signup" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Sign Up</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '16px 16px 16px 48px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
};
