"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target, TrendingUp, Zap, Clock,
    ChevronRight, ChevronLeft, Check,
    Search, Users, Smartphone, Globe, Star
} from "lucide-react";

const STEPS = [
    {
        id: "primary_goal",
        title: "What's your main focus?",
        description: "Choose your primary objective to help us customize your experience.",
        options: [
            { id: "wealth", label: "Financial Freedom", icon: <TrendingUp size={24} /> },
            { id: "health", label: "Health & Fitness", icon: <Target size={24} /> },
            { id: "career", label: "Career Growth", icon: <Zap size={24} /> },
            { id: "habit", label: "New Habit Building", icon: <Clock size={24} /> }
        ]
    },
    {
        id: "how_did_you_hear",
        title: "How did you hear about us?",
        description: "Your answer helps us reach more people wanting to crush their goals.",
        options: [
            { id: "insta", label: "Instagram", icon: <Smartphone size={24} /> },
            { id: "google", label: "Google Search", icon: <Search size={24} /> },
            { id: "friend", label: "Friend / Referral", icon: <Users size={24} /> },
            { id: "ad", label: "Online Advertisement", icon: <Globe size={24} /> },
            { id: "other", label: "Other", icon: <Star size={24} /> }
        ]
    }
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState<Record<string, string>>({});

    const handleSelect = (optionId: string) => {
        const stepId = STEPS[currentStep].id;
        setSelections({ ...selections, [stepId]: optionId });

        // Auto-advance after small delay
        setTimeout(() => {
            if (currentStep < STEPS.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                router.push('/dashboard');
            }
        }, 400);
    };

    const step = STEPS[currentStep];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        }}>
            <div style={{ maxWidth: '600px', width: '100%' }}>
                {/* Progress Bar */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '48px' }}>
                    {STEPS.map((_, i) => (
                        <div key={i} style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            backgroundColor: i <= currentStep ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                            transition: 'all 0.3s'
                        }} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>{step.title}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '40px' }}>{step.description}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {step.options.map((option) => {
                                const isSelected = selections[step.id] === option.id;
                                return (
                                    <motion.div
                                        key={option.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSelect(option.id)}
                                        style={{
                                            padding: '24px',
                                            borderRadius: '24px',
                                            backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                                            border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '14px',
                                            backgroundColor: isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: isSelected ? 'white' : 'var(--text-muted)'
                                        }}>
                                            {option.icon}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>{option.label}</span>
                                            {isSelected && <Check size={20} color="var(--accent-primary)" />}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        disabled={currentStep === 0}
                        onClick={() => setCurrentStep(currentStep - 1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: currentStep === 0 ? 'transparent' : 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 600
                        }}
                    >
                        <ChevronLeft size={20} /> Back
                    </button>

                    <button
                        onClick={() => router.push('/dashboard')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
}
