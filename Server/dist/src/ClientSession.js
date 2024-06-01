"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSession = void 0;
const uuid_1 = require("uuid");
class ClientSession {
    constructor(username) {
        this.username = username;
        this.sessionId = (0, uuid_1.v4)();
    }
    getUsername() {
        return this.username;
    }
    getSessionId() {
        return this.sessionId;
    }
}
exports.ClientSession = ClientSession;
