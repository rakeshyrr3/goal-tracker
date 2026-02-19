"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Phone, Calendar, Lock,
    ArrowRight, ChevronLeft, Shield, Check,
    X, FileText
} from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        dob: "",
        password: "",
        acceptTerms: false
    });
    const [showTerms, setShowTerms] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.acceptTerms) {
            alert("Please accept the Terms & Conditions to continue.");
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Signup failed');
            }

            // Save essential info to localStorage for session management
            localStorage.setItem('user_id', result.userId);
            localStorage.setItem('user_name', formData.name);
            localStorage.setItem('is_logged_in', 'true');

            router.push('/auth/onboarding');
        } catch (error: any) {
            alert(error.message);
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
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Create Account</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Get started with your goal tracking journey</p>
                    </div>

                    <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Name */}
                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    required
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Mobile & DOB row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Mobile</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        required
                                        type="tel"
                                        placeholder="Mobile"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>DOB</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        required
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        style={{ ...inputStyle, paddingLeft: '44px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Create Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '8px' }}>
                            <div
                                onClick={() => setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '6px',
                                    border: `2px solid ${formData.acceptTerms ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                    backgroundColor: formData.acceptTerms ? 'var(--accent-primary)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    flexShrink: 0
                                }}
                            >
                                {formData.acceptTerms && <Check size={16} color="white" />}
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                                I agree to the <span onClick={() => setShowTerms(true)} style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Terms & Conditions</span> and understand how my data will be used.
                            </p>
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '12px', justifyContent: 'center', padding: '18px' }}>
                            Create Account <ArrowRight size={20} />
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Already have an account? <Link href="/auth/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
                    </p>
                </div>
            </motion.div>

            {/* Terms Modal */}
            <AnimatePresence>
                {showTerms && (
                    <div className="modal-overlay" onClick={() => setShowTerms(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="modal-content"
                            style={{ maxWidth: '500px', padding: '0', overflow: 'hidden' }}
                        >
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Shield size={24} color="var(--accent-primary)" />
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Terms & Data Usage</h3>
                                </div>
                                <button onClick={() => setShowTerms(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    <X size={24} />
                                </button>
                            </div>
                            <div style={{ padding: '32px', maxHeight: '400px', overflowY: 'auto', color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                                <p style={{ color: 'white', fontWeight: 700, marginBottom: '16px' }}>How we use your personal data:</p>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px' }}>
                                    <li><strong>Account Management:</strong> We use your name, email, and mobile number to create and secure your account.</li>
                                    <li><strong>Personalization:</strong> Your DOB is used to provide age-appropriate goal suggestions and insights.</li>
                                    <li><strong>Notifications:</strong> We may send updates about your goals and account status via email or mobile.</li>
                                    <li><strong>Analytics:</strong> Anonymous data is used to improve the app experience and performance.</li>
                                    <li><strong>Security:</strong> We implement industry-standard encryption to protect your password and personal records.</li>
                                </ul>
                                <p style={{ marginTop: '24px' }}>By using Goal Tracker, you agree to store your goal data and expense records in our secure cloud database for synchronization across your devices.</p>
                            </div>
                            <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                                <button onClick={() => { setShowTerms(false); setFormData({ ...formData, acceptTerms: true }); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    I Understand & Accept
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
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
