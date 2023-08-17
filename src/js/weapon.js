import { Entity } from './entity';

export class Weapon extends Entity {
	constructor(game, parent) {
		super(game);
		this.sprite = this.game.assets.sprites.weapon;
		this.spriteWidth = 12;
		this.spriteHeight = 8;
		this.frameX = 0;
		this.frameY = 0;
		this.parent = parent;
		this.x = this.parent.x;
		this.y = this.parent.y;
		this.rotate = false;
	}
	draw(context, x, y) {
		let drawX = x + this.parent.wpnOffX;
		let drawY = y + this.parent.wpnOffY;

		context.save(); // Save the current transformation state.
		context.strokeStyle = 'green';

		if (this.rotate) {
			context.translate(drawX, drawY);
			context.rotate(Math.PI/2 * 3);
			// Adjust the drawing coordinates
			drawX = 0; // The rotated X coordinate
			drawY = 0;
		}
		context.strokeRect(drawX, drawY, this.getWidth(), this.getHeight());
		context.drawImage(
			this.sprite, // Image.
			this.frameX * this.spriteWidth, // Source x.
			this.frameY * this.spriteHeight, // Source y.
			this.spriteWidth, // Source width.
			this.spriteHeight, // Source height.
			drawX, // Destination x.
			drawY, // Destination y.
			this.getWidth(), // Destination width.
			this.getHeight() // Destination height.
		);
		context.restore(); // Restore the previous transformation state.
	}
}
