import { Tile } from './tile';

export class Map {
	constructor(level) {
		this.level = level;
		this.data = [];
		this.width = 0;
		this.height = 0;
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
}
