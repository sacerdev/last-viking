import { Node2D } from './node2D';

export class Hitbox extends Node2D {
	constructor(game, parent, color = 'fuchsia', offX = 0, offY = 0, offW = 0, offH = 0) {
		super(game);
		this.parent = parent;
		this.offX = offX;
		this.offY = offY;
		this.offW = offW;
		this.offH = offH;
		this.color = color;

		this.setXYWH();
	}
	draw(context) {
		context.save();
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.restore();
	}
	setXYWH() {
		this.x = this.parent.x + this.offX;
		this.y = this.parent.y + this.offY;
		this.width = this.parent.width + this.offW;
		this.height= this.parent.height + this.offH;
	}
}
