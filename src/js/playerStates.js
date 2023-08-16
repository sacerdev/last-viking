import { State } from './state';
import { collisionRec } from './utils';

const STATES = {
	IDLE: 0,
	RUNNING: 1,
	JUMPING: 2,
	FALLING: 3,
};

export class IdleState extends State {
	constructor(player) {
		super('IDLE');
		this.player = player;
		this.maxFrame = 4;
		this.animDelay = 20;
	}
	enter() {
		handlePlatformCollision(this.player);
		console.log('enter idle', this.player, this.player.isOnGround() && !this.player.isOnPlatform);
		this.player.veloY = 0;
		this.player.frameX = 0;
		this.player.frameY = 0;
		if (this.player.isOnGround() && !this.player.isOnPlatform) {
			this.player.y = this.player.game.height - this.player.getHeight();
		}
	}
	update() {
		this.animate();
		this.handleInput(this.player.game.input);
		if (this.player.veloY > 0) {
			this.player.setState(STATES.FALLING);
		}
	}
	handleInput(input) {
		if (input.keys.includes('ArrowRight') || input.keys.includes('ArrowLeft')) {
			this.player.setState(STATES.RUNNING);
		} else if (input.keys.includes(' ')) {
			this.player.setState(STATES.JUMPING);
		}
	}
}

export class RunningState extends State {
	constructor(player) {
		super('RUNNING');
		this.player = player;
		this.maxFrame = 2;
		this.animDelay = 4;
	}
	enter() {
		console.log('enter running', this.player);
		this.player.frameX = 0;
		this.player.frameY = 1;
	}
	update() {
		handlePlatformCollision(this.player);
		this.animate();
		this.handleInput(this.player.game.input);
	}

	handleInput(input) {
		if (input.keys.length === 0) {
			this.player.setState(STATES.IDLE);
		} else if (input.keys.includes(' ')) {
			this.player.setState(STATES.JUMPING);
		}
	}
}

export class JumpingState extends State {
	constructor(player) {
		super('JUMPING');
		this.player = player;
	}
	enter() {
		console.log('enter jumping', this.player);
		if (this.player.isGrounded()) {
			this.player.isOnPlatform = false;
			this.player.veloY -= 20;
			this.player.frameX = 0;
		} else {
			this.player.frameX = 1;
		}
		this.player.frameY = 2;
	}
	update() {
		if (!this.player.isGrounded()) {
			this.player.frameX = 1;
		}
		if (this.player.veloY >= 0) {
			console.log(this.player.veloY);
			this.player.setState(STATES.FALLING);
		}
	}
}

export class FallingState extends State {
	constructor(player) {
		super('FALLING');
		this.player = player;
	}
	enter() {
		console.log('enter falling', this.player.veloY, this.player);
		this.player.frameX = 1;
		this.player.frameY = 2;
	}
	update() {
		handlePlatformCollision(this.player);
		if (this.player.isGrounded()) {
			this.player.setState(STATES.IDLE);
		}
	}

}

function handlePlatformCollision(player) {
	//console.log({player})
	const map = player.game.getCurrentLevel()?.map;
	if (map?.platforms?.length > 0) {
		let hasCollision = false;
		map.platforms.forEach((platform) => {
			// if (player.y + player.getHeight() > platform.y + 5) {
			// 	console.log({
			// 		plh: player.y + player.height,
			// 		plh2: player.y + player.getHeight(),
			// 		pfy2: platform.y + 5,
			// 		ply: player.y,
			// 		plgh: player.getHeight(),
			// 		pfy: platform.y,
			// 		ois: player.y + player.getHeight() > platform.y + 5
			// 	})
			// 	return;
			// }
			if (
				collisionRec(
					player.x, player.y, player.getWidth(), player.getHeight(),
					platform.x, platform.y, platform.width, platform.height
				) && player.veloY >= 0
			) {
				if (!player.isOnPlatform) {
					console.log('holla');
					player.y = platform.y + 3 - player.getHeight();
					player.isOnPlatform = true;
				}
				hasCollision = true;
			}
		});
		if (!hasCollision) {
			player.isOnPlatform = false;
		}
	}
}
