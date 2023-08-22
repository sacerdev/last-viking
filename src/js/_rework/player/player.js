import { PhysicsEntity } from '../classes/entities';
import { getCollidingTiles, maybeLandOnTile } from '../utils';
import { PlayerAnimator } from './animator';
import { Camera } from './camera';
import { FallingState, IdleState, JumpingState, RunningState } from './states';

export class Player extends PhysicsEntity {
	constructor(game) {
		super(game);
		this.width = 64;
		this.height = 64;
		this.x = this.game.width / 2 - this.width / 2;
		this.y = this.game.height / 2 - this.height;

		this.directionH = 1;

		this.sprite = game.assets.sprites.viking;
		this.spriteWidth = 32;
		this.spriteHeight = 32;
		this.frameX = 0;
		this.frameY = 0;
		this.animator = new PlayerAnimator(this);

		this.color = 'blue';

		this.camera = new Camera(this, this.game.width, this.game.height);
		this.states = [
			new IdleState(this),
			new RunningState(this),
			new JumpingState(this),
			new FallingState(this),
		];
		this.currentState = this.states[0];
		this.currentState.enter();

		this.standsOnTile = false;
	}
	draw(context) {
		this.drawPlayer(context);
	}
	drawPlayer(context) {
		context.save();
		context.strokeStyle = this.color;
		context.strokeRect(this.x, this.y, this.width, this.height);
		context.scale(this.directionH, 1);
		const destX = this.directionH === 1 ? this.x : -this.x - this.width;
		context.drawImage(
			this.sprite, // Image.
			this.frameX * this.spriteWidth, // Source x.
			this.frameY * this.spriteHeight, // Source y.
			this.spriteWidth, // Source width.
			this.spriteHeight, // Source height.
			destX, // Destination x.
			this.y, // Destination y.
			this.width, // Destination width.
			this.height // Destination height.
		);
		context.restore();
	}
	update(deltaTime) {
		this.handleTileCollision();
		this.currentState.update(deltaTime);
		this.camera.update();
		this.animator.update(deltaTime);
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
	setState(state) {
		this.currentState = this.states[state];
		this.currentState.enter();
	}
	isGrounded() {
		return this.standsOnTile || this.isOnGround();
	}
}
