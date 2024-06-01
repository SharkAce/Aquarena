"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(prefix) {
        this.prefix = prefix;
    }
    logInfo(message) {
        console.info(`[${this.prefix}] ${message}`);
    }
    logError(message, error) {
        console.error(`[${this.prefix}] ${message}`, error);
    }
}
exports.Logger = Logger;
