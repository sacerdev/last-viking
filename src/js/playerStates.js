import { State } from './state';

const states = {
	IDLE: 0,
};

export class IdleState extends State {
	constructor(player) {
		super('IDLE');
		this.player = player;
		this.maxFrame = 3;
		this.gameFrame = 0;
		this.animSpeed = 0.2;
	}
	enter() {
		this.player.frameX = 0;
	}
	update() {
		if (this.gameFrame % Math.ceil(100 * this.animSpeed)  === 0) {
			if (this.player.frameX < this.maxFrame) {
				this.player.frameX++;
			} else {
				this.player.frameX = 0;
			}
		}
		this.gameFrame++;
	}
}
