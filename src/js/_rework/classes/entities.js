import { getCollidingTiles, maybeLandOnTile } from '../utils';
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
	setState(state) {
		this.currentState = this.states[state];
		this.currentState.enter();
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
		this.standsOnTile = false;
	}
	isOnGround() {
		const isOnGround = this.y + this.height >= this.game.height;
		if (isOnGround) {
			this.y = this.game.height - this.height;
		}
		return isOnGround;
	}
	isGrounded() {
		return this.standsOnTile || this.isOnGround();
	}
	applyGravity() {
		this.y += this.veloY;
		if (!this.isGrounded()) {
			this.veloY += this.weight * this.game.gravity;
		} else {
			this.veloY = 0;
		}
	}
	handleTileCollision() {
		const map = this.game.getCurrentLevel().map;
		const collidingTiles = getCollidingTiles(this, map.tiles);
		// Check if the player is below the platform.
		// If so, the player should fall down.
		// If he is above the platform, he should be on top of it.
		if (collidingTiles.length === 0) {
			this.standsOnTile = false;
		} else {
			collidingTiles.forEach((tile) => {
				maybeLandOnTile(this, tile);
			})
		}

	}
}
