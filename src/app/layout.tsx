import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Goal Tracker",
    description: "Track your goals and expenses",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
