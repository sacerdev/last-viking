import { Base } from './base';

export class Entity extends Base {
	constructor(game) {
		super();
		this.game = game;
		this.width = 0;
		this.height = 0;
		this.x = 0;
		this.y = 0;
	}
}

export class PhysicsEntity extends Entity {
	constructor(game) {
		super(game);
		this.speed = 0;
		this.maxSpeed = 5;
		this.veloX = 0;
		this.veloY = 0;
		this.weight = 1;
	}
	isOnGround() {
		const isOnGround = this.y + this.height >= this.game.height;
		if (isOnGround) {
			this.y = this.game.height - this.height;
		}
		return isOnGround;
	}
	isGrounded() {
		return this.isOnGround();
	}
	applyGravity() {
		this.y += this.veloY;
		if (!this.isGrounded()) {
			this.veloY += this.weight * this.game.gravity;
		} else {
			this.veloY = 0;
		}
	}
}
