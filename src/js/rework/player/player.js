import { PhysicsEntity } from '../classes/entities';
import { Camera } from './camera';

export class Player extends PhysicsEntity {
	constructor(game) {
		super(game);
		this.width = 64;
		this.height = 64;
		this.x = this.game.width / 2 - this.width / 2;
		this.y = this.game.height / 2 - this.height;

		//this.camera = new Camera(this, ((this.game.width / 32) - 4) * 32, ((this.game.width / 32) - 4) * 32);
		this.camera = new Camera(this, this.game.width, this.game.height);
	}
	draw(context) {
		this.drawPlayer(context);
	}
	drawPlayer(context) {
		context.fillStyle = 'blue';
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	update() {
		this.updateXAxis();
		this.updateChildren();
	}
	updateXAxis() {
		this.x += this.speed;
		if (this.game.input.keys.includes('ArrowRight')) {
			this.speed = this.maxSpeed;
		} else if (this.game.input.keys.includes('ArrowLeft')) {
			this.speed = -this.maxSpeed;
		} else {
			this.speed = 0;
		}
	}
	updateChildren() {
		this.camera.update();
	}
}
