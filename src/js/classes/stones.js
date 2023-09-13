/**
 * Dependencies.
 */
import { Base } from './base';

/**
 * Stone Group atlas.
 */
export const STONE_GROUPS = [
	[0, 0],
	[0, 1],
	[0, 2],
	[1, 0],
	[1, 1],
	[1, 2],
	[2, 0],
	[2, 1],
	[2, 2],
];
/**
 * Stone types.
 */
export const STONE_TYPES = [0, 1, 2]

/**
 * Stone base class.
 */
export class Stone extends Base {
	constructor(loop, type, index) {
		super();
		// Keep reference to the GameLoop object.
		this.loop = loop;

		// Set given properties.
		this.type = type;
		this.index = index;

		// Initialize other properties.
		this.sibling = null;
		this.isAlive = true;

		// Sprite properties.
		this.spriteWidth = 32;
		this.spriteHeight = 32;
	}
	/**
	 * Draw the stone.
	 *
	 * @param {CanvasRenderingContext2D} context The context to draw on.
	 * @param {number} x The x position to draw the stone at.
	 * @param {number} y The y position to draw the stone at.
	 */
	draw(context, x, y) {
		if (this.isAlive) {
			context.drawImage(
				this.tileset, // Image.
				this.type * this.spriteWidth, // Source x.
				0, // Source y.
				this.spriteWidth, // Source width.
				this.spriteHeight, // Source height.
				x, // Destination x.
				y, // Destination y.
				this.loop.tileSize, // Destination width.
				this.loop.tileSize // Destination height.
			);
		}
	}
	/**
	 * Update the stone's sibling.
	 *
	 * @param {Stone} sibling The sibling stone.
	 */
	setSibling(sibling) {
		this.sibling = sibling;
	}
}

/**
 * Player stone.
 */
export class PlayerStone extends Stone {
	constructor(loop, type, index) {
		super(loop, type, index);
		// Set the tileset.
		this.tileset = this.loop.game.assets.sprites.playerStones;
	}
}
/**
 * Foe stone.
 */
export class FoeStone extends Stone {
	constructor(loop, type, index) {
		super(loop, type, index);
		// Set the tileset.
		this.tileset = this.loop.game.assets.sprites.foeStones;
	}
}
