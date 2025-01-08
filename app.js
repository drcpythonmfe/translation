const express = require('express');
const translate = require('translate-google');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

const TranslationService = {
    async translateText(text, targetLang) {
        try {
            const result = await translate(String(text), { to: targetLang });
            return result;
        } catch (error) {
            console.error('Translation error:', error);
            throw error;
        }
    }
};

app.post('/api/translate/text', async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;

        if (!text || !targetLanguage) {
            return res.status(400).json({
                success: false,
                error: 'Text and target language are required'
            });
        }

        const translatedText = await TranslationService.translateText(text, targetLanguage);

        return res.status(200).json({
            success: true,
            data: {
                original: text,
                translated: translatedText,
                targetLanguage
            }
        });
    } catch (error) {
        console.error('Translation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Translation failed',
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
