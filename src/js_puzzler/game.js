import { Base } from './classes/base';
import { InputHandler } from './input';
import { GameLoop } from './scenes/game-loop';

export class Game extends Base {
	constructor(width, height, assets) {
		super();
		// Images, Sprites etc.
		this.assets = assets;
		// Canvas dimensions.
		this.width = width;
		this.height = height;

		this.input = new InputHandler();

		this.scenes = {
			loop: new GameLoop(this),
		};
		this.curentScene = 'loop';

		this.drawItems = [
			this.getCurrentScene(),
		];
		this.updateItems = [
			this.getCurrentScene(),
		];
	}
	draw(context) {
		// Clear.
		context.clearRect(0, 0, this.width, this.height);

		context.save();
		this.drawItems.forEach((item) => {
			// TODO: Draw in order of item.zIndex.
			item.draw(context);
		});
		context.restore();
	}
	update(deltaTime) {
		this.updateItems.forEach((item) => {
			item.update(deltaTime);
		});
	}
	getCurrentScene() {
		return this.scenes[this.curentScene];
	}
}
