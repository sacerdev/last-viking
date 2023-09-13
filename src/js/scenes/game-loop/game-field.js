/**
 * Dependencies.
 */
import { Base } from '../../classes/base';
import { MrV } from './mr-v';

/**
 * GameField class.
 */
export class GameField extends Base {
	constructor(loop) {
		super();
		// Keep reference to the GameLoop object.
		this.loop = loop;

		this.viking = new MrV(loop.game);
	}
	/**
	 * Draw the game field.
	 *
	 * @param {CanvasRenderingContext2D} context The context to draw on.
	 * @param {number} x The x position to start to draw the game field at.
	 * @param {number} y The y position to start to draw the game field at.
	 */
	draw(context, x, y,) {
		context.save();
		context.fillStyle = '#9DB2BF';
		context.fillRect(x, y, this.loop.tileSize * this.loop.COLS, this.loop.tileSize * this.loop.ROWS);

		// Set the global composite operation to "destination-in"
		context.globalCompositeOperation = 'source-atop';

		// Draw a big circle in dark gray
		context.fillStyle = '#526D82';
		context.beginPath();
		context.arc(x + this.loop.tileSize * 6.5, y + this.loop.tileSize * 6, 10 * this.loop.tileSize, 0, 2 * Math.PI);
		context.fill();

		// Draw a smaller circle in lighter gray
		context.fillStyle = '#27374D';
		context.beginPath();
		context.arc(x + this.loop.tileSize * 7, y + this.loop.tileSize * 6, 9 * this.loop.tileSize, 0, 2 * Math.PI);
		context.fill();

		// Reset the global composite operation
		context.globalCompositeOperation = 'source-over';
		context.restore();

		// NextStoneGroup.
		this.loop.nextStoneGroup.forEach((stone, si) => {
			const stoneX = x + this.loop.tileSize * (this.loop.COLS + 2 + si);
			const stoneY = y + this.loop.tileSize * (this.loop.ROWS - 13);
			stone.draw(context, stoneX, stoneY);
		});

		//this.viking.draw(context, x + this.loop.tileSize * (this.loop.COLS + 4), y + this.loop.tileSize * (this.loop.ROWS - 13.5));
		this.viking.draw(context, x + this.loop.tileSize * (this.loop.COLS + 2), y + this.loop.tileSize * (this.loop.ROWS - 12));
	}
	update(deltaTime) {
		this.viking.update(deltaTime);
	}
}
