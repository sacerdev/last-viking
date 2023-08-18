import { PhysicsEntity } from './entity';
import { AttackingState, FallingState, IdleState, JumpingState, RunningState } from '../states/playerStates';
import { Weapon } from './weapon';

const DIRECTIONS = {
	RIGHT: 1,
	LEFT: -1,
};

export class Player extends PhysicsEntity {
	constructor(game) {
		super(game);

		this.y = game.height - this.height;
		this.width = 32 * 2;
		this.height = 32 * 2;

		this.sprite = game.assets.sprites.viking;
		this.spriteWidth = 32;
		this.spriteHeight = 32;
		this.frameX = 0;
		this.frameY = 0;

		this.directionH = DIRECTIONS.RIGHT;
		this.isOnPlatform = false;

		this.wpnOffX = 0;
		this.wpnOffY = 0;
		this.weapon = new Weapon(game, this);

		this.states = [
			new IdleState(this),
			new RunningState(this),
			new JumpingState(this),
			new FallingState(this),
			new AttackingState(this),
		];
		this.currentState = this.states[0];
		this.currentState.enter();
	}
	update(deltaTime) {
		this.currentState.update(deltaTime);
		this.handleInput(this.game.input);
		this.weapon.update(deltaTime);
	}
	draw(context) {
		// Save the current transformation state.
		context.save();
		// Draw Rect for debugging purpose.
		context.strokeStyle = 'red';
		context.strokeRect(this.x, this.y, this.width, this.height);
		// Apply scaling to flip the sprite.
		context.scale(this.directionH, 1);
		const destX = (this.directionH === DIRECTIONS.RIGHT) ? this.x : -this.x - this.width;
		// Draw the sprite.
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
		this.weapon.draw(context);
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
		if (this.x + this.width > this.game.width) {
			this.x = this.game.width - this.width;
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
