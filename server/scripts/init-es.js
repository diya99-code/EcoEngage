const esClient = require('../config/elasticsearch');

async function init() {
    try {
        console.log('Checking Elasticsearch connection...');
        const info = await esClient.info();
        console.log('Connected to Elasticsearch:', info.name);

        // Create 'posts' index
        console.log('Creating "posts" index...');
        await esClient.indices.create({
            index: 'posts',
            body: {
                mappings: {
                    properties: {
                        title: { type: 'text' },
                        content: { type: 'text' },
                        authorId: { type: 'keyword' },
                        species: { type: 'keyword' },
                        createdAt: { type: 'date' },
                        likes: { type: 'integer' },
                        comments: { type: 'nested' }
                    }
                }
            }
        }, { ignore: [400] });

        // Create 'users' index
        console.log('Creating "users" index...');
        await esClient.indices.create({
            index: 'users',
            body: {
                mappings: {
                    properties: {
                        userId: { type: 'keyword' },
                        username: { type: 'keyword' },
                        password: { type: 'keyword' },
                        email: { type: 'keyword' },
                        tokens: { type: 'integer' },
                        impactScore: { type: 'float' }
                    }
                }
            }
        }, { ignore: [400] });

        console.log('Initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error('Initialization failed:', error);
        process.exit(1);
    }
}

init();
