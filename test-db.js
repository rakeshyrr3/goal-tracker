const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking DB connection...");
        const result = await prisma.$queryRaw`SELECT 1`;
        console.log("Connection Success:", result);
    } catch (e) {
        console.error("Connection Failed!");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
