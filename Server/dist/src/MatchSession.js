"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchSession = void 0;
const uuid_1 = require("uuid");
const ServerResponse_UDP_1 = require("../proto/ServerResponse-UDP");
const ServerResponse_UDP_2 = require("../proto/ServerResponse-UDP");
const ServerResponse_UDP_3 = require("../proto/ServerResponse-UDP");
const ServerResponse_UDP_4 = require("../proto/ServerResponse-UDP");
class MatchSession {
    constructor() {
        this.players = new Map();
        this.coins = new Array();
        this.matchId = (0, uuid_1.v4)();
        this.joinable = true;
    }
    update() {
        this.players.forEach((player) => player.update());
    }
    getMatchId() {
        return this.matchId;
    }
    getJoinableStatus() {
        return this.joinable;
    }
    getGameState() {
        const playerMessages = Array.from(this.players.values()).map(player => player.getMessage());
        //console.log("Player count:", this.players.size);
        const coinMessages = this.coins.map((coin) => coin.getMessage());
        return ServerResponse_UDP_2.GameStateResponse.create({
            players: playerMessages,
            coins: coinMessages
        });
    }
    addPlayer(clientSession) {
        const player = new Player(clientSession.getUsername());
        this.players.set(clientSession.getSessionId(), player);
    }
    playerAction(sessionId, actionRequest) {
        let response = ServerResponse_UDP_1.ActionResponse.create({ success: false });
        if (!this.players.has(sessionId))
            return response;
        const player = this.players.get(sessionId);
        player === null || player === void 0 ? void 0 : player.setTargetPos(actionRequest.targetX, actionRequest.targetY);
        response.success = true;
        return response;
    }
}
exports.MatchSession = MatchSession;
class Player {
    constructor(username) {
        this.username = username;
        this.posX = 100;
        this.posY = 100;
        this.targetPosX = 100;
        this.targetPosY = 100;
        this.speed = 5;
    }
    update() {
        const { x, y } = this.updatePosition(this.posX, this.posY, this.targetPosX, this.targetPosY, this.speed);
        this.posX = x;
        this.posY = y;
    }
    setTargetPos(posX, posY) {
        this.targetPosX = posX;
        this.targetPosY = posY;
    }
    getPosition() {
        return { posX: this.posX, posY: this.posY };
    }
    getMessage() {
        return ServerResponse_UDP_4.GameStateResponse_Player.create({
            username: this.username,
            positionX: this.posX,
            positionY: this.posY,
        });
    }
    updatePosition(posX, posY, targetPosX, targetPosY, speed) {
        const deltaX = targetPosX - posX;
        const deltaY = targetPosY - posY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance === 0 || distance < speed) {
            return { x: targetPosX, y: targetPosY };
        }
        const directionX = deltaX / distance;
        const directionY = deltaY / distance;
        const newPosX = posX + directionX * speed;
        const newPosY = posY + directionY * speed;
        return { x: newPosX, y: newPosY };
    }
}
class Coin {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }
    getPosition() {
        return { posX: this.posX, posY: this.posY };
    }
    getMessage() {
        return ServerResponse_UDP_3.GameStateResponse_Coin.create({
            positionX: this.posX,
            positionY: this.posY
        });
    }
}
