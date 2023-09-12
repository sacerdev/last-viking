import { Level } from '../../classes/level';
import { Enemy1 } from '../../enemies/enemy1';
import{ GameMap } from './map';

export class Level1 extends Level {
	constructor(game) {
		super(game, 0);
		this.width = game.width;
		this.height = game.height;
		this.map = new GameMap(this);
		this.enemies = [
			new Enemy1(this.game, 32, this.game.height - 64),
		]
	}
	draw(context) {
		this.map.draw(context);
		this.enemies.forEach((enemy) => {
			enemy.draw(context);
		});
	}
	update(deltaTime) {
		this.enemies = this.enemies.filter((enemy) => !enemy.isDead);
		this.enemies.forEach((enemy) => {
			enemy.update(deltaTime);
		});
	}
}
