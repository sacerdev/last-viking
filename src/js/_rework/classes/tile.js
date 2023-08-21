const TILE_TYPE_COLORS = [
	0, // Should never be used.
	'red',		// 1
	'orange',	// 2
	'yellow',	// 3
	'green',	// 4
	'brown',	// 5
	'lime',		// 6
	'aqua',		// 7
	'white'		// 8
]

export class Tile {
	constructor(map, type, x, y, width, height) {
		this.map = map;
		this.type = type;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height || width;

		this.tileset = this.map.level.game.assets.sprites.tiles;
		this.spriteWidth = 8;
		this.spriteHeight = 8;
	}
	draw(context) {
		// context.fillStyle = TILE_TYPE_COLORS[this.type] || 'fuchsia';
		// context.fillRect(this.x, this.y, this.width, this.height);
		let frameX = 0;
		let direction = 1;
		let destX = this.x;
		if (this.type === 2) {
			frameX = 1;
		}
		if (this.type === 3) {
			direction = -1;
			destX = -this.x - this.width;
		}

		context.save();
		context.scale(direction, 1);

		// Draw the sprite.
		context.drawImage(
			this.tileset, // Image.
			frameX * this.spriteWidth, // Source x.
			0, // Source y.
			this.spriteWidth, // Source width.
			this.spriteHeight, // Source height.
			destX, // Destination x.
			this.y, // Destination y.
			this.width, // Destination width.
			this.height // Destination height.
		);
		context.restore();
	}
}
