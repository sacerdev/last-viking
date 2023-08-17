import { PhysicsEntity } from './entity';

export class Enemy extends PhysicsEntity {
	constructor(game) {
		super(game);
		this.x = 32;
		this.y = this.game.height - this.height;
		this.speed = 2;
		this.maxSpeed = 2;
		this.scale = 2;
	}
	draw(context) {
		context.fillStyle = 'orange';
		context.fillRect(this.x + this.width * (this.scale - 1), this.y - this.height * (this.scale - 1), this.getWidth(), this.getHeight());
	}
	update() {
		this.x += this.speed;
		if (this.x + this.getWidth() >= this.game.width / 3) {
			this.speed = -this.maxSpeed;
		} else if (this.x <= 0) {
			this.speed = this.maxSpeed;
		}
	}
}
