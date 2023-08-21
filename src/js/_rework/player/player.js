import { PhysicsEntity } from '../classes/entities';
import { getCollidingTiles, maybeLandOnTile } from '../utils';
import { Camera } from './camera';
import { FallingState, IdleState, JumpingState, RunningState } from './states';

export class Player extends PhysicsEntity {
	constructor(game) {
		super(game);
		this.width = 64;
		this.height = 64;
		this.x = this.game.width / 2 - this.width / 2;
		this.y = this.game.height / 2 - this.height;

		this.color = 'blue';

		this.camera = new Camera(this, this.game.width, this.game.height);
		this.states = [
			new IdleState(this),
			new RunningState(this),
			new JumpingState(this),
			new FallingState(this),
		];
		this.currentState = this.states[0];

		this.standsOnTile = false;
	}
	draw(context) {
		this.drawPlayer(context);
	}
	drawPlayer(context) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	update() {
		this.updateCurrentState();
		this.handleTileCollision();
		this.updateChildren();
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
	updateCurrentState() {
		this.currentState.update();
	}
	updateChildren() {
		this.camera.update();
	}
	setState(state) {
		this.currentState = this.states[state];
		this.currentState.enter();
	}
	isGrounded() {
		return this.standsOnTile || this.isOnGround();
	}
}
