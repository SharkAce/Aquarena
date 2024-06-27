import * as dgram from 'dgram';
import { parse as uuidParse, stringify as uuidStringify } from 'uuid';

import { Logger } from './Logger';
import { ClientSession } from './ClientSession';
import { MatchSession } from './MatchSession';

import { UdpWrapper, UdpWrapper_MessageType as MessageType } from '../proto/Wrapper-UDP';
import { ActionRequest, GameStateRequest } from '../proto/ClientRequest-UDP';
import { ActionResponse, GameStateResponse } from '../proto/ServerResponse-UDP';

export class UdpServer {
	private port: number;
	private server: dgram.Socket;
	private clientSessions: Map<string, ClientSession>;
	private matchSessions: Map<string, MatchSession>;
	private maxMatchSessions: number;
	private logger: Logger;

	constructor(port: number) {
		this.maxMatchSessions = 5;
		this.port = port;
		this.server = dgram.createSocket('udp4');
		this.clientSessions = new Map();
		this.matchSessions = new Map();
		this.server.on('error', this.handleError.bind(this));
		this.server.on('message', this.handleMessage.bind(this));
		this.server.on('listening', this.handleListening.bind(this));
		this.logger = new Logger('UDP');
	}

	public start() {
		this.server.bind(this.port);
	}

	public update() {
		this.matchSessions.forEach((match) => match.update());
	}

	public addClientSession(clientSession: ClientSession) {
		this.clientSessions.set(clientSession.getSessionId(), clientSession);
	}

	private getClientSession(sessionId: string): ClientSession | undefined {
		return this.clientSessions.get(sessionId);
	}

	public removeClientSession(sessionId: string) {
		this.clientSessions.delete(sessionId);
	}

	public matchRequest(sessionId: string): string | null {
		const session: ClientSession | undefined = this.getClientSession(sessionId);
		if (session === undefined) return null;

		for (const [matchId, match] of this.matchSessions) {
			if (match.getJoinableStatus()) {
				this.logger.logInfo('Added client to existing match');
				match.addPlayer(session);
				return matchId;
			}
		}

		if (this.matchSessions.size < this.maxMatchSessions) {
			this.logger.logInfo('Added client to new match');
			const matchId:string = this.createMatch();
			this.matchSessions.get(matchId)?.addPlayer(session);
			return matchId;
		}

		return null;
	}

	private createMatch(): string {
		const match = new MatchSession();
		this.matchSessions.set(match.getMatchId(), match);
		return match.getMatchId();
	}


	private handleError(error: Error) {
		this.logger.logError('Server error', error);
		this.server.close();
	}

	private handleMessage(message: Buffer, rinfo: dgram.RemoteInfo) {
		try {
			const wrapper: UdpWrapper = UdpWrapper.decode(message);

			switch(wrapper.payloadType){
				case MessageType.GameStateRequest:
					this.handleGameStateRequest(GameStateRequest.decode(wrapper.payload), rinfo);
					break;

				case MessageType.ActionRequest:
					this.handleActionRequest(ActionRequest.decode(wrapper.payload), rinfo);
					break;

				default:
					this.logger.logError('Invalid enum MessageType');
			}
		} catch (error) {
			this.logger.logError('Error decoding message', error);
		}
	}

	private handleGameStateRequest(message: GameStateRequest, rinfo: dgram.RemoteInfo) {
		let response: GameStateResponse = GameStateResponse.create({ players: [], coins: [] });

		const matchSessionId: string = uuidStringify(message.matchId);
		const matchSession: MatchSession | undefined = this.matchSessions.get(matchSessionId);
		if (matchSession === undefined) {
			this.logger.logError('Not a valid match id');
			this.sendMessageBuffer(GameStateResponse.encode(response).finish(), MessageType.GameStateResponse, rinfo);
			return;
		}

		response = matchSession.getGameState();
		this.sendMessageBuffer(GameStateResponse.encode(response).finish(), MessageType.GameStateResponse, rinfo);
	}

	private handleActionRequest(message: ActionRequest, rinfo: dgram.RemoteInfo) {
		let response: ActionResponse = ActionResponse.create({ success: false });

		const matchSessionId: string = uuidStringify(message.matchId);
		const matchSession: MatchSession | undefined = this.matchSessions.get(matchSessionId);
		if (matchSession === undefined) {
			this.logger.logError('Not a valid match id');
			this.sendMessageBuffer(ActionResponse.encode(response).finish(), MessageType.ActionResponse, rinfo);
			return;
		}

		const username: string | undefined = this.clientSessions.get(uuidStringify(message.sessionId))?.getUsername();
		this.logger.logInfo(`Recieved an ActionRequest from \'${username}\'`);

		response = matchSession.playerAction(uuidStringify(message.sessionId), message);
		this.sendMessageBuffer(ActionResponse.encode(response).finish(), MessageType.ActionResponse, rinfo);
	}

	private sendMessageBuffer(payload: Uint8Array, messageType: number, rinfo: dgram.RemoteInfo){
		try {
			const wrapper: UdpWrapper = UdpWrapper.create({ payload: payload, payloadType: messageType });
			this.server.send(UdpWrapper.encode(wrapper).finish(),rinfo.port, rinfo.address);
		} catch (error) {
			this.logger.logError('Error sending message', error);
		}
	}

	private handleListening() {
		const address = this.server.address();
		this.logger.logInfo(`Server listening on port: ${address.port}`);
	}

}

