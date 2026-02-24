import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, token } = body;

        if (!userId || !token) {
            return NextResponse.json({ error: 'User ID and Token are required' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { pushToken: token }
        });

        return NextResponse.json({ success: true, message: 'Push token saved successfully' });
    } catch (error: any) {
        console.error('Push Token Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
