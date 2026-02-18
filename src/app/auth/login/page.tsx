"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Phone, Mail, ChevronRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [authMethod, setAuthMethod] = useState<'phone' | 'google'>('google');
    const [step, setStep] = useState<'details' | 'otp' | 'payment'>('details');
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const handleLoginSuccess = () => {
        localStorage.setItem('is_logged_in', 'true');
        localStorage.setItem('user_plan', 'trial');
        localStorage.setItem('trial_start_date', new Date().toISOString());
        router.push('/dashboard');
    };

    const handlePaymentAndStart = () => {
        // Here we would normally call Razorpay
        alert("Connecting to Razorpay... (Demo Mode)");
        handleLoginSuccess();
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'inherit'
        }}>
            <div className="card" style={{
                maxWidth: '450px',
                width: '100%',
                padding: '40px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border-color)',
                borderRadius: '32px'
            }}>
                {step === 'details' && (
                    <>
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
                            <LogIn size={32} color="white" />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Choose your login method to continue</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <button
                                onClick={() => setStep('payment')} // Simulating google login success -> payment
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'white',
                                    color: '#000',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                <img src="https://www.google.com/favicon.ico" width="20" alt="Google" />
                                Continue with Google
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '8px 0' }}>
                                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Phone size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '16px 16px 16px 48px',
                                        borderRadius: '16px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-color)',
                                        color: 'white'
                                    }}
                                />
                            </div>

                            <button
                                onClick={() => setStep('otp')}
                                className="btn-primary"
                                style={{ justifyContent: 'center', padding: '16px' }}
                            >
                                Send OTP <ChevronRight size={18} />
                            </button>
                        </div>
                    </>
                )}

                {step === 'otp' && (
                    <>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '20px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: 'var(--accent-primary)'
                        }}>
                            <ShieldCheck size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Verify OTP</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>We sent a code to {phone}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <input
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    textAlign: 'center',
                                    letterSpacing: '8px',
                                    fontSize: '1.5rem',
                                    borderRadius: '16px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--accent-primary)',
                                    color: 'white'
                                }}
                            />

                            <button
                                onClick={() => setStep('payment')}
                                className="btn-primary"
                                style={{ justifyContent: 'center', padding: '16px' }}
                            >
                                Verify & Continue
                            </button>

                            <button
                                onClick={() => setStep('details')}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                Change Phone Number
                            </button>
                        </div>
                    </>
                )}

                {step === 'payment' && (
                    <>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(16, 185, 129, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: 'var(--success)'
                        }}>
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>3-Day Free Trial</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Experience full access. No charge for 3 days.</p>

                        <div className="card" style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '24px',
                            textAlign: 'left',
                            marginBottom: '32px',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700 }}>Pro Subscription</span>
                                <span style={{ color: 'var(--success)', fontWeight: 700 }}>₹0.00</span>
                            </div>
                            <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li style={{ display: 'flex', gap: '8px' }}>• Unlimited Goal Tracking</li>
                                <li style={{ display: 'flex', gap: '8px' }}>• Themed To-Do Widgets</li>
                                <li style={{ display: 'flex', gap: '8px' }}>• Advanced Expense Export</li>
                            </ul>
                        </div>

                        <button
                            onClick={handlePaymentAndStart}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                padding: '16px',
                                background: 'linear-gradient(135deg, #10b981, #059669)'
                            }}
                        >
                            Start Free Trial
                        </button>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px' }}>
                            You will be charged ₹999/year after 3 days. Cancel anytime.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
