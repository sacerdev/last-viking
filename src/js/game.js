import { InputHandler } from './input';
import { Player } from './entities/player';
import { Level1 } from './levels/level1/level1';

export class Game {
	constructor(width, height, assets) {
		this.assets = assets;
		this.width = width;
		this.height = height;
		this.gravity = 1;

		// Create game levels.
		this.currentLevel = 0;
		this.levels = [
			new Level1(this),
		];

		// Create game Objects.
		this.input = new InputHandler();
		this.player = new Player(this);
		this.needsUpdate = [this.player];
		this.needsDraw = [this.player];
	}
	update(deltaTime) {
		this.needsUpdate.forEach((entity) => {
			entity.update(deltaTime);
			entity?.applyGravity();
		});
	}
	draw(context) {
		// Clear.
		context.clearRect(0, 0, this.width, this.height);
		// Draw the level.
		this.levels[this.currentLevel].draw(context);
		// Draw the entities.
		this.needsDraw.forEach((entity) => {
			entity.draw(context);
		});
	}
	getCurrentLevel() {
		return this.levels[this.currentLevel];
	}
}
