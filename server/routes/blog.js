const express = require('express');
const router = express.Router();
const esClient = require('../config/elasticsearch');

// Helper to award tokens
async function awardTokens(userId, amount, reason) {
    try {
        const userExists = await esClient.exists({ index: 'users', id: userId });
        if (!userExists) {
            await esClient.index({
                index: 'users',
                id: userId,
                document: { userId, tokens: amount, activities: [{ reason, amount, date: new Date() }] }
            });
        } else {
            await esClient.update({
                index: 'users',
                id: userId,
                script: {
                    source: `
            ctx._source.tokens += params.amount;
            if (ctx._source.activities == null) { ctx._source.activities = [] }
            ctx._source.activities.add(params.activity);
          `,
                    params: {
                        amount,
                        activity: { reason, amount, date: new Date() }
                    }
                }
            });
        }
    } catch (e) {
        console.error('Token award failed:', e);
    }
}

// Get all posts
router.get('/posts', async (req, res) => {
    try {
        const result = await esClient.search({
            index: 'posts',
            query: { match_all: {} }
        });
        res.json(result.hits.hits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a post
router.post('/posts', async (req, res) => {
    try {
        const { title, content, authorId, species } = req.body;
        const result = await esClient.index({
            index: 'posts',
            document: {
                title,
                content,
                authorId,
                species,
                createdAt: new Date(),
                likes: 0,
                comments: []
            }
        });

        // AWARD 10 TOKENS FOR POSTING
        await awardTokens(authorId, 10, `Posted about ${species}`);

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Like a post
router.post('/posts/:id/like', async (req, res) => {
    try {
        await esClient.update({
            index: 'posts',
            id: req.params.id,
            refresh: true,
            script: { source: "ctx._source.likes += 1", lang: "painless" }
        });
        res.json({ message: 'Post liked!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Comment on a post
router.post('/posts/:id/comment', async (req, res) => {
    try {
        const { text, authorId } = req.body;
        await esClient.update({
            index: 'posts',
            id: req.params.id,
            refresh: true,
            script: {
                source: "if (ctx._source.comments == null) { ctx._source.comments = [] } ctx._source.comments.add(params.comment)",
                params: { comment: { text, authorId, createdAt: new Date() } }
            }
        });

        // AWARD 5 TOKENS FOR COMMENTING
        await awardTokens(authorId, 5, 'Commented on a post');

        res.json({ message: 'Comment added!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
