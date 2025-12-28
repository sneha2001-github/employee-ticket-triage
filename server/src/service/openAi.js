const OpenAI = require("openai");

let client = null;

if (process.env.OPENAI_API_KEY) {
    client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY?.slice(0, 5));
console.log("CLIENT CREATED:", !!client);

exports.analyzeTicket = async (description) => {
    if (!client) {
        return {
            summary: "AI service unavailable. Showing fallback analysis.",
            suggestedPriority: "Medium",
            suggestedCategory: "General",
        };
    }

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are an IT support assistant.
Return JSON with keys:
- summary
- priority (Low | Medium | High)
- category (IT | HR | General | Finance)
`,
                },
                {
                    role: "user",
                    content: description,
                },
            ],
            max_tokens: 100,
        });

        const aiText = response.choices[0].message.content;

        let parsed;
        try {
            parsed = JSON.parse(aiText);
        } catch {
            parsed = null;
        }

        return (
            parsed ?? {
                summary: aiText,
                suggestedPriority: "Medium",
                suggestedCategory: "General",
            }
        );
    } catch (err) {
        console.error("OpenAI failed:", err.message);
        if (err.status === 429) {
            return {
                summary: "AI quota exceeded. Using default analysis.",
                suggestedPriority: "Medium",
                suggestedCategory: "General",
            };
        }

        return {
            summary: "AI analysis failed. Please review manually.",
            suggestedPriority: "Low",
            suggestedCategory: "General",
        };
    }
};
