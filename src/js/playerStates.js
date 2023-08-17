import { State } from './state';
import { collisionRec } from './utils';

const STATES = {
	IDLE: 0,
	RUNNING: 1,
	JUMPING: 2,
	FALLING: 3,
};

const WPN_OFF = {
	IDLE: [[23, 10], [23, 11], [23, 11], [23, 12], [23, 11]],
	RUNNING: [[23, 10], [24, 9], [23, 10]],
	JUMPING: [[23, 10], [23, 10]],
	FALLING: [[23, 10], [23, 10]],
};

class PlayerState extends State {
	constructor(state, player) {
		super(state);
		this.player = player;
	}
	updateWeaponOffset() {
		this.player.wpnOffX = WPN_OFF[this.state][this.player.frameX][0] * this.player.scale;
		this.player.wpnOffY = WPN_OFF[this.state][this.player.frameX][1] * this.player.scale;
	}
}

export class IdleState extends PlayerState {
	constructor(player) {
		super('IDLE', player);
		this.maxFrame = 4;
		this.animDelay = 20;
	}
	enter() {
		handlePlatformCollision(this.player);
		console.log('enter idle', this.player, this.player.isOnGround() && !this.player.isOnPlatform);
		this.player.veloY = 0;
		this.player.frameX = 0;
		this.player.frameY = 0;
		this.player.weapon.frameX = 1;
		if (this.player.isOnGround() && !this.player.isOnPlatform) {
			this.player.y = this.player.game.height - this.player.getHeight();
		}
	}
	update() {
		this.animate();
		this.updateWeaponOffset();
		this.handleInput(this.player.game.input);
		if (this.player.veloY > 0) {
			this.player.setState(STATES.FALLING);
		}
	}
	handleInput(input) {
		if (input.keys.includes('ArrowRight') || input.keys.includes('ArrowLeft')) {
			this.player.setState(STATES.RUNNING);
		} else if (input.keys.includes('ArrowUp')) {
			this.player.setState(STATES.JUMPING);
		}
	}
}

export class RunningState extends PlayerState {
	constructor(player) {
		super('RUNNING', player);
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
		} else if (input.keys.includes('ArrowUp')) {
			this.player.setState(STATES.JUMPING);
		}
	}
}

export class JumpingState extends PlayerState {
	constructor(player) {
		super('JUMPING', player);
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

export class FallingState extends PlayerState {
	constructor(player) {
		super('FALLING', player);
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
