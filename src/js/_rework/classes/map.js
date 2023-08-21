import { Tile } from './tile';

const viewportOffsetX = 32;
const viewportOffsetY = 32;

export class Map {
	constructor(level) {
		this.level = level;
		this.data = [];
		this.width = 0;
		this.height = 0;
		this.minRow = 0;
		this.minCol = 0;
		this.maxRow = 0;
		this.maxCol = 0;
		this.size = 32;
	}
	getTiles() {
		const tiles = [];
		// Somehow process the game.offsetX here.
		for (let row = 0; row < this.maxRow; row++) {
			for (let col = 0; col < this.maxCol; col++) {
				const dataRow = this.data[row] || null;
				const type = dataRow ? dataRow[col] : null;

				if (type && parseInt(type) !== 'NaN') {
					tiles.push(new Tile(type, col * 32, row * 32, this.size));
				}
			}
		}
		return tiles;
	}
	drawTiles(context) {
		this.tiles.forEach((tile) => {
			// Only draw if in viewport.
			if (
				tile.x + this.level.game.offsetX + tile.width > -viewportOffsetX &&
				tile.x + this.level.game.offsetX < this.level.game.width + viewportOffsetX &&
				tile.y + this.level.game.offsetY + tile.height < this.level.game.height + viewportOffsetY &&
				tile.y + this.level.game.offsetY > -viewportOffsetY
			) {
				tile.draw(context);
			}
		});
	}
}
