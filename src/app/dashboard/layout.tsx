"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import {
    X,
    User,
    Shield,
    CreditCard,
    Camera,
    LayoutDashboard,
    Target,
    Wallet,
    BarChart3,
    CheckSquare
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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

    const handleManageSubscription = () => {
        alert("You are currently using the Goal Tracker Pro version for free! Enjoy all premium features as our early adopter. Thank you for being with us! \ud83d\ude80");
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
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{
                            textAlign: 'right',
                            display: 'none' // Hide plan text on very small headers
                        }} className="hide-on-mobile">
                            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Pro Plan</p>
                        </div>
                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            style={{
                                width: '48px', // Increased size for clarity
                                height: '48px',
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
                                <span style={{ fontWeight: 800, color: 'white' }}>{userName.substring(0, 2).toUpperCase()}</span>
                            )}
                        </button>
                    </div>
                </header>

                {children}

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
            </main>
        </div>
    );
}
