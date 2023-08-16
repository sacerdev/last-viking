import { PhysicsEntity } from './entity';
import { IdleState } from './playerStates';

export class Player extends PhysicsEntity {
	constructor(game) {
		super(game);

		this.sprite = game.assets.sprites.viking;
		this.spriteWidth = 32;
		this.spriteHeight = 32;
		this.frameX = 0;
		this.frameY = 0;
		this.scale = 2;

		this.states = [new IdleState(this)];
		this.currentState = this.states[0];
		this.currentState.enter();
	}
	update(deltaTime) {
		this.currentState.update(deltaTime);
		this.handleInput(this.game.input);
	}
	draw(context) {
		context.fillStyle = 'red';
		context.fillRect(this.x, this.y, this.getWidth(), this.getHeight());
		context.drawImage(
			this.sprite, // Image.
			this.frameX * this.spriteWidth, // Source x.
			this.frameY * this.spriteHeight, // Source y.
			this.spriteWidth, // Source width.
			this.spriteHeight, // Source height.
			this.x, // Destination x.
			this.y, // Destination y.
			this.getWidth(), // Destination width.
			this.getHeight() // Destination height.
		);
	}
	handleInput(input) {
		//
		// X-Axis.
		//
		this.x += this.speed;
		if (input.keys.includes('ArrowRight')) {
			this.speed = this.maxSpeed;
		} else if (input.keys.includes('ArrowLeft')) {
			this.speed = -this.maxSpeed;
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

		//
		// Y-Axis.
		//
		if (input.keys.includes(' ') && this.isOnGround()) {
			this.veloY -= 20;
		}
	}
	setState(state) {
		this.currentState = this.states[state];
		this.currentState.enter();
	}
}
