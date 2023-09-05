import { Base } from './base';

const STONE_TYPE_COLORS = ['#ff0000', '#ffff00', '#0000ff'];
const STONE_TYPE_COLORS2 = ['#ff9999', '#ffff99', '#9999ff'];

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
export const STONE_TYPES = [0, 1, 2]

export class Stone extends Base {
	constructor(loop, type) {
		super();
		this.loop = loop;
		this.type = type;

		this.sibling = null;
		this.isAlive = true;

		this.x = null;
		this.y = null;
	}
	setSibling(sibling) {
		this.sibling = sibling;
	}
}

export class PlayerStone extends Stone {
	constructor(loop, type) {
		super(loop, type);
	}
	draw(context, x, y) {
		if (this.isAlive) {
			context.fillStyle = this.sibling.isAlive ? STONE_TYPE_COLORS[this.type] : STONE_TYPE_COLORS2[this.type];
			context.fillRect(
				x + this.loop.tilePadding,
				y + this.loop.tilePadding,
				this.loop.tileSize - this.loop.tilePadding * 2,
				this.loop.tileSize - this.loop.tilePadding * 2
			);
		}
	}
}

export class FoeStone extends Stone {
	constructor(loop, type) {
		super(loop, type);
	}
	draw(context, x, y) {
		if (this.isAlive) {
			context.fillStyle = STONE_TYPE_COLORS[this.type];
			context.beginPath();
			context.arc(
				x + this.loop.tileSize / 2,
				y + this.loop.tileSize / 2,
				this.loop.tileSize / 2 - this.loop.tilePadding * 2,
				0,
				2 * Math.PI
			);
			context.fill();
		}
	}
}
