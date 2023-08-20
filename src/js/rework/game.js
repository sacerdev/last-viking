import { Base } from './classes/base';
import { InputHandler } from './input-handler/input-handler';
import { Level1 } from './levels/level1/level1';
import { Player } from './player/player';

export class Game extends Base {
	constructor(width, height, assets) {
		super();
		// Images, Sprites etc.
		this.assets = assets;
		// Canvas dimensions.
		this.width = width;
		this.height = height;
		// Physics.
		this.gravity = 1;
		// Camera.
		this.offsetX = 0;
		this.offsetY = 0;

		// Create game levels.
		this.currentLevel = 0;
		this.levels = [
			new Level1(this),
		];
		this.screens = [];

		// Create game Objects.
		this.input = new InputHandler();
		this.player = new Player(this);
		this.needsUpdate = [this.player];
		this.needsDraw = [this.player];
	}
	draw(context) {
		// Clear.
		context.clearRect(0, 0, this.width, this.height);

		context.save();
		context.translate(this.offsetX, this.offsetY);
		// Draw the level.
		//this.drawDemoTiles(context);
		this.getCurrentLevel().draw(context);

		// // Draw the entities.
		this.needsDraw.forEach((entity) => {
			entity.draw(context, this.offsetX, this.offsetY);
		});
		context.restore();
	}
	update(deltaTime) {
		// this.getCurrentLevel().update(deltaTime);
		this.needsUpdate.forEach((entity) => {
			entity.update(deltaTime);
			entity?.applyGravity();
		});
	}
	getCurrentLevel() {
		if (this.currentLevel >= 0) {
			return this.levels[this.currentLevel];
		} else {
			return this.screens[Math.abs(this.currentLevel) - 1];
		}
	}
	drawDemoTiles(context) {
		const tileSize = 32;
		const tiles = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 2, 2, 2, 2, 2, 2, 2, 1],
			[1, 2, 0, 0, 0, 0, 0, 2, 1],
			[1, 2, 0, 0, 0, 0, 0, 2, 1],
			[1, 2, 0, 0, 0, 0, 0, 2, 1],
			[1, 2, 0, 0, 0, 0, 0, 2, 1],
			[1, 2, 0, 0, 0, 0, 0, 2, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1],
		];

		const repeatCount = 5;
		const gapTiles = 4;
		const xOffset = -tiles[0].length * 1 - 6; // Offset for tiles with x < 0

		const drawTile = (col, row, color = 'red') => {
			context.fillStyle = color;
			context.fillRect(
				(col + xOffset) * tileSize,
				row * tileSize,
				tileSize,
				tileSize
			);
		};

		for (let row = 0; row < tiles.length; row++) {
			for (let repetition = 0; repetition < repeatCount; repetition++) {
				for (let col = 0; col < tiles[row].length; col++) {
					const tile = tiles[row][col];
					if (tile === 1) {
						drawTile(
							col + (repetition * (tiles[row].length + gapTiles)),
							row
						);
					} else if (tile === 2) {
						drawTile(
							col + (repetition * (tiles[row].length + gapTiles)),
							row,
							'orange'
						);
					}
				}
			}
		}
	}
}
