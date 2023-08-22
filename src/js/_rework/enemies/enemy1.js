import { Animator } from '../classes/animator';
import { Enemy } from '../classes/enemy';
import { State } from '../classes/state';

export class Enemy1 extends Enemy {
	constructor(game, x, y) {
		super(game, x, y, 64, 64);
		this.speed = 2;
		this.maxSpeed = 2;

		this.width = 28;
		this.height = 64;

		this.sprite = game.assets.sprites.enemy1;
		this.spriteWidth = 7;
		this.spriteHeight = 16;
		this.frameX = 0;
		this.frameY = 0;
		this.animator = new EnemyAnimator(this);

		this.states = [
			new IdleState(this),
			new RunningState(this),
			// new HitState(this),
		];

		this.currentState = this.states[1];
		this.currentState.enter();

		this.standsOnTile = false;
	}
	draw(context) {
		context.save();
		context.drawImage(
			this.sprite, // Image.
			this.frameX * this.spriteWidth, // Source x.
			this.frameY * this.spriteHeight, // Source y.
			this.spriteWidth, // Source width.
			this.spriteHeight, // Source height.
			this.x, // Destination x.
			this.y, // Destination y.
			this.width, // Destination width.
			this.height // Destination height.
		);
		context.restore();
	}
	update(deltaTime) {
		this.patrol(32, this.game.width / 3);
		this.currentState.update(deltaTime);
		this.animator.update(deltaTime);
	}
}

class EnemyAnimator extends Animator {
	constructor(parent) {
		super(parent);
		this.animations = {
			IDLE: {
				startFrameX: 0,
				startFrameY: 0,
				maxFrame: 1,
				fps: 4 * this.parent.maxSpeed / 2,
				loop: true,
			},
			RUNNING: {
				startFrameX: 0,
				startFrameY: 1,
				maxFrame: 1,
				fps: 4 * this.parent.maxSpeed,
				loop: true,
			},
			HIT: {
				startFrameX: 0,
				startFrameY: 3,
				maxFrame: 0,
				fps: 0,
				loop: false,
			},
		};
	}
}


const STATES = {
	IDLE: 0,
	RUNNING: 1,
	HIT: 2,
};

class EnemyState extends State {
	constructor(state, parent) {
		super(state);
		this.parent = parent;
	}
}

class IdleState extends EnemyState {
	constructor(parent) {
		super(STATES.IDLE, parent);
	}
	enter() {
		this.parent.animator.play('IDLE');
	}
	update(deltaTime) {}
}

class RunningState extends EnemyState {
	constructor(parent) {
		super(STATES.RUNNING, parent);
	}
	enter() {
		this.parent.animator.play('RUNNING');
	}
	update(deltaTime) {}
}
