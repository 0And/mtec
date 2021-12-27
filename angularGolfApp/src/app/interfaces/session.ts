import { Player } from './player';

export interface Session {
	sessionId: string,
	players: Player[],
	course: string,
	tee: string
}
