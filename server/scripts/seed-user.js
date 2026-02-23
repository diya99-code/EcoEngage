const esClient = require('../config/elasticsearch');

async function seedUser() {
    const userId = "DemoUser_123";
    try {
        console.log(`Seeding demo user: ${userId}...`);
        await esClient.index({
            index: 'users',
            id: userId,
            document: {
                userId,
                tokens: 150,
                activities: [
                    { reason: "Welcome Bonus", amount: 100, date: new Date() },
                    { reason: "Identity Verified by EcoToken Agent", amount: 50, date: new Date() }
                ],
                vouchers: []
            }
        });
        console.log('User seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding user failed:', err);
        process.exit(1);
    }
}

seedUser();
