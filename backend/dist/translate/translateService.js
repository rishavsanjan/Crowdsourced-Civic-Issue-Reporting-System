"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartTranslate = void 0;
const v2_1 = require("@google-cloud/translate/build/src/v2");
const languageUtils_1 = require("./languageUtils");
const process_1 = require("process");
const translate = new v2_1.Translate({
    key: process_1.env.GOOGLE_API_KEY,
});
const smartTranslate = async (text) => {
    try {
        if (!text || text.trim().length === 0) {
            throw new Error("Empty text");
        }
        //Clearly non-English script → translate directly
        if ((0, languageUtils_1.hasNonEnglishScript)(text)) {
            const [translation, metadata] = await translate.translate(text, {
                to: "en",
            });
            return {
                originalText: text,
                translatedText: translation,
                language: metadata.data.translations[0].detectedSourceLanguage,
            };
        }
        // English letters , detect using metadata
        const [translation, metadata] = await translate.translate(text, {
            to: "en",
        });
        const detectedLanguage = metadata.data.translations[0].detectedSourceLanguage;
        // Skip translation if already English
        if (detectedLanguage === "en") {
            return {
                originalText: text,
                translatedText: text,
                language: "en",
            };
        }
        return {
            originalText: text,
            translatedText: translation,
            language: detectedLanguage,
        };
    }
    catch (error) {
        console.error("Translation Error:", error);
        // Fallback 
        return {
            originalText: text,
            translatedText: text,
            language: "unknown",
        };
    }
};
exports.smartTranslate = smartTranslate;
