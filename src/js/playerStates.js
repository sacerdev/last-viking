import { State } from './state';

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
		console.log('enter idle', this.player);
		this.player.frameX = 0;
		this.player.frameY = 0;
	}
	update() {
		this.animate();
		this.handleInput(this.player.game.input);
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
		if (this.player.isOnGround()) {
			this.player.veloY -= 20;
			this.player.frameX = 0;
		} else {
			this.player.frameX = 1;
		}
		this.player.frameY = 2;
	}
	update() {
		this.handleInput(this.player.game.input);
		if (!this.player.isOnGround()) {
			this.player.frameX = 1;
		}
	}

	handleInput(input) {
		if (this.player.veloY > this.player.weight) {
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
		this.player.frameX = 1;
		this.player.frameY = 2;
	}
	update() {
		if (this.player.isOnGround()) {
			this.player.setState(STATES.IDLE);
		}
	}
}
