import { PhysicsEntity } from './entity';
import { FallingState, IdleState, JumpingState, RunningState } from './playerStates';

const DIRECTIONS = {
	RIGHT: 1,
	LEFT: -1,
};

export class Player extends PhysicsEntity {
	constructor(game) {
		super(game);

		this.sprite = game.assets.sprites.viking;
		this.spriteWidth = 32;
		this.spriteHeight = 32;
		this.frameX = 0;
		this.frameY = 0;
		this.scale = 2;
		this.y = game.height - this.getHeight();

		this.directionH = DIRECTIONS.RIGHT;
		this.isOnPlatform = false;

		this.states = [
			new IdleState(this),
			new RunningState(this),
			new JumpingState(this),
			new FallingState(this),
		];
		this.currentState = this.states[0];
		this.currentState.enter();
	}
	update(deltaTime) {
		this.currentState.update(deltaTime);
		this.handleInput(this.game.input);
	}
	draw(context) {
		context.save(); // Save the current transformation state.
		context.strokeStyle = 'red';
		context.strokeRect(this.x, this.y, this.getWidth(), this.getHeight());
    	context.scale(this.directionH, 1); // Apply scaling to flip the sprite.

		const destX = (this.directionH === DIRECTIONS.RIGHT) ? this.x : -this.x - this.getWidth();
		context.drawImage(
			this.sprite, // Image.
			this.frameX * this.spriteWidth, // Source x.
			this.frameY * this.spriteHeight, // Source y.
			this.spriteWidth, // Source width.
			this.spriteHeight, // Source height.
			destX, // Destination x.
			this.y, // Destination y.
			this.getWidth(), // Destination width.
			this.getHeight() // Destination height.
		);
		context.restore(); // Restore the previous transformation state.
	}
	handleInput(input) {
		//
		// X-Axis.
		//
		this.x += this.speed;
		if (input.keys.includes('ArrowRight')) {
			this.speed = this.maxSpeed;
			this.directionH = DIRECTIONS.RIGHT;
		} else if (input.keys.includes('ArrowLeft')) {
			this.speed = -this.maxSpeed;
			this.directionH = DIRECTIONS.LEFT;
		} else {
			this.speed = 0;
		}
		// Worldbounds.
		if (this.x < 0) {
			this.x = 0;
		}
		if (this.x + this.getWidth() > this.game.width) {
			this.x = this.game.width - this.getWidth();
		}
	}
	setState(state) {
		this.currentState = this.states[state];
		this.currentState.enter();
	}
	isGrounded() {
		return this.isOnPlatform || this.isOnGround();
	}
}
