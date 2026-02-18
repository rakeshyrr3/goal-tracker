import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { name, email, plan, password } = await request.json();

        const user = await prisma.user.create({
            data: {
                name,
                email,
                plan: plan || 'FREE',
                password: password || 'default123',
                role: 'USER'
            }
        });

        return NextResponse.json({ success: true, user });
    } catch (error: any) {
        console.error("[PRISMA ERROR]:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[PRISMA ERROR]:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        console.error("[PRISMA ERROR]:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
