import { Map } from '../../classes/map';
import TILES from './tiles';

const viewportOffsetX = 32;
const viewportOffsetY = 32;

export class GameMap extends Map {
	constructor(level) {
		super(level);
		this.level = level;
		this.data = TILES;
		this.width = level.width;
		this.height = level.height;
		this.maxCol = Math.round(this.level.game.width / 32);
		this.maxRow = Math.round(this.level.game.height / 32);

		this.tiles = this.getTiles();
	}
	draw(context) {
		this.tiles.forEach((tile) => {
			tile.draw(context);
			// Only draw if in viewport.
			// if (
			// 	tile.x + this.level.game.offsetX + tile.width > -viewportOffsetX &&
			// 	tile.x + this.level.game.offsetX < this.level.game.width + viewportOffsetX &&
			// 	tile.y + this.level.game.offsetY + tile.height < this.level.game.height + viewportOffsetY &&
			// 	tile.y + this.level.game.offsetY > -viewportOffsetY
			// ) {
			// 	tile.draw(context);
			// }
		});
	}
}
