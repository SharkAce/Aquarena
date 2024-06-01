import { v4 as uuidv4 } from 'uuid';

export class ClientSession {
  private username: string;
  private sessionId: string;

  constructor(username: string) {
    this.username = username;
    this.sessionId = uuidv4();
  }

	public getUsername(){
		return this.username;
	}

	public getSessionId(){
		return this.sessionId;
	}

}
