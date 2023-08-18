import { Hitbox } from '../hitbox';
import { Node2D } from '../node2D';

export class Entity extends Node2D {
	constructor(game) {
		super(game);
		this.x = this.game.width / 2 - this.width / 2;
		this.y = this.game.height / 2 - this.height / 2;
		this.width = 32;
		this.height = 32;
	}
}

export class PhysicsEntity extends Entity {
	constructor(game) {
		super(game);
		this.useGravity = true;
		this.speed = 0;
		this.maxSpeed = 5;
		this.veloY = 0;
		this.weight = 1;
	}
	isOnGround() {
		return this.y + this.height >= this.game.height;
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
