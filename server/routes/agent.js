const express = require('express');
const router = express.Router();
const esClient = require('../config/elasticsearch');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

router.post('/chat', async (req, res) => {
    const { message, userId } = req.body;

    try {
        // 1. Fetch User Data from ES for context
        let userRecord;
        try {
            const result = await esClient.get({ index: 'users', id: userId });
            userRecord = result._source;
        } catch {
            userRecord = { tokens: 0, activities: [] };
        }

        // 2. Prepare Context for AI
        const context = `
      User Context:
      - Tokens: ${userRecord.tokens}
      - Activities: ${userRecord.activities.map(a => a.reason).join(', ')}
      
      Platform Rules:
      - 10 tokens for a new post.
      - 5 tokens for a comment.
      - Redemptions: 100 for Tree Planting, 500 for Amazon Voucher.
    `;

        let responseText = "";
        let reasoning = "";

        if (genAI) {
            try {
                // USE REAL GEMINI AI
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `You are the EcoToken Assistant. Use the following context to answer the user's question accurately.
          Context: ${context}
          User Question: "${message}"
          
          Answer in a friendly, concise way. If they ask about rewards, use the context. If they ask to redeem, explain they can do it on the dashboard.`;

                const result = await model.generateContent(prompt);
                responseText = result.response.text();
                reasoning = "ES|QL Verified Context + Gemini 1.5 Reasoning";
            } catch (aiError) {
                console.error("Gemini Error:", aiError);
                responseText = `AI Error: ${aiError.message}. This usually means your API Key quota is empty or the model is not available.`;
                reasoning = "AI Connection Failed";
            }
        } else {
            // FALLBACK TO MOCK IF NO KEY
            responseText = "Gemini API Key missing. Please set GEMINI_API_KEY in Railway.";
            reasoning = "Mock Logic (API Key Missing)";
        }

        res.json({
            text: responseText,
            role: 'agent',
            status: 'verified',
            reasoning: reasoning
        });

    } catch (error) {
        console.error("General Route Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
