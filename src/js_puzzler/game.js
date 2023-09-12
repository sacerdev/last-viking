/**
 * Dependencies.
 */
import { Base } from './classes/base';
import { InputHandler } from './input';
import { GameLoop } from './scenes/game-loop';

/**
 * Game.
 *
 * The game object is the main entry point for the game.
 * It holds the canvas, the assets and the game loop.
 */
export class Game extends Base {
	constructor(width, height, assets) {
		super();
		// Images, Sprites etc.
		this.assets = assets;
		// Canvas dimensions.
		this.width = width;
		this.height = height;
		// Input handler.
		this.input = new InputHandler();
		// Load scenes.
		this.scenes = {
			loop: new GameLoop(this),
		};
		this.curentScene = 'loop';
		// Items to draw.
		this.drawItems = [
			this.getCurrentScene(),
		];
		// Items to update.
		this.updateItems = [
			this.getCurrentScene(),
		];
	}
	/**
	 * @inheritdoc
	 */
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
	/**
	 * @inheritdoc
	 */
	update(deltaTime) {
		this.updateItems.forEach((item) => {
			item.update(deltaTime);
		});
	}
	/**
	 * Get the current scene.
	 * @return {Scene} The current scene.
	 */
	getCurrentScene() {
		return this.scenes[this.curentScene];
	}
}
