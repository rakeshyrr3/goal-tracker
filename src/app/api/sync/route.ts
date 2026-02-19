import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, goals, expenses, todos } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Sync Goals
        if (goals && Array.isArray(goals)) {
            for (const goal of goals) {
                await prisma.goal.upsert({
                    where: { id: goal.id || 'new' },
                    update: {
                        title: goal.title,
                        type: goal.type,
                        percentage: goal.progress || 0,
                        status: goal.status || 'IN_PROGRESS',
                        targetDate: new Date(goal.dueDate),
                    },
                    create: {
                        userId,
                        title: goal.title,
                        type: goal.type,
                        percentage: goal.progress || 0,
                        status: goal.status || 'IN_PROGRESS',
                        startDate: new Date(),
                        targetDate: new Date(goal.dueDate),
                    }
                });
            }
        }

        // Sync Expenses
        if (expenses && Array.isArray(expenses)) {
            for (const exp of expenses) {
                await prisma.expense.upsert({
                    where: { id: exp.id || 'new' },
                    update: {
                        amount: exp.amount,
                        category: exp.cat,
                        description: exp.desc,
                        date: new Date(exp.date),
                    },
                    create: {
                        userId,
                        amount: exp.amount,
                        category: exp.cat,
                        description: exp.desc,
                        date: new Date(exp.date),
                    }
                });
            }
        }

        // Sync Todos
        if (todos && Array.isArray(todos)) {
            for (const todo of todos) {
                await prisma.todo.upsert({
                    where: { id: todo.id || 'new' },
                    update: {
                        text: todo.text,
                        completed: todo.completed,
                        theme: todo.theme,
                        date: todo.date,
                        time: todo.time,
                    },
                    create: {
                        userId,
                        text: todo.text,
                        completed: todo.completed,
                        theme: todo.theme,
                        date: todo.date,
                        time: todo.time,
                    }
                });
            }
        }

        return NextResponse.json({ success: true, message: 'Sync completed successfully' });
    } catch (error: any) {
        console.error('Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
