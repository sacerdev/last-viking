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
	constructor(type, x, y, width, height) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height || width;
	}
	update() {
		this.x += this.level.game.offsetX;
		this.y += this.level.game.offsetY;
	}
	draw(context) {
		context.fillStyle = TILE_TYPE_COLORS[this.type] || 'fuchsia';
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}
