import { State } from '../classes/state.js';

const STATES = {
	IDLE: 0,
	RUNNING: 1,
	JUMPING: 2,
	FALLING: 3,
};

class PlayerState extends State {
	constructor(state, player) {
		super(state);
		this.player = player;
	}
}

export class IdleState extends PlayerState {
	constructor(player) {
		super(STATES.IDLE, player);
	}
	enter() {
		console.log('enter idle', this.player);
		this.player.veloY = 0;
		this.player.color = 'blue';
		if (this.player.isOnGround() && !this.player.standsOnTile) {
			this.player.y = this.player.game.height - this.player.height;
		}
	}
	update() {
		this.handleInput(this.player.game.input);
	}
	handleInput(input) {
		if (movesHorizontal(input.keys)) {
			this.player.setState(STATES.RUNNING);
		} else if (jumps(input.keys)) {
			this.player.setState(STATES.JUMPING);
		}
	}
}

export class RunningState extends PlayerState {
	constructor(player) {
		super(STATES.RUNNING, player);
	}
	enter() {
		console.log('enter running', this.player);
		this.player.color = 'purple';
	}
	update() {
		this.handleInput(this.player.game.input);
	}
	handleInput(input) {
		handleHorizontalMovement(this.player, input);
		if (isIdle(input.keys)) {
			this.player.setState(STATES.IDLE);
		} else if (jumps(input.keys)) {
			this.player.setState(STATES.JUMPING);
		}
	}
}

export class JumpingState extends PlayerState {
	constructor(player) {
		super(STATES.JUMPING, player);
	}
	enter() {
		console.log('enter jumping', this.player);
		if (this.player.isGrounded()) {
			this.standsOnTile = false;
			this.player.veloY -= 20;
			this.player.y -= 2;
		}
		this.player.color = 'green';
	}
	update() {
		handleHorizontalMovement(this.player, this.player.game.input);
		if (this.player.veloY >= 0) {
			this.player.setState(STATES.FALLING);
		}
	}
	handleInput(input) {}
}

export class FallingState extends PlayerState {
	constructor(player) {
		super(STATES.FALLING, player);
	}
	enter() {
		console.log('enter falling', this.player);
		this.player.color = 'lime';
	}
	update() {
		handleHorizontalMovement(this.player, this.player.game.input);
		if (this.player.isGrounded()) {
			this.player.setState(STATES.IDLE);
		}
	}
	handleInput(input) {}
}

/*
 * Helper functions
 */
function movesHorizontal(keys) {
	return keys.includes('ArrowRight') || keys.includes('ArrowLeft');
}

function jumps(keys) {
	return keys.includes('ArrowUp');
}

function handleHorizontalMovement(entity, input) {
	const map = entity.game.getCurrentLevel().map;
	entity.x += entity.speed;
	if (input.keys.includes('ArrowRight') && entity.x < map.maxCol * 32) {
		entity.speed = entity.maxSpeed;
	} else if (input.keys.includes('ArrowLeft') && entity.x > map.minCol * 32) {
		entity.speed = -entity.maxSpeed;
	} else {
		entity.speed = 0;
	}
}

function isIdle(keys) {
	return keys.length === 0;
}
