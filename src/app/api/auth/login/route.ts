import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { identifier, password } = body;

        if (!identifier || !password) {
            return NextResponse.json({ error: 'Credentials are required' }, { status: 400 });
        }

        // Search by email
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    // In a production app, we would also check for mobile
                ]
            }
        });

        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            userId: user.id,
            name: user.name,
            message: 'Login successful'
        });
    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
