import { Translate } from "@google-cloud/translate/build/src/v2";
import { TranslationResult } from "./types/translation";
import { hasNonEnglishScript } from "./languageUtils";
import { env } from "process";

const translate = new Translate({
  key: env.GOOGLE_API_KEY,
});

export const smartTranslate = async (
  text: string
): Promise<TranslationResult> => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error("Empty text");
    }

    //Clearly non-English script → translate directly
    if (hasNonEnglishScript(text)) {
      const [translation, metadata]: any = await translate.translate(text, {
        to: "en",
      });

      return {
        originalText: text,
        translatedText: translation,
        language: metadata.data.translations[0].detectedSourceLanguage,
      };
    }

    // English letters , detect using metadata
    const [translation, metadata]: any = await translate.translate(text, {
      to: "en",
    });

    const detectedLanguage =
      metadata.data.translations[0].detectedSourceLanguage;

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
  } catch (error) {
    console.error("Translation Error:", error);

    // Fallback 
    return {
      originalText: text,
      translatedText: text,
      language: "unknown",
    };
  }
};