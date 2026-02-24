import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { messaging } from '@/lib/firebase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, message } = body;

        if (!title || !message) {
            return NextResponse.json({ error: 'Title and Message are required' }, { status: 400 });
        }

        // Get all users who have a push token
        const users = await prisma.user.findMany({
            where: {
                pushToken: {
                    not: null
                }
            },
            select: {
                pushToken: true
            }
        });

        const tokens = users.map(u => u.pushToken as string).filter(t => t);

        if (tokens.length === 0) {
            return NextResponse.json({ success: true, message: 'No devices registered for notifications' });
        }

        // Firing the notification (Batch send)
        const response = await messaging.sendEachForMulticast({
            tokens: tokens,
            notification: {
                title: title,
                body: message,
            },
            data: {
                url: '/dashboard' // Optional: where to redirect if clicked
            }
        });

        return NextResponse.json({
            success: true,
            message: `Successfully sent to ${response.successCount} devices`,
            failureCount: response.failureCount
        });

    } catch (error: any) {
        console.error('Broadcast Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
