import { PhysicsEntity } from './entities';

export class Enenmy extends PhysicsEntity {
	constructor(game, x, y, w = 64, h = 64) {
		super(game);
		this.width = w;
		this.height = h;
		this.x = x || 32;
		this.y = y || 32;
		this.speed = 2;
		this.maxSpeed = 2;
	}
	draw(context) {
		context.fillStyle = 'orange';
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	update() {
		this.updateXAxis();
	}
	updateXAxis() {
		this.x += this.speed;
		if (this.x + this.width >= this.game.width / 3) {
			this.speed = -this.maxSpeed;
		} else if (this.x <= 32) {
			this.speed = this.maxSpeed;
		}
	}
}
