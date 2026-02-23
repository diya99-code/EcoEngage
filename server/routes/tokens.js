const express = require('express');
const router = express.Router();
const esClient = require('../config/elasticsearch');

// Simulated External Voucher API (e.g., Brand Deals / Sustainability Partners)
// This is where a real API like Voucherify or a custom brand portal would be called.
const EXTERNAL_BRAND_PORTAL = "https://run.mocky.io/v3/4fc72873-1002-421c-a12b-65c2b0c34567";

router.get('/balance/:userId', async (req, res) => {
    try {
        const result = await esClient.get({ index: 'users', id: req.params.userId });
        res.json(result._source);
    } catch (error) {
        res.json({ tokens: 0, activities: [], vouchers: [] });
    }
});

router.post('/redeem', async (req, res) => {
    const { userId, itemId, cost } = req.body;

    try {
        // 1. Verify User Balance
        const userRes = await esClient.get({ index: 'users', id: userId });
        const user = userRes._source;

        if (user.tokens < cost) {
            return res.status(400).json({ error: 'Insufficient tokens' });
        }

        // 2. [Reliable Action] Trigger external voucher generation
        // We simulate a secure call to a brand partner here
        const generatedCode = 'ECO-' + Math.random().toString(36).toUpperCase().substring(2, 10);

        console.log(`[Reliable Action] Calling ${EXTERNAL_BRAND_PORTAL} to generate voucher for ${userId}`);

        // 3. Persist the redemption in Elasticsearch
        await esClient.update({
            index: 'users',
            id: userId,
            refresh: true,
            script: {
                source: `
          ctx._source.tokens -= params.cost;
          if (ctx._source.vouchers == null) { ctx._source.vouchers = [] }
          ctx._source.vouchers.add(params.voucher);
        `,
                params: {
                    cost,
                    voucher: {
                        itemId,
                        date: new Date(),
                        code: generatedCode,
                        status: 'Active'
                    }
                }
            }
        });

        res.json({
            message: 'Redemption successful!',
            voucherCode: generatedCode
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
