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
			new HitState(this),
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
		if (!this.wasHit) {
			this.patrol(32, this.game.width / 3);
			this.animator.update(deltaTime);
		}
		this.currentState.update(deltaTime);
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
		};
		this.playedHit = false;
		this.hitDistance = 128;
	}
	playHit() {
		if (this.hitDistance < 0) {
			this.playedHit = true;
		}
		const deltaX = this.parent.maxSpeed * 2 * this.parent.hitDirection;
		this.parent.x += deltaX;
		this.hitDistance -= Math.abs(deltaX);
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
	update(deltaTime) {
		if (this.parent.wasHit) {
			this.parent.setState(STATES.HIT);
		}
	}
}

class RunningState extends EnemyState {
	constructor(parent) {
		super(STATES.RUNNING, parent);
	}
	enter() {
		this.parent.animator.play('RUNNING');
		console.log(this);
	}
	update(deltaTime) {
		if (this.parent.wasHit) {
			this.parent.setState(STATES.HIT);
		}
	}
}

class HitState extends EnemyState {
	constructor(parent) {
		super(STATES.HIT, parent);
	}
	enter() {
		this.parent.frameX = 0;
		this.parent.frameY = 2;
		this.parent.hitDirection = this.parent.game.player.x > this.parent.x ? 1 : -1;
	}
	update(deltaTime) {
		if (this.parent.animator.playedHit) {
			this.parent.isDead = true;
		}
		this.parent.animator.playHit();
	}
}
