import { Map } from '../../classes/map';
import { collisionRect } from '../../utils';
import TILES from './tiles';

export class GameMap extends Map {
	constructor(level) {
		super(level);
		this.level = level;
		this.width = level.width;
		this.height = level.height;
		this.maxCol = Math.round(this.level.game.width * 4 / 32);
		this.maxRow = Math.round(this.level.game.height / 32);

		this.data = TILES;
		this.tiles = this.getTiles();
	}
	draw(context) {
		this.drawTiles(context);
	}
}
