import { v4 as uuidv4 } from 'uuid';
import { ClientSession } from './ClientSession';

import { ActionRequest } from '../proto/ClientRequest-UDP';
import { ActionResponse } from '../proto/ServerResponse-UDP';
import { GameStateResponse } from '../proto/ServerResponse-UDP';
import { GameStateResponse_Coin as CoinMessage } from '../proto/ServerResponse-UDP';
import { GameStateResponse_Player as PlayerMessage } from '../proto/ServerResponse-UDP';

export class MatchSession {

	private players: Map<string, Player>;
	private coins: Array<Coin>;
	private joinable: boolean;
	private matchId: string;

  constructor() {
		this.players = new Map();
		this.coins = new Array();
		this.matchId = uuidv4();
		this.joinable = true;
  }

	public update() {
		this.players.forEach((player) => player.update());
	}

	public getMatchId(): string {
		return this.matchId;
	}

	public getJoinableStatus(): boolean {
		return this.joinable;
	}

	public getGameState(): GameStateResponse {
		const playerMessages: Array<PlayerMessage> = Array.from(this.players.values()).map(player => player.getMessage());
		//console.log("Player count:", this.players.size);
		const coinMessages: Array<CoinMessage> = this.coins.map((coin) => coin.getMessage());
		return GameStateResponse.create({
			players: playerMessages,
			coins: coinMessages
		});
	}

	public addPlayer(clientSession: ClientSession){
		const player: Player = new Player(clientSession.getUsername());
		this.players.set(clientSession.getSessionId(), player);
	}

	public playerAction(sessionId: string, actionRequest: ActionRequest): ActionResponse{
		let response: ActionResponse = ActionResponse.create({ success: false })
		if (!this.players.has(sessionId)) return response;

		const player: Player | undefined = this.players.get(sessionId);

		player?.setTargetPos(actionRequest.targetX, actionRequest.targetY);
		response.success = true;
		return response;
	}
}

class Player {
	private posX: number;
	private posY: number;
	private targetPosX: number;
	private targetPosY: number;
	private speed: number;
	private username: string;

	constructor(username: string){
		this.username  = username;
		this.posX = 100;
		this.posY = 100;
		this.targetPosX = 100;
		this.targetPosY = 100;
		this.speed = 5;
	}

	public update() {
		const { x, y } = this.updatePosition(this.posX, this.posY, this.targetPosX, this.targetPosY, this.speed);
		this.posX = x;
		this.posY = y;
	}

	public setTargetPos(posX: number, posY: number) {
		this.targetPosX = posX;
		this.targetPosY = posY;
	}

	public getPosition(): { posX: number, posY: number } {
		return { posX: this.posX, posY: this.posY };
	}

	public getMessage(): PlayerMessage {
		return PlayerMessage.create({
			username: this.username,
			positionX: this.posX,
			positionY: this.posY,
		});
	}

	private updatePosition(posX: number, posY: number, targetPosX: number, targetPosY: number, speed: number) {
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
	private posX: number;
	private posY: number;

	constructor(posX: number, posY: number){
		this.posX = posX;
		this.posY = posY;
	}

	public getPosition(): object{
		return { posX: this.posX, posY: this.posY };
	}

	public getMessage(): CoinMessage{
		return CoinMessage.create({
			positionX: this.posX,
			positionY: this.posY
		});
	} 
}
