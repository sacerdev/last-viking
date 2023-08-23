import { State } from '../classes/state.js';

const STATES = {
	IDLE: 0,
	RUNNING: 1,
	JUMPING: 2,
	FALLING: 3,
};

const WPN_STATES = {
	IDLE: 0,
	ATTACKING: 1,
}

class PlayerState extends State {
	constructor(state, player) {
		super(state);
		this.player = player;
	}
}

class WeaponState extends State {
	constructor(state, weapon) {
		super(state);
		this.weapon = weapon;
	}
}

export class IdleState extends PlayerState {
	constructor(player) {
		super(STATES.IDLE, player);
	}
	enter() {
		this.player.veloY = 0;
		this.player.color = 'blue';
		this.player.animator.play('IDLE');
		this.player.weapon.animator.play(STATES.IDLE);
	}
	update() {
		this.handleInput(this.player.game.input);
	}
	handleInput(input) {
		if (movesHorizontal(input.keys)) {
			this.player.setState(STATES.RUNNING);
		} else if (jumps(input.keys)) {
			this.player.setState(STATES.JUMPING);
		} else if (!this.player.isGrounded()) {
			this.player.setState(STATES.FALLING);
		}
	}
}

export class RunningState extends PlayerState {
	constructor(player) {
		super(STATES.RUNNING, player);
	}
	enter() {
		this.player.color = 'purple';
		this.player.animator.play('RUNNING');
		this.player.weapon.animator.play(STATES.RUNNING);
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
		} else if (!this.player.isGrounded()) {
			this.player.setState(STATES.FALLING);
		}
	}
}

export class JumpingState extends PlayerState {
	constructor(player) {
		super(STATES.JUMPING, player);
	}
	enter() {
		if (this.player.isGrounded()) {
			this.player.standsOnTile = false;
			this.player.veloY -= 20;
		}
		this.player.color = 'green';
		this.player.animator.play('JUMPING');
		this.player.weapon.animator.play(STATES.JUMPING);
	}
	update() {
		handleHorizontalMovement(this.player, this.player.game.input);
		if (this.player.veloY >= 0) {
			this.player.setState(STATES.FALLING);
		}
	}
}

export class FallingState extends PlayerState {
	constructor(player) {
		super(STATES.FALLING, player);
	}
	enter() {
		this.player.color = 'lime';
		this.player.animator.play('FALLING');
		this.player.weapon.animator.play(STATES.FALLING);
	}
	update() {
		handleHorizontalMovement(this.player, this.player.game.input);
		if (this.player.isGrounded()) {
			this.player.setState(STATES.IDLE);
		}
	}
}

export class IdleWeaponState extends WeaponState {
	constructor(weapon) {
		super(STATES.IDLE, weapon);
	}
	enter() {
		this.weapon.frameX = 1;
		this.weapon.rotate = false;
		this.weapon.isAttacking = false;
	}
	update() {
		this.handleInput(this.weapon.parent.game.input);
	}
	handleInput(input) {
		if (attacks(input.keys)) {
			this.weapon.setState(WPN_STATES.ATTACKING);
		}
	}
}

export class AttackingWeaponState extends WeaponState {
	constructor(weapon) {
		super(STATES.ATTACKING, weapon);
	}
	enter() {
		this.weapon.frameX = 0;
		this.weapon.rotate = true;
		this.weapon.isAttacking = true;
	}
	update() {
		if (!this.weapon.isAttacking) {
			this.weapon.setState(WPN_STATES.IDLE);
		}
	}
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

function attacks(keys) {
	return keys.includes(' ');
}

function handleHorizontalMovement(entity, input) {
	const map = entity.game.getCurrentLevel().map;
	entity.x += entity.speed;
	if (input.keys.includes('ArrowRight') && entity.x < map.maxCol * 32) {
		entity.speed = entity.maxSpeed;
		entity.directionH = 1;
	} else if (input.keys.includes('ArrowLeft') && entity.x > map.minCol * 32) {
		entity.speed = -entity.maxSpeed;
		entity.directionH = -1;
	} else {
		entity.speed = 0;
	}
}

function isIdle(keys) {
	return keys.length === 0;
}
