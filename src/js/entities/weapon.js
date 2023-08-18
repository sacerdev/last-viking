import { Hitbox } from '../hitbox';
import { Entity } from './entity';



export class Weapon extends Entity {
	constructor(game, parent) {
		super(game);

		this.parent = parent;

		this.x = this.parent.x;
		this.y = this.parent.y;
		this.width = 12 * 2;
		this.height = 8 * 2;

		this.sprite = this.game.assets.sprites.weapon;
		this.spriteWidth = 12;
		this.spriteHeight = 8;
		this.frameX = 0;
		this.frameY = 0;
		this.rotate = false;

		this.hitbox = new Hitbox(this.game, this, 'fuchsia', 4, -8, 8, 16);
		console.log(this);
	}
	draw(context) {
		let destX = (this.parent.directionH === 1) ? this.x : -this.x - this.width + this.parent.width - this.spriteWidth;
		let destY = this.y;

		context.save(); // Save the current transformation state.

		if (this.rotate) {
			context.translate(destX, destY + this.height);
			context.rotate(Math.PI/2 * 3);
			// Adjust the drawing coordinates
			destX = 0; // The rotated X coordinate
			destY = 0;
		}

		this.hitbox.x = destX + this.hitbox.offX;
		this.hitbox.y = destY + this.hitbox.offY;
		this.hitbox.draw(context);

		context.strokeStyle = 'green';
		context.strokeRect(destX, destY, this.width, this.height);
		context.drawImage(
			this.sprite, // Image.
			this.frameX * this.spriteWidth, // Source x.
			this.frameY * this.spriteHeight, // Source y.
			this.spriteWidth, // Source width.
			this.spriteHeight, // Source height.
			destX, // Destination x.
			destY, // Destination y.
			this.width, // Destination width.
			this.height // Destination height.
		);
		context.restore(); // Restore the previous transformation state.
	}
	update() {
		this.x = this.parent.x + this.parent.wpnOffX;
		this.y = this.parent.y + this.parent.wpnOffY;
		this.hitbox.update();
	}
}
