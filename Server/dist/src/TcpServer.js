"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpServer = void 0;
const net = require("net");
const Logger_1 = require("./Logger");
const ClientSession_1 = require("./ClientSession");
const uuid_1 = require("uuid");
const Wrapper_TCP_1 = require("../proto/Wrapper-TCP");
const ClientRequest_TCP_1 = require("../proto/ClientRequest-TCP");
const ServerResponse_TCP_1 = require("../proto/ServerResponse-TCP");
class TcpServer {
    constructor(port, udpServer) {
        this.port = port;
        this.udpServer = udpServer;
        this.server = net.createServer(this.handleConnection.bind(this));
        this.logger = new Logger_1.Logger("TCP");
    }
    start() {
        this.server.listen(this.port, () => {
            this.logger.logInfo(`Server listening on port: ${this.port}`);
        });
    }
    update() {
        // This function will update messages and matchmaking queues in the future
        return;
    }
    sendMessageBuffer(socket, payload, messageType) {
        try {
            const wrapper = Wrapper_TCP_1.TcpWrapper.create({ payload: payload, payloadType: messageType });
            if (socket.write(Wrapper_TCP_1.TcpWrapper.encode(wrapper).finish())) {
                this.logger.logInfo('Message sent.');
            }
            else {
                this.logger.logError('Message was not sent');
            }
        }
        catch (error) {
            this.logger.logError('Error encoding message', error);
        }
    }
    handleConnection(socket) {
        this.logger.logInfo('Client connected');
        socket.on('data', this.handleData.bind(this, socket));
        socket.on('error', this.handleError.bind(this));
        socket.on('end', this.handleEnd.bind(this));
    }
    handleError(error) {
        this.logger.logError("Server error", error);
    }
    handleEnd() {
        this.logger.logInfo('Client disconnected');
    }
    handleData(socket, data) {
        try {
            const wrapper = Wrapper_TCP_1.TcpWrapper.decode(data);
            switch (wrapper.payloadType) {
                case Wrapper_TCP_1.TcpWrapper_MessageType.LoginRequest:
                    this.logger.logInfo('Received packet of type LoginRequest');
                    this.handleLoginRequest(socket, ClientRequest_TCP_1.LoginRequest.decode(wrapper.payload));
                    break;
                case Wrapper_TCP_1.TcpWrapper_MessageType.FindMatchRequest:
                    this.logger.logInfo('Received packet of type FindMatchRequest');
                    this.handleFindMatchRequest(socket, ClientRequest_TCP_1.FindMatchRequest.decode(wrapper.payload));
                    break;
                default:
                    this.logger.logError('Invalid enum MessageType');
            }
        }
        catch (error) {
            this.logger.logError('Error decoding message', error);
        }
    }
    handleLoginRequest(socket, message) {
        const session = new ClientSession_1.ClientSession(message.username);
        // In the future this will check in a database for credentials
        this.logger.logInfo(`Client logged in as \'${message.username}\'`);
        this.udpServer.addClientSession(session);
        const response = ServerResponse_TCP_1.LoginResponse.create({ success: true, sessionId: (0, uuid_1.parse)(session.getSessionId()) });
        this.logger.logInfo('Sending message of type FindMatchRequest');
        this.sendMessageBuffer(socket, ServerResponse_TCP_1.LoginResponse.encode(response).finish(), Wrapper_TCP_1.TcpWrapper_MessageType.LoginResponse);
    }
    handleFindMatchRequest(socket, message) {
        const response = ServerResponse_TCP_1.FindMatchResponse.create();
        const match_id = this.udpServer.matchRequest((0, uuid_1.stringify)(message.sessionId));
        if (match_id == null) {
            response.success = false;
            this.logger.logInfo('Sending message of type FindMatchResponse');
            this.sendMessageBuffer(socket, ServerResponse_TCP_1.FindMatchResponse.encode(response).finish(), Wrapper_TCP_1.TcpWrapper_MessageType.FindMatchResponse);
            return;
        }
        response.success = true;
        response.matchId = (0, uuid_1.parse)(match_id);
        this.logger.logInfo('Sending message of type FindMatchResponse');
        this.sendMessageBuffer(socket, ServerResponse_TCP_1.FindMatchResponse.encode(response).finish(), Wrapper_TCP_1.TcpWrapper_MessageType.FindMatchResponse);
    }
}
exports.TcpServer = TcpServer;
