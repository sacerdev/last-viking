import { State } from './state';
import { collisionRec } from '../utils';

const STATES = {
	IDLE: 0,
	RUNNING: 1,
	JUMPING: 2,
	FALLING: 3,
	ATTACKING: 4,
};

const WPN_OFF = {
	IDLE: [[46, 34], [46, 36], [46, 36], [46, 38], [46, 36]],
	RUNNING: [[46, 34], [48, 32], [46, 34]],
	JUMPING: [[46, 34], [46, 34]],
	FALLING: [[46, 34], [46, 34]],
	ATTACKING: [[46, 32], [48, 32], [46, 44]],
};

class PlayerState extends State {
	constructor(state, player) {
		super(state);
		this.player = player;
	}
	updateWeaponOffset(frame = this.player.frameX) {
		const state = Object.keys(STATES)[this.state];
		this.player.wpnOffX = WPN_OFF[state][frame][0];
		this.player.wpnOffY = WPN_OFF[state][frame][1];
	}
}

export class IdleState extends PlayerState {
	constructor(player) {
		super(STATES.IDLE, player);
		this.maxFrame = 4;
		this.animDelay = 20;
	}
	enter() {
		handlePlatformCollision(this.player);
		this.player.veloY = 0;
		this.player.frameX = 0;
		this.player.frameY = 0;
		this.player.weapon.frameX = 1;
		if (this.player.isOnGround() && !this.player.isOnPlatform) {
			this.player.y = this.player.game.height - this.player.height;
		}
	}
	update() {
		//this.animate();
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
		} else if (input.keys.includes(' ')) {
			this.player.setState(STATES.ATTACKING);
		}
	}
}

export class RunningState extends PlayerState {
	constructor(player) {
		super(STATES.RUNNING, player);
		this.maxFrame = 2;
		this.animDelay = 4;
	}
	enter() {
		this.player.frameX = 0;
		this.player.frameY = 1;
	}
	update() {
		handlePlatformCollision(this.player);
		this.animate();
		this.updateWeaponOffset();
		this.handleInput(this.player.game.input);
	}

	handleInput(input) {
		if (input.keys.length === 0) {
			this.player.setState(STATES.IDLE);
		} else if (input.keys.includes('ArrowUp')) {
			this.player.setState(STATES.JUMPING);
		} else if (input.keys.includes(' ')) {
			this.player.setState(STATES.ATTACKING);
		}
	}
}

export class JumpingState extends PlayerState {
	constructor(player) {
		super(STATES.JUMPING, player);
	}
	enter() {
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
		this.updateWeaponOffset();
		handlePlatformCollision(this.player);
		if (!this.player.isGrounded()) {
			this.player.frameX = 1;
		}
		if (this.player.veloY >= 0) {
			this.player.setState(STATES.FALLING);
		}
	}
	handleInput(input) {
		if (input.keys.includes(' ')) {
			this.player.setState(STATES.ATTACKING);
		}
	}
}

export class FallingState extends PlayerState {
	constructor(player) {
		super(STATES.FALLING, player);
	}
	enter() {
		this.player.frameX = 1;
		this.player.frameY = 2;
	}
	update() {
		this.updateWeaponOffset();
		handlePlatformCollision(this.player);
		if (this.player.isGrounded()) {
			this.player.setState(STATES.IDLE);
		}
	}
	handleInput(input) {
		if (input.keys.includes(' ')) {
			this.player.setState(STATES.ATTACKING);
		}
	}
}

export class AttackingState extends PlayerState {
	constructor(player) {
		super(STATES.ATTACKING, player);
		this.attackFrame = 0;
		this.maxFrame = 2;
		this.animDelay = 10;
		this.animCount = 1;
	}
	enter() {
		this.attackFrame = 0;
		this.player.frameX = 0;
		this.player.frameY = 1;
		this.player.weapon.frameX = 0;
		this.player.weapon.rotate = true;
		this.updateWeaponOffset(this.attackFrame);
	}
	update() {
		this.animate();
		handlePlatformCollision(this.player);
		checkForAttackOnEnemy(this.player);
		if (this.attackFrame > this.maxFrame) {
			this.player.setState(STATES.IDLE);
		}
	}
	handleInput(input) {
		if (this.attackFrame > this.maxFrame) {
			if (input.keys.includes('ArrowRight') || input.keys.includes('ArrowLeft')) {
				this.player.setState(STATES.RUNNING);
			} else if (input.keys.includes('ArrowUp')) {
				this.player.setState(STATES.JUMPING);
			} else if (this.player.isGrounded()) {
				this.player.setState(STATES.IDLE);
			} else {
				this.player.setState(STATES.FALLING);
			}
		}
	}
	animate() {
		if (this.animCount % this.animDelay === 0) {
			this.attackFrame++;
		}
		if (this.attackFrame === 1) {
			this.player.weapon.rotate = false;
			this.player.weapon.frameX = 1;
			this.updateWeaponOffset(1);
		} else if (this.attackFrame === 2) {
			this.player.weapon.rotate = false;
			this.player.weapon.frameX = 0;
			this.updateWeaponOffset(2);
		}
		this.animCount++;
	}
}

function handlePlatformCollision(player) {
	const map = player.game.getCurrentLevel()?.map;
	if (map?.platforms?.length > 0) {
		let hasCollision = false;
		map.platforms.forEach((platform) => {
			if (
				collisionRec(
					player.x, player.y, player.width, player.height,
					platform.x, platform.y, platform.width, platform.height
				)
			) {
				// Check if the player is below the platform.
				// If so, the player should fall down.
				// If he is above the platform, he should be on top of it.
				if (player.y + player.height > platform.y + platform.height) {
					player.y = platform.y + platform.height;
					player.veloY = 1;
				} else {
					player.y = platform.y - player.height;
					player.veloY = 0;
					player.isOnPlatform = true;
					hasCollision = true;
				}
			}
		});
		if (!hasCollision) {
			player.isOnPlatform = false;
		}
	}
}

function checkForAttackOnEnemy(player) {
	const level = player.game.getCurrentLevel();

	if (level?.enemies?.length > 0) {
		level.enemies.forEach((enemy, i) => {
			if (
				collisionRec(
					player.x,
					player.y,
					player.height,
					player.width,
					enemy.x,
					enemy.y,
					enemy.height,
					enemy.width
				)
			) {
				level.enemies.splice(i, 1);
			}
		});
	}
}
