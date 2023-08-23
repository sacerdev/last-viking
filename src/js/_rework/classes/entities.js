import { getCollidingObjects, maybeLandOnTile } from '../utils';
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
		const collidingTiles = getCollidingObjects(this, map.tiles);
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
	handleEnemyCollision() {
		const level = this.game.getCurrentLevel();
		const enemies = level.enemies;
		let collidingEnemies = [];
		if (this?.weapon?.isAttacking) {
			const weapon = {
				x: this.weapon.x - 12,
				width: this.weapon.width + 24,
				height: this.weapon.height,
			};
			collidingEnemies = getCollidingObjects(this,
				enemies
			);
			collidingEnemies.forEach((enemy) => {
				if (this.directionH === 1 && enemy.x < this.x) {
					enemy.handleHit();
				} else if (this.directionH === -1 && enemy.x > this.x) {
					enemy.handleHit();
				}
			});
		} else {
			const player = {
				x: this.x,
				y: this.y,
				width: this.width - 16,
				height: this.height
			};
			if (this.directionH === -1) {
				player.x += 16;
			}
			collidingEnemies = getCollidingObjects(player, enemies);
			if (collidingEnemies.length > 0) {
				this.handleHit();
			}
		}
	}
}
