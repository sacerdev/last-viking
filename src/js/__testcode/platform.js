import { Tile } from './tile';

export class Platform extends Tile {
	constructor(x, y, width, height, color = 'red') {
		super(x, y, width, height, color);
	}
}
