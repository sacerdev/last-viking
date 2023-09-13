/**
 * Base class for all nearly objects in the game.
 */
export class Base {
	constructor() {
		// The zIndex is used to determine the order in which items are drawn.
		this.zIndex = 0;
	}
	/**
	 * Draw the item.
	 *
	 * @param {CanvasRenderingContext2D} context The context to draw on.
	 */
	draw(context) {}
	/**
	 * Update the item.
	 *
	 * @param {number} deltaTime
	 */
	update(deltaTime) {}
}
