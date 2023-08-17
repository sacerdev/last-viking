import { Platform } from '../../platform';
import TILES from './tiles';

const TILE_TYPES = {
	PLATFORM: 1
}

export class GameMap {
	constructor(level) {
		this.level = level;
		this.data = TILES;
		this.width = level.width;
		this.height = level.height;

		this.platforms = getTilesByType(this, TILE_TYPES.PLATFORM, Platform);
		console.log(this);
	}
	draw(context) {
		this.platforms.forEach((platform) => {
			platform.draw(context);
		});
	}
}

function getTilesByType(map, type, Tile) {
	const tiles = [];
	const maxCol = Math.round(map.width / 32);
	const maxRow = Math.round(map.height / 32);
	for (let row = 0; row < maxRow; row++) {
		for (let col = 0; col < maxCol; col++) {
			const dataRow = map.data[row] || null;
			const tile = dataRow ? dataRow[col] : null;

			if (tile === type) {
				tiles.push(new Tile(col * 32, row * 32, 32, 32));
			}
		}
	}
	return tiles;
}
