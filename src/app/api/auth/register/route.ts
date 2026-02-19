import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, mobile, dob } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password, // Note: In a real app, hash this password with bcrypt!
                role: 'USER',
                plan: 'FREE'
            }
        });

        return NextResponse.json({
            success: true,
            userId: user.id,
            message: 'User registered successfully'
        });
    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
