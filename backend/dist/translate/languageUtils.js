"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasNonEnglishScript = void 0;
const hasNonEnglishScript = (text) => {
    return /[^\x00-\x7F]/.test(text);
};
exports.hasNonEnglishScript = hasNonEnglishScript;
