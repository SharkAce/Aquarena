export class Logger {
	private prefix: string;

	constructor(prefix: string){
		this.prefix = prefix;
	}

	logInfo(message: string){
		console.info(`[${this.prefix}] ${message}`);
	}

	logError(message: string, error?: any){
		console.error(`[${this.prefix}] ${message}`, error);
	}

}
