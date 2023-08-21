import { Enenmy } from '../../classes/enemy';
import { Level } from '../../classes/level';
import{ GameMap } from './map.js';

export class Level1 extends Level {
	constructor(game) {
		super(game, 0);
		this.width = game.width;
		this.height = game.height;
		this.map = new GameMap(this);
		this.enemies = [
			new Enenmy(this.game, 32, this.game.height - 64),
		]
	}
	draw(context) {
		this.map.draw(context);
		this.enemies.forEach((enemy) => {
			enemy.draw(context);
		});
	}
	update() {
		this.enemies.forEach((enemy) => {
			enemy.update();
		});
	}
}
