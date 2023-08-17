import { Level } from '../level';
import{ GameMap } from './map.js';

export class Level1 extends Level {
	constructor(game) {
		super(game, 0);
		this.width = game.width;
		this.height = game.height;
		this.map = new GameMap(this);
	}
	draw(context) {
		this.map.draw(context);
	}
	update() {}
}
