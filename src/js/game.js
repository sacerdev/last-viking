import { InputHandler } from './input';
import { GameMap } from './map';
import { Player } from './player';

const level1MapData = [
	[],
	[],
	[],
	[],
	[],
	[,,,,,1,1,1],
];

export class Game {
	constructor(width, height, assets) {
		this.assets = assets;
		this.width = width;
		this.height = height;
		this.gravity = 1;
		this.input = new InputHandler();
		this.player = new Player(this);
		this.needsUpdate = [this.player];
		this.needsDraw = [this.player];

		// Todo: rework this to load different levels.
		this.currentLevel = 0;
		this.levels = [
			{
				map: new GameMap(this, level1MapData),
			}
		];
	}
	update(deltaTime) {
		this.needsUpdate.forEach((entity) => {
			entity.update(deltaTime);
			entity?.applyGravity();
		});
	}
	draw(context) {
		context.clearRect(0, 0, this.width, this.height);
		this.levels[this.currentLevel].map.draw(context);
		this.needsDraw.forEach((entity) => {
			entity.draw(context);
		});

		// this.drawMap(context);
	}

	drawMap(context) {
		const map = this.levels[this.currentLevel].map;
		const maxCol = Math.round(map.width / 32);
		const maxRow = Math.round(map.height / 32);
		for (let row = 0; row < maxRow; row++) {
			for (let col = 0; col < maxCol; col++) {
				const dataRow = map.data[row] || null;
				const tile = dataRow ? dataRow[col] : null;

				if (tile === 1) {
					context.fillStyle = 'blue';
					context.fillRect(
						col * 32,
						row * 32,
						32,
						32,
					);
				}
			}
		}
	}
}
