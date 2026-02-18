"use client";

import Link from "next/link";
import {
    ArrowRight,
    Play,
    Star,
    Shield,
    Smartphone,
    TrendingUp,
    CheckCircle,
    PlayCircle,
    ChevronRight,
    Target,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Check,
    Zap,
    X
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0d 0%, #1a0a2e 50%, #0a0a0d 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Blobs */}
            <div style={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 8s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(217, 70, 239, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 6s ease-in-out infinite reverse'
            }} />

            {/* Header */}
            <header style={{
                padding: '20px 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Target size={24} color="white" />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Goal Tracker</span>
                </div>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <Link href="/auth/login" style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.925rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'color 0.2s'
                    }} className="hover:text-white">
                        Login
                    </Link>
                    <Link href="/dashboard" className="btn-primary" style={{ fontSize: '0.875rem', padding: '10px 24px' }}>
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 5% 80px', // Adjusted padding for main
                position: 'relative',
                zIndex: 10
            }}>
                <section style={{
                    padding: '120px 24px 80px',
                    textAlign: 'center',
                    maxWidth: '900px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '100px',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        color: 'var(--accent-primary)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        marginBottom: '24px',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></span>
                        Now with 3-Day Free Trial
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '24px',
                        letterSpacing: '-0.02em'
                    }}>
                        Master Your <span style={{ color: 'var(--accent-primary)' }}>Goals</span> & Finances in One Place
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
                        color: 'var(--text-secondary)',
                        marginBottom: '48px',
                        lineHeight: 1.6,
                        maxWidth: '650px'
                    }}>
                        The all-in-one productivity suite for entrepreneurs. Track your progress, manage expenses, and stay organized with beautiful themed widgets.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        width: '100%',
                        maxWidth: 'fit-content',
                        flexDirection: 'row'
                    }} className="hero-buttons">
                        <Link href="/auth/login" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.125rem' }}>
                            Start 3-Day Trial <ChevronRight size={20} />
                        </Link>
                        <button
                            onClick={() => setIsDemoModalOpen(true)}
                            style={{
                                padding: '16px 40px',
                                fontSize: '1.125rem',
                                borderRadius: '16px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                            <Play size={20} /> Watch Demo
                        </button>
                    </div>
                </section>

                {/* Features Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    marginBottom: '80px'
                }}>
                    <FeatureCard
                        icon={<Target size={28} />}
                        title="Smart Goal Tracking"
                        description="Set daily, weekly, monthly, and yearly goals. Track progress with visual indicators and stay motivated."
                    />
                    <FeatureCard
                        icon={<BarChart3 size={28} />}
                        title="Expense Management"
                        description="Monitor spending patterns, categorize expenses, and export detailed reports in CSV format."
                    />
                    <FeatureCard
                        icon={<TrendingUp size={28} />}
                        title="Advanced Analytics"
                        description="Beautiful charts and insights that help you understand your productivity trends over time."
                    />
                    <FeatureCard
                        icon={<Zap size={28} />}
                        title="Real-time Updates"
                        description="Log daily progress, add notes, and watch your achievements grow with every update."
                    />
                </div>

                {/* Social Proof */}
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '24px',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px' }}>
                        Join thousands crushing their goals
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                        Trusted by entrepreneurs, students, and professionals worldwide
                    </p>
                    <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <StatItem value="10K+" label="Active Users" />
                        <StatItem value="50K+" label="Goals Completed" />
                        <StatItem value="4.9/5" label="User Rating" />
                    </div>
                </div>
            </main>

            {/* Demo Modal */}
            {isDemoModalOpen && (
                <div className="modal-overlay" onClick={() => setIsDemoModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%', padding: '0', overflow: 'hidden' }}>
                        <div style={{ backgroundColor: '#000', position: 'relative', paddingTop: '56.25%' }}>
                            <button
                                onClick={() => setIsDemoModalOpen(false)}
                                style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 20, color: 'white', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={24} />
                            </button>
                            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <PlayCircle size={64} color="var(--accent-primary)" style={{ marginBottom: '16px' }} />
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Product Demo Video</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Experience the power of Goal Tracker</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '32px', textAlign: 'center' }}>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Ready to crush your goals?</h4>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Start your 3-day free trial today. No hidden fees.</p>
                            <Link href="/auth/login" className="btn-primary" style={{ display: 'inline-flex', justifyContent: 'center' }}>
                                Get Started Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer style={{
                textAlign: 'center',
                padding: '40px 5%',
                borderTop: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                fontSize: '0.875rem'
            }}>
                <p>© 2026 Goal Tracker. Built with passion for productivity.</p>
            </footer>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="card" style={{
            padding: '32px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
            }}>
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: 'var(--accent-primary)'
            }}>
                {icon}
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '12px' }}>{title}</h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>{description}</p>
        </div>
    );
}

function StatItem({ value, label }: { value: string; label: string }) {
    return (
        <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '4px' }}>
                {value}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {label}
            </div>
        </div>
    );
}
