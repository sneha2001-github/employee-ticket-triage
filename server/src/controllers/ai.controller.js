const { analyzeTicket } = require("../service/openAi");

exports.analyzeTicketController = async (req, res) => {
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({
                message: "Description is required",
            });
        }

        const aiResult = await analyzeTicket(description);
        return res.json(aiResult);
    } catch (error) {
        console.error("AI ERROR:", error);
        return res.status(500).json({
            message: "AI analysis failed",
        });
    }
};
