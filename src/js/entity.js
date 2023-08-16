export class Entity {
	constructor(game) {
		this.game = game;
		this.width = 32;
		this.height = 32;
		this.x = game.width / 2 - this.width / 2;
		this.y = game.height / 2 - this.height / 2;
		this.scale = 1;
	}
	update() {}
	draw() {}
	getWidth() {
		return this.width * this.scale;
	}
	getHeight() {
		return this.height * this.scale;
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
		return this.y + this.getHeight() >= this.game.height;
	}
	applyGravity() {
		this.y += this.veloY;
		if (!this.isOnGround()) {
			this.veloY += this.weight * this.game.gravity;
		} else {
			this.y = this.game.height - this.getHeight();
			this.veloY = 0;
		}
	}
}
