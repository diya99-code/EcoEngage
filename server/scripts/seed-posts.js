const esClient = require('../config/elasticsearch');

async function seed() {
    try {
        console.log('Seeding initial posts...');

        const posts = [
            {
                title: "The Silent Roar: Royal Bengal Tigers",
                content: "The Royal Bengal Tiger is a symbol of resilience. Despite poaching threats, conservation efforts in the Sundarbans have shown promising results. We must protect their corridors to ensure genetic diversity.",
                authorId: "eco_warrior_01",
                species: "Tiger",
                createdAt: new Date(),
                likes: 42,
                comments: []
            },
            {
                title: "Rhino Conservation: Modern Technology to the Rescue",
                content: "From satellite tracking to AI-powered drones, technology is helping rangers protect rhinos in South Africa. Every horn saved is a victory for biodiversity.",
                authorId: "tech_extra",
                species: "Rhino",
                createdAt: new Date(),
                likes: 85,
                comments: []
            },
            {
                title: "The Plight of the Pangolin",
                content: "Pangolins are the most trafficked mammals in the world. Often called 'scaly anteaters', they play a crucial role in maintaining soil health.",
                authorId: "wildlife_eye",
                species: "Pangolin",
                createdAt: new Date(),
                likes: 120,
                comments: []
            }
        ];

        for (const post of posts) {
            await esClient.index({
                index: 'posts',
                document: post
            });
            console.log(`Indexed: ${post.title}`);
        }

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
