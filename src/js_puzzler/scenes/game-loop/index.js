/**
 * Dependencies.
 */
import { Scene } from '../../classes/scene';
import { GameField } from './game-field';
import {
	getFoeStones,
	getRandomStoneGroup,
	hitsStuff,
	moveStoneGroupDown
} from './utils';

/**
 * Game loop.
 *
 * The game loop is the main scene of the game.
 */
export class GameLoop extends Scene {
	constructor(game, level = 1) {
		super(game);

		// Game field constants.
		this.COLS = 8;
		this.ROWS = 16;
		this.INDEX_START_A = 3 + this.COLS;
		this.INDEX_START_B = 4 + this.COLS;

		// The level to start from.
		this.level = level;

		// Create the game field.
		this.tileSize = 32;
		this.gameField = new GameField(this);

		// Initialize other properties.
		this.speed = 1;
		this.counter = 0;

		// Hold states.
		this.gameOver = false;
		this.isDropping = false;

		// Create initial game objects.
		this.activeStoneGroup = getRandomStoneGroup(this);
		this.nextStoneGroup = getRandomStoneGroup(this);
		this.playerStones = [];
		this.foeStones = getFoeStones(this.level * 3, this);
	}
	/**
	 * @inheritdoc
	 */
	draw(context) {
		// Calculate offsets.
		// Those might be as well be constants.
		const offsetX = this.game.width / 2 - this.tileSize * this.COLS / 2;
		const offsetY = this.game.height / 2 - this.tileSize * this.ROWS / 2;

		// Background.
		this.gameField.draw(context, offsetX, offsetY);

		// FoeStones.
		this.foeStones.forEach((stone) => {
			const x = (stone.index % this.COLS) * this.tileSize + offsetX;
			const y = Math.floor(stone.index / this.COLS) * this.tileSize + offsetY;
			stone.draw(context, x, y);
		});
		// PlayerStones.
		this.playerStones.forEach((stone) => {
			if (stone.isAlive) {
				const x = (stone.index % this.COLS) * this.tileSize + offsetX;
				const y = Math.floor(stone.index / this.COLS) * this.tileSize + offsetY;
				stone.draw(context, x, y);
			}
		});
		// ActiveStoneGroup.
		this.activeStoneGroup.forEach((stone) => {
			const x = (stone.index % this.COLS) * this.tileSize + offsetX;
			const y = Math.floor(stone.index / this.COLS) * this.tileSize + offsetY;
			stone.draw(context, x, y);
		});
		// NextStoneGroup.
		this.nextStoneGroup.forEach((stone, si) => {
			const x = offsetX + this.tileSize * (this.COLS + 2 + si);
			const y = offsetY + this.tileSize * (this.ROWS - 13);
			stone.draw(context, x, y);
		});
	}
	/**
	 * @inheritdoc
	 */
	update(deltaTime) {
		if (!this.gameOver) {
			// Speed up if the stone is dropping.
			if (this.isDropping) {
				this.counter += deltaTime * 12;
			} else {
				this.handleInput(this.game.input);
			}
			if (this.counter > 1000 / this.speed) {
				this.moveActiveStoneGroupDown();
				console.log('tick')
				this.counter = 0;
			} else {
				this.counter += deltaTime;
			}
		}
	}
	/**
	 * Handle input.
	 *
	 * @param {InputHandler} input The input object.
	 */
	handleInput(input) {
		if (input.leftPressed === 1) {
			console.log('left')
			this.moveActiveStoneGroupSideways(-1);
			input.leftPressed++;
		} else if (input.rightPressed === 1) {
			console.log('right')
			this.moveActiveStoneGroupSideways(1);
			input.rightPressed++;
		} else if (input.rotateClockwisePressed === 1) {
			console.log('rotate clockwise');
			this.rotateActiveStoneGroup(1);
			input.rotateClockwisePressed++;
		} else if (input.rotateCounterClockwisePressed === 1) {
			console.log('rotate counter clockwise');
			this.rotateActiveStoneGroup(-1);
			input.rotateCounterClockwisePressed++;
		} else if (input.downPressed === 1) {
			console.log('down');
			this.moveActiveStoneGroupDown();
			input.downPressed++;
		} else if (input.dropPressed === 1) {
			console.log('put down');
			this.isDropping = true;
			input.dropPressed++;
		}
	}
	/**
	 * Move active stone group down.
	 */
	moveActiveStoneGroupDown() {
		const canMove = moveStoneGroupDown(this.activeStoneGroup, this.getObstacles(), this);
		const hasMoved = canMove[0] && canMove[1];
		if (!hasMoved) {
			if (this.isGameOver()) {
				this.gameOver = true;
				console.log('game over');
			} else {
				this.isDropping = false;
				this.playerStones.push(...this.activeStoneGroup);
				this.activeStoneGroup = this.nextStoneGroup;
				this.nextStoneGroup = getRandomStoneGroup(this);
			}
		}
	}
	/**
	 * Move active stone group sideways.
	 *
	 * @param {number} direction Either -1 for left or 1 for right.
	 */
	moveActiveStoneGroupSideways(direction) {
		const highestIndex = Math.max(...this.activeStoneGroup.map((stone) => stone.index));
		const lowestIndex = Math.min(...this.activeStoneGroup.map((stone) => stone.index));
		const hitsStuff = this.getObstacles().some((obstacle) => {
			// Could use utils.hitsStuff() here but checking both indexes at once is faster.
			return obstacle.index === highestIndex + direction || obstacle.index === lowestIndex + direction;
		});
		if (hitsStuff) return;

		const isInLeftBounds = lowestIndex % this.COLS !== 0;
		const isInRightBounds = highestIndex % this.COLS !== this.COLS - 1;

		if (direction < 0 && isInLeftBounds || direction > 0 && isInRightBounds) {
			this.activeStoneGroup.forEach((stone) => {
				stone.index += direction;
			});
		}
	}
	/**
	 * Rotate active stone group.
	 *
	 * @param {number} direction Either -1 for counter clockwise or 1 for clockwise.
	 */
	rotateActiveStoneGroup(direction) {
		if (this.activeStoneGroup === null) return;

		const stoneA = this.activeStoneGroup[0];
		const indexA = stoneA.index;
		const indexB = this.activeStoneGroup[1].index;

		const canRotate = (newIndexA) => {
			return (
				newIndexA >= 0 &&
				newIndexA < this.COLS * this.ROWS &&
				!hitsStuff(newIndexA, this.getObstacles())
			);
		};

		const rotateIfNeeded = (newIndexA) => {
			if (canRotate(newIndexA)) {
				stoneA.index = newIndexA;
			}
		};

		if (direction > 0) { // Clockwise.
			if (indexA === indexB - 1 && indexB - this.COLS > 0) { // A left of B, going up.
				rotateIfNeeded(indexB - this.COLS);
			} else if (indexA === indexB - this.COLS && indexB % this.COLS !== this.COLS - 1) { // A above B, going right.
				rotateIfNeeded(indexB + 1);
			} else if (indexA === indexB + 1 && Math.floor((indexB + this.COLS) / this.COLS) <= this.ROWS - 1) { // A right of B, going down.
				rotateIfNeeded(indexB + this.COLS);
			} else if (indexA === indexB + this.COLS && indexA % this.COLS !== 0) { // A below B, going left.
				rotateIfNeeded(indexB - 1);
			}
		} else if (direction < 0) { // Counter clockwise.
			if (indexA === indexB - 1 && Math.floor((indexB + this.COLS) / this.COLS) <= this.ROWS - 1) { // A left of B, going down.
				rotateIfNeeded(indexB + this.COLS);
			} else if (indexA === indexB - this.COLS && indexA % this.COLS !== 0) { // A above B, going left.
				rotateIfNeeded(indexB - 1);
			} else if (indexA === indexB + 1 && indexB - this.COLS > 0) { // A right of B, going up.
				rotateIfNeeded(indexB - this.COLS);
			} else if (indexA === indexB + this.COLS && indexB % this.COLS !== this.COLS - 1) { // A below B, going right.
				rotateIfNeeded(indexB + 1);
			}
		}
	}
	/**
	 * Get obstacles.
	 *
	 * @returns {Array} The obstacles.
	 */
	getObstacles() {
		return [...this.foeStones, ...this.playerStones];
	}
	/**
	 * Check if game is over.
	 *
	 * @returns {boolean} True if the game is over.
	 */
	isGameOver() {
		return this.activeStoneGroup.some((stone) => {
			return stone.index === this.INDEX_START_A && stone.sibling.index === this.INDEX_START_B;
		});
	}
}
