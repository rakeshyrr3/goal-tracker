export const syncLocalDataToBackend = async (userId: string) => {
    try {
        const goals = JSON.parse(localStorage.getItem('user_goals') || '[]');
        const expenses = JSON.parse(localStorage.getItem('user_expenses') || '[]');
        const todos = JSON.parse(localStorage.getItem('user_todos') || '[]');

        const response = await fetch('/api/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                goals,
                expenses,
                todos,
            }),
        });

        if (!response.ok) {
            throw new Error('Sync failed');
        }

        const result = await response.json();
        console.log('Backend Sync Result:', result);
        return result;
    } catch (error) {
        console.error('Local to Backend Sync Error:', error);
        throw error;
    }
};
