"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import {
    X,
    User,
    Shield,
    Camera,
    LayoutDashboard,
    Target,
    Wallet,
    CheckSquare,
    Menu,
    LogOut,
    Share2,
    HelpCircle,
    Mail,
    CreditCard as PlanIcon,
    Clock,
    Star,
    Trash2,
    Facebook,
    Instagram,
    Youtube,
    ExternalLink,
    ChevronRight,
    Award
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFAQOpen, setIsFAQOpen] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [userName, setUserName] = useState("Rakesh");
    const [bio, setBio] = useState("Entrepreneur & Product Designer. Passionate about productivity and scaling startups.");
    const [profileImage, setProfileImage] = useState<string | null>(null);

    // Persistence for Profile
    useEffect(() => {
        const savedName = localStorage.getItem('user_name');
        const savedBio = localStorage.getItem('user_bio');
        const savedImg = localStorage.getItem('user_profile_img');
        if (savedName) setUserName(savedName);
        if (savedBio) setBio(savedBio);
        if (savedImg) setProfileImage(savedImg);
    }, []);

    useEffect(() => {
        localStorage.setItem('user_name', userName);
        localStorage.setItem('user_bio', bio);
        if (profileImage) localStorage.setItem('user_profile_img', profileImage);
    }, [userName, bio, profileImage]);

    // Razorpay script injection
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        // Basic Auth Check
        const isAuthenticated = localStorage.getItem('is_logged_in');
        if (!isAuthenticated) {
            router.push('/auth/login');
        }

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRestart = async () => {
        if (confirm("Are you sure? This will permanently delete all your goals and expenses from both your phone and our database.")) {
            try {
                const userId = localStorage.getItem('user_id');
                if (userId) {
                    await fetch('/api/auth/reset', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId })
                    });
                }
                localStorage.removeItem('user_goals');
                localStorage.removeItem('user_expenses');
                localStorage.removeItem('user_todos');
                localStorage.removeItem('last_sync_time');
                window.location.reload();
            } catch (error) {
                console.error("Failed to reset data:", error);
                alert("Something went wrong while resetting data. Please try again.");
            }
        }
    };

    const handleManageSubscription = () => {
        alert("Managing subscription via Razorpay...");
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Goal Tracker',
                text: 'Check out this awesome productivity app!',
                url: window.location.origin,
            }).catch(console.error);
        } else {
            alert("Share this link: " + window.location.origin);
        }
    };

    const navItems = [
        { name: "Dash", path: "/dashboard", icon: LayoutDashboard },
        { name: "Goals", path: "/dashboard/goals", icon: Target },
        { name: "To-Do", path: "/dashboard/todo", icon: CheckSquare },
        { name: "Spend", path: "/dashboard/expenses", icon: Wallet },
    ];

    return (
        <div className="app-container">
            <Sidebar />

            <main className="main-content">
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '32px'
                }}>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{userName}</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                backgroundColor: 'var(--glass-bg)',
                                border: '1px solid var(--border-color)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                            <Menu size={20} />
                        </button>
                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--glass-bg)',
                                border: '2px solid var(--accent-primary)',
                                cursor: 'pointer',
                                padding: 0,
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span style={{ fontWeight: 800, color: 'white', fontSize: '0.75rem' }}>{userName.substring(0, 2).toUpperCase()}</span>
                            )}
                        </button>
                    </div>
                </header>

                {children}

                {/* Hamburger Menu Sidebar */}
                {isMenuOpen && (
                    <div className="modal-overlay" onClick={() => setIsMenuOpen(false)} style={{ justifyContent: 'flex-start', alignItems: 'stretch', padding: 0 }}>
                        <div
                            className="menu-drawer no-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                width: '310px',
                                backgroundColor: '#0f0f13',
                                borderRight: '1px solid rgba(255,255,255,0.05)',
                                height: '100%',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                animation: 'slideIn 0.3s ease-out',
                                overflowY: 'auto'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Target color="white" size={20} />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Goal Tracker</h3>
                                </div>
                                <button onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
                            </div>

                            {/* Section 1: Core Actions */}
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <MenuRow icon={<PlanIcon size={18} color="var(--accent-primary)" />} label="Plan Details" onClick={() => alert("You are on Pro Plan!")} />
                                <MenuRow icon={<Clock size={18} color="#ef4444" />} label="Restart From Today" onClick={handleRestart} color="#ef4444" />
                            </div>

                            {/* Section 2: Support */}
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <MenuRow icon={<HelpCircle size={18} color="#8b5cf6" />} label="FAQS" onClick={() => setIsFAQOpen(true)} />
                                <MenuRow icon={<Star size={18} color="#f59e0b" />} label="Rate us" onClick={() => alert("Redirecting to playstore...")} />
                                <MenuRow icon={<Share2 size={18} color="#10b981" />} label="App Share" onClick={handleShare} />
                            </div>

                            {/* Section 2: Legal */}
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <MenuRow label="Terms & Conditions" onClick={() => setIsTermsOpen(true)} />
                                <MenuRow label="Privacy Policy" onClick={() => setIsTermsOpen(true)} />
                            </div>

                            {/* Section 3: Socials */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                <SocialCard icon={<Facebook size={20} fill="#1877F2" color="#1877F2" />} label="Facebook" color="#1877F2" />
                                <SocialCard icon={<Instagram size={20} color="#E4405F" />} label="Instagram" color="#E4405F" />
                                <SocialCard icon={<Youtube size={20} fill="#FF0000" color="#FF0000" />} label="YouTube" color="#FF0000" />
                            </div>

                            {/* Section 4: Critical Actions */}
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <MenuRow icon={<Trash2 size={18} color="#ef4444" />} label="Delete My Account" onClick={() => alert("Contact support to delete account.")} color="#ef4444" />
                                <MenuRow icon={<LogOut size={18} color="#ef4444" />} label="Log out" onClick={() => {
                                    localStorage.clear();
                                    router.push('/auth/login');
                                }} color="#ef4444" />
                            </div>

                            {/* Coming Soon Feature */}
                            <div style={{
                                padding: '20px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1))',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                                textAlign: 'center',
                                marginTop: '10px'
                            }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Create Your Success Badge in 1 Minute</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Coming soon for our top goal achievers!</p>
                                <div style={{ display: 'inline-flex', padding: '6px 12px', borderRadius: '20px', backgroundColor: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: 700 }}>EXCLUSVE</div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: 'auto', paddingBottom: '10px' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>App Version 1.0.2+42</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* FAQ Modal */}
                {isFAQOpen && (
                    <div className="modal-overlay" onClick={() => setIsFAQOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Frequently Asked Questions</h3>
                                <button onClick={() => setIsFAQOpen(false)}><X size={20} /></button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                <div>
                                    <p style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>How to sync my data?</p>
                                    <p>Your data syncs automatically every time you log in or add an expense/goal.</p>
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>Is the app free to use?</p>
                                    <p>We are currently in a free-to-use early adopter phase. Enjoy all Pro features!</p>
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>Can I export my reports?</p>
                                    <p>Yes, go to the Spend tab and click "Export PDF" to download your monthly report.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Terms Modal */}
                {isTermsOpen && (
                    <div className="modal-overlay" onClick={() => setIsTermsOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Terms & Privacy</h3>
                                <button onClick={() => setIsTermsOpen(false)}><X size={20} /></button>
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                <p>By using Goal Tracker, you agree to store your data locally and on our secure cloud. We do not sell your personal spending data to third parties. Your privacy is our priority.</p>
                                <p style={{ marginTop: '12px' }}>Full policy can be found at: goaltracker.com/legal</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Modal */}
                {isProfileModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
                        <div className="modal-content" onClick={(e: React.MouseEvent) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Profile Settings</h3>
                                <button onClick={() => setIsProfileModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={24} /></button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--glass-bg)',
                                        border: '4px solid var(--border-color)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile Large"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>{userName.substring(0, 2).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <label htmlFor="profile-upload" style={{
                                        position: 'absolute',
                                        bottom: '4px',
                                        right: '4px',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--accent-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                    }}>
                                        <Camera size={18} />
                                        <input
                                            id="profile-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                                <h4 style={{ marginTop: '16px', fontSize: '1.125rem', fontWeight: 700 }}>{userName}</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Pro Member since Oct 2024</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                                    <input
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Bio</label>
                                    <textarea
                                        style={{
                                            height: '80px',
                                            backgroundColor: 'var(--glass-bg)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            color: 'white',
                                            fontSize: '0.875rem',
                                            fontFamily: 'inherit',
                                            resize: 'none'
                                        }}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div className="card" style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Shield size={18} color="var(--accent-primary)" />
                                            <span style={{ fontWeight: 700, fontSize: '0.925rem' }}>Current Plan</span>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--accent-primary)', color: 'white', fontWeight: 600 }}>PRO</span>
                                    </div>
                                    <button
                                        onClick={handleManageSubscription}
                                        style={{ marginTop: '12px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Manage Subscription
                                    </button>
                                </div>

                                <button className="btn-primary" onClick={() => setIsProfileModalOpen(false)} style={{ justifyContent: 'center' }}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Bottom Navigation */}
                <nav className="mobile-nav">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <item.icon size={24} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </main>
        </div>
    );
}

function MenuRow({ icon, label, onClick, color = 'white' }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '14px 12px',
                borderRadius: '12px',
                border: 'none',
                background: 'none',
                color: color,
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s',
                borderBottom: '1px solid rgba(255,255,255,0.03)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {icon}
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
        </button>
    );
}

function SocialCard({ icon, label, color }: any) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            padding: '16px 10px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
            cursor: 'pointer'
        }}>
            {icon}
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
        </div>
    )
}
