export class State {
	constructor(state) {
		this.state = state;
		this.gameFrame = 0;
		this.animDelay = 1;
	}
	enter() {}
	update() {}
	animate() {
		if (this.gameFrame % this.animDelay === 0) {
			if (this.player.frameX < this.maxFrame) {
				this.player.frameX++;
			} else {
				this.player.frameX = 0;
			}
			this.gameFrame = 0;
		}
		this.gameFrame++;
	}
}
