import { Base } from '../../classes/base';

export class GameField extends Base {
	constructor(loop) {
		super();
		this.loop = loop;
	}
	draw(context, x, y, COLS, ROWS) {
		context.save();
		context.fillStyle = '#9DB2BF';
		context.fillRect(x, y, this.loop.tileSize * COLS, this.loop.tileSize * ROWS);

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
	}
}
