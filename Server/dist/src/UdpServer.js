"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UdpServer = void 0;
const dgram = require("dgram");
const uuid_1 = require("uuid");
const Logger_1 = require("./Logger");
const MatchSession_1 = require("./MatchSession");
const Wrapper_UDP_1 = require("../proto/Wrapper-UDP");
const ClientRequest_UDP_1 = require("../proto/ClientRequest-UDP");
const ServerResponse_UDP_1 = require("../proto/ServerResponse-UDP");
class UdpServer {
    constructor(port) {
        this.maxMatchSessions = 5;
        this.port = port;
        this.server = dgram.createSocket('udp4');
        this.clientSessions = new Map();
        this.matchSessions = new Map();
        this.server.on('error', this.handleError.bind(this));
        this.server.on('message', this.handleMessage.bind(this));
        this.server.on('listening', this.handleListening.bind(this));
        this.logger = new Logger_1.Logger('UDP');
    }
    start() {
        this.server.bind(this.port);
    }
    update() {
        this.matchSessions.forEach((match) => match.update());
    }
    addClientSession(clientSession) {
        this.clientSessions.set(clientSession.getSessionId(), clientSession);
    }
    getClientSession(sessionId) {
        return this.clientSessions.get(sessionId);
    }
    removeClientSession(sessionId) {
        this.clientSessions.delete(sessionId);
    }
    matchRequest(sessionId) {
        var _a;
        const session = this.getClientSession(sessionId);
        if (session === undefined)
            return null;
        for (const [matchId, match] of this.matchSessions) {
            if (match.getJoinableStatus()) {
                this.logger.logInfo('Added client to existing match');
                match.addPlayer(session);
                return matchId;
            }
        }
        if (this.matchSessions.size < this.maxMatchSessions) {
            this.logger.logInfo('Added client to new match');
            const matchId = this.createMatch();
            (_a = this.matchSessions.get(matchId)) === null || _a === void 0 ? void 0 : _a.addPlayer(session);
            return matchId;
        }
        return null;
    }
    createMatch() {
        const match = new MatchSession_1.MatchSession();
        this.matchSessions.set(match.getMatchId(), match);
        return match.getMatchId();
    }
    handleError(error) {
        this.logger.logError('Server error', error);
        this.server.close();
    }
    handleMessage(message, rinfo) {
        try {
            const wrapper = Wrapper_UDP_1.UdpWrapper.decode(message);
            switch (wrapper.payloadType) {
                case Wrapper_UDP_1.UdpWrapper_MessageType.GameStateRequest:
                    this.handleGameStateRequest(ClientRequest_UDP_1.GameStateRequest.decode(wrapper.payload), rinfo);
                    break;
                case Wrapper_UDP_1.UdpWrapper_MessageType.ActionRequest:
                    this.handleActionRequest(ClientRequest_UDP_1.ActionRequest.decode(wrapper.payload), rinfo);
                    break;
                default:
                    this.logger.logError('Invalid enum MessageType');
            }
        }
        catch (error) {
            this.logger.logError('Error decoding message', error);
        }
    }
    handleGameStateRequest(message, rinfo) {
        let response = ServerResponse_UDP_1.GameStateResponse.create({ players: [], coins: [] });
        const matchSessionId = (0, uuid_1.stringify)(message.matchId);
        const matchSession = this.matchSessions.get(matchSessionId);
        if (matchSession === undefined) {
            this.logger.logError('Not a valid match id');
            this.sendMessageBuffer(ServerResponse_UDP_1.GameStateResponse.encode(response).finish(), Wrapper_UDP_1.UdpWrapper_MessageType.GameStateResponse, rinfo);
            return;
        }
        response = matchSession.getGameState();
        this.sendMessageBuffer(ServerResponse_UDP_1.GameStateResponse.encode(response).finish(), Wrapper_UDP_1.UdpWrapper_MessageType.GameStateResponse, rinfo);
    }
    handleActionRequest(message, rinfo) {
        var _a;
        let response = ServerResponse_UDP_1.ActionResponse.create({ success: false });
        const matchSessionId = (0, uuid_1.stringify)(message.matchId);
        const matchSession = this.matchSessions.get(matchSessionId);
        if (matchSession === undefined) {
            this.logger.logError('Not a valid match id');
            this.sendMessageBuffer(ServerResponse_UDP_1.ActionResponse.encode(response).finish(), Wrapper_UDP_1.UdpWrapper_MessageType.ActionResponse, rinfo);
            return;
        }
        const username = (_a = this.clientSessions.get((0, uuid_1.stringify)(message.sessionId))) === null || _a === void 0 ? void 0 : _a.getUsername();
        this.logger.logInfo(`Recieved an ActionRequest from \'${username}\'`);
        response = matchSession.playerAction((0, uuid_1.stringify)(message.sessionId), message);
        this.sendMessageBuffer(ServerResponse_UDP_1.ActionResponse.encode(response).finish(), Wrapper_UDP_1.UdpWrapper_MessageType.ActionResponse, rinfo);
    }
    sendMessageBuffer(payload, messageType, rinfo) {
        try {
            const wrapper = Wrapper_UDP_1.UdpWrapper.create({ payload: payload, payloadType: messageType });
            this.server.send(Wrapper_UDP_1.UdpWrapper.encode(wrapper).finish(), rinfo.port, rinfo.address);
        }
        catch (error) {
            this.logger.logError('Error sending message', error);
        }
    }
    handleListening() {
        const address = this.server.address();
        this.logger.logInfo(`Server listening on port: ${address.port}`);
    }
}
exports.UdpServer = UdpServer;
