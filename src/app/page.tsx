"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ChevronRight, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function RootPage() {
    const [status, setStatus] = useState<'splash' | 'select'>('splash');
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus('select');
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <AnimatePresence mode="wait">
                {status === 'splash' ? (
                    <motion.div
                        key="splash"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ textAlign: 'center' }}
                    >
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '32px',
                                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
                            }}
                        >
                            <Target size={64} color="white" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}
                        >
                            Goal Tracker
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            style={{ color: 'var(--text-secondary)', marginTop: '8px' }}
                        >
                            Your Journey Begins Here
                        </motion.p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="select"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            padding: '40px',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ marginBottom: '48px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px'
                            }}>
                                <Target size={32} color="white" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Choose how you'd like to continue</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        padding: '20px',
                                        borderRadius: '24px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '14px',
                                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--accent-primary)'
                                    }}>
                                        <LogIn size={24} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 700, color: 'white' }}>Login</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Already have an account?</div>
                                    </div>
                                    <ChevronRight size={20} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                                </motion.div>
                            </Link>

                            <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        padding: '20px',
                                        borderRadius: '24px',
                                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1))',
                                        border: '1px solid rgba(139, 92, 246, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '14px',
                                        backgroundColor: 'var(--accent-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <UserPlus size={24} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 700, color: 'white' }}>Sign Up</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>New to Goal Tracker?</div>
                                    </div>
                                    <ChevronRight size={20} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                                </motion.div>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .btn-primary {
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    color: white;
                    border: none;
                    padding: 16px 32px;
                    border-radius: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    alignItems: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.2);
                }
            `}</style>
        </div>
    );
}
