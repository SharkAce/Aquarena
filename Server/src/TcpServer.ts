import * as net from 'net';
import { Logger } from './Logger';
import { ClientSession } from './ClientSession';
import { UdpServer } from './UdpServer';
import { parse as uuidParse, stringify as uuidStringify } from 'uuid';

import { TcpWrapper, TcpWrapper_MessageType as MessageType } from '../proto/Wrapper-TCP';
import { LoginRequest, FindMatchRequest, ChatMessageRequest } from '../proto/ClientRequest-TCP';
import { FindMatchResponse, LoginResponse } from '../proto/ServerResponse-TCP';

export class TcpServer {
  private port: number;
  private server: net.Server;
  private udpServer: UdpServer;
	private logger: Logger;

  constructor(port: number, udpServer: UdpServer) {
    this.port = port;
    this.udpServer = udpServer;
    this.server = net.createServer(this.handleConnection.bind(this));
		this.logger = new Logger("TCP");
  }

  public start() {
    this.server.listen(this.port, () => {
      this.logger.logInfo(`Server listening on port: ${this.port}`);
    });
  }

	public update() {
		// This function will update messages and matchmaking queues in the future
		return;
	}

	private sendMessageBuffer(socket: net.Socket, payload: Uint8Array, messageType: number){
		try {
			const wrapper: TcpWrapper = TcpWrapper.create({ payload: payload, payloadType: messageType });
			if (socket.write(TcpWrapper.encode(wrapper).finish())){
				this.logger.logInfo('Message sent.');
			} else {
				this.logger.logError('Message was not sent');
			}
		} catch (error) {
			this.logger.logError('Error encoding message', error);
		}
	}

  private handleConnection(socket: net.Socket) {
    this.logger.logInfo('Client connected');

		socket.on('data', this.handleData.bind(this, socket));
    socket.on('error', this.handleError.bind(this));
		socket.on('end', this.handleEnd.bind(this));

  }

  private handleError(error: Error) {
		this.logger.logError("Server error", error);
  }

	private handleEnd() {
		this.logger.logInfo('Client disconnected')
	
	}

	private handleData(socket: net.Socket, data: Buffer) {
		try {
			const wrapper: TcpWrapper = TcpWrapper.decode(data);


			switch(wrapper.payloadType){
				case MessageType.LoginRequest:
					this.logger.logInfo('Received packet of type LoginRequest');
					this.handleLoginRequest(socket, LoginRequest.decode(wrapper.payload));
					break;

				case MessageType.FindMatchRequest:
					this.logger.logInfo('Received packet of type FindMatchRequest');
					this.handleFindMatchRequest(socket, FindMatchRequest.decode(wrapper.payload));
					break;
					
				default:
					this.logger.logError('Invalid enum MessageType');
			}

    } catch (error) {
			this.logger.logError('Error decoding message', error);
    }

	}

	private handleLoginRequest(socket: net.Socket, message: LoginRequest){
		const session: ClientSession = new ClientSession(message.username);

		// In the future this will check in a database for credentials

		this.logger.logInfo(`Client logged in as \'${message.username}\'`)
		this.udpServer.addClientSession(session);

		const response: LoginResponse = LoginResponse.create({ success: true, sessionId: uuidParse(session.getSessionId()) });
		this.logger.logInfo('Sending message of type FindMatchRequest');
		this.sendMessageBuffer(socket, LoginResponse.encode(response).finish(), MessageType.LoginResponse);
	}

	private handleFindMatchRequest(socket: net.Socket, message: FindMatchRequest){
		const response: FindMatchResponse = FindMatchResponse.create();

		const match_id: string | null = this.udpServer.matchRequest(uuidStringify(message.sessionId));
		if (match_id == null) {
			response.success = false;

			this.logger.logInfo('Sending message of type FindMatchResponse');
			this.sendMessageBuffer(socket, FindMatchResponse.encode(response).finish(), MessageType.FindMatchResponse);
			return;
		}

		response.success = true;
		response.matchId = uuidParse(match_id);
		this.logger.logInfo('Sending message of type FindMatchResponse');
		this.sendMessageBuffer(socket, FindMatchResponse.encode(response).finish(), MessageType.FindMatchResponse);
	}

}
