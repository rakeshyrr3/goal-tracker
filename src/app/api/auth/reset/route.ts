import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Delete all related data for this user
        // Order matters if there are foreign key constraints
        await prisma.goal.deleteMany({ where: { userId } });
        await prisma.expense.deleteMany({ where: { userId } });
        await prisma.todo.deleteMany({ where: { userId } });

        return NextResponse.json({ success: true, message: 'All user data has been reset successfully' });
    } catch (error: any) {
        console.error('Reset Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
