import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { event, user, status } = body;

        console.log(`[EVENT SYNC]: ${event} by ${user} (${status})`);

        // demonstrated database connection check
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
    } catch (error) {
        console.error("[PRISMA SYNC ERROR]:", error);
        return NextResponse.json({ success: false, error: 'Database sync lost' }, { status: 500 });
    }
}
