import { Scene } from '../../classes/scene';
import { FoeStone, PlayerStone, Stone, STONE_GROUPS, STONE_TYPES } from '../../classes/stones';

const COLS = 8;
const ROWS = 16;

export class GameLoop extends Scene {
	constructor(game) {
		super(game);

		this.level = 1;

		this.tiles = new Array(COLS * ROWS).fill(0);

		this.tileSize = 32;
		this.tilePadding = 2;

		this.speed = 1;
		this.counter = 0;

		this.isGameOver = false;

		this.isDropping = false;

		this.addNewStoneGroup();
		this.addFoeStones(this.level * 3);
	}
	draw(context) {
		this.offsetX = this.game.width / 2 - this.tileSize * COLS / 2;
		this.offsetY = this.game.height / 2 - this.tileSize * ROWS / 2;

		this.tiles.forEach((tile, index) => {
			const x = (index % COLS) * this.tileSize + this.offsetX;
			const y = Math.floor(index / COLS) * this.tileSize + this.offsetY;
			context.strokeStyle = '#000';
			context.strokeRect(x, y, this.tileSize, this.tileSize);
			if (tile instanceof Stone) {
				tile.draw(context, x, y)
			}
		});
	}
	update(deltaTime) {
		if (!this.isGameOver) {
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
		} else if (input.dropPressed === 1) {
			console.log('put down');
			this.isDropping = true;
			input.dropPressed++;
		}
	}
	moveActiveStoneGroupSideways(direction) {
		const newIndexA = this.activeStoneGroup[0] + direction;
		const newIndexB = this.activeStoneGroup[1] + direction;
		const highestIndex = Math.max(...this.activeStoneGroup);
		const lowestIndex = Math.min(...this.activeStoneGroup);

		if (direction > 0 && highestIndex % COLS !== COLS - 1) {
			// Moving right.
			if (newIndexA > newIndexB) {
				// Move stone A.
				this.tiles[newIndexA] = this.tiles[this.activeStoneGroup[0]];
				this.tiles[this.activeStoneGroup[0]] = 0;
				this.activeStoneGroup[0] = newIndexA;
				// Move stone B.
				this.tiles[newIndexB] = this.tiles[this.activeStoneGroup[1]];
				this.tiles[this.activeStoneGroup[1]] = 0;
				this.activeStoneGroup[1] = newIndexB;
			} else {
				// Move stone B.
				this.tiles[newIndexB] = this.tiles[this.activeStoneGroup[1]];
				this.tiles[this.activeStoneGroup[1]] = 0;
				this.activeStoneGroup[1] = newIndexB;
				// Move stone A.
				this.tiles[newIndexA] = this.tiles[this.activeStoneGroup[0]];
				this.tiles[this.activeStoneGroup[0]] = 0;
				this.activeStoneGroup[0] = newIndexA;
			}
		} else if (direction < 0 && lowestIndex % COLS !== 0) {
			// Moving left.
			if (newIndexA < newIndexB) {
				// Move stone A.
				this.tiles[newIndexA] = this.tiles[this.activeStoneGroup[0]];
				this.tiles[this.activeStoneGroup[0]] = 0;
				this.activeStoneGroup[0] = newIndexA;
				// Move stone B.
				this.tiles[newIndexB] = this.tiles[this.activeStoneGroup[1]];
				this.tiles[this.activeStoneGroup[1]] = 0;
				this.activeStoneGroup[1] = newIndexB;
			} else {
				// Move stone B.
				this.tiles[newIndexB] = this.tiles[this.activeStoneGroup[1]];
				this.tiles[this.activeStoneGroup[1]] = 0;
				this.activeStoneGroup[1] = newIndexB;
				// Move stone A.
				this.tiles[newIndexA] = this.tiles[this.activeStoneGroup[0]];
				this.tiles[this.activeStoneGroup[0]] = 0;
				this.activeStoneGroup[0] = newIndexA;
			}
		}
	}
	rotateActiveStoneGroup(direction) {
		if (this.activeStoneGroup === null) return;

		const indexA = this.activeStoneGroup[0];
		const indexB = this.activeStoneGroup[1];
		const stoneA = this.tiles[indexA];

		const canRotate = (newIndexA) => {
			return (
				newIndexA >= 0 &&
				newIndexA < COLS * ROWS &&
				this.tiles[newIndexA] === 0
			);
		};

		const rotateIfNeeded = (newIndexA) => {
			if (canRotate(newIndexA)) {
				this.tiles[newIndexA] = stoneA;
				this.tiles[indexA] = 0;
				this.activeStoneGroup[0] = newIndexA;
			}
		};

		if (direction > 0) { // Clockwise.
			if (indexA === indexB - 1 && indexB - COLS > 0) { // A left of B, going up.
				rotateIfNeeded(indexB - COLS);
			} else if (indexA === indexB - COLS && indexB % COLS !== COLS - 1) { // A above B, going right.
				rotateIfNeeded(indexB + 1);
			} else if (indexA === indexB + 1 && Math.floor((indexB + COLS) / COLS) <= ROWS - 1) { // A right of B, going down.
				rotateIfNeeded(indexB + COLS);
			} else if (indexA === indexB + COLS && indexA % COLS !== 0) { // A below B, going left.
				rotateIfNeeded(indexB - 1);
			}
		} else if (direction < 0) { // Counter clockwise.
			if (indexA === indexB - 1 && Math.floor((indexB + COLS) / COLS) <= ROWS - 1) { // A left of B, going down.
				rotateIfNeeded(indexB + COLS);
			} else if (indexA === indexB - COLS && indexA % COLS !== 0) { // A above B, going left.
				rotateIfNeeded(indexB - 1);
			} else if (indexA === indexB + 1 && indexB - COLS > 0) { // A right of B, going up.
				rotateIfNeeded(indexB - COLS);
			} else if (indexA === indexB + COLS && indexB % COLS !== COLS - 1) { // A below B, going right.
				rotateIfNeeded(indexB + 1);
			}
		}
	}
	moveActiveStoneGroupDown() {
		if (this.activeStoneGroup === null) return;
		const [indexA, indexB] = this.activeStoneGroup;
		const [newIndexA, newIndexB] = [indexA + COLS, indexB + COLS];

		const isOnBottomA = Math.floor(this.indexA / COLS) === ROWS - 1;
		const isOnBottomB = Math.floor(this.indexB / COLS) === ROWS - 1;

		const canMoveA = newIndexA === indexB || newIndexA < COLS * ROWS && this.tiles[newIndexA] === 0 && !isOnBottomA;
		const canMoveB = newIndexB === indexA || newIndexB < COLS * ROWS && this.tiles[newIndexB] === 0 && !isOnBottomB;
		if (canMoveA && canMoveB) {
			if (newIndexA > newIndexB) {
				// Move stone A.
				this.tiles[newIndexA] = this.tiles[indexA];
				this.tiles[indexA] = 0;
				this.activeStoneGroup[0] = newIndexA;
				// Move stone B.
				this.tiles[newIndexB] = this.tiles[indexB];
				this.tiles[indexB] = 0;
				this.activeStoneGroup[1] = newIndexB;
			} else {
				// Move stone B.
				this.tiles[newIndexB] = this.tiles[indexB];
				this.tiles[indexB] = 0;
				this.activeStoneGroup[1] = newIndexB;
				// Move stone A.
				this.tiles[newIndexA] = this.tiles[indexA];
				this.tiles[indexA] = 0;
				this.activeStoneGroup[0] = newIndexA;
			}
		} else {
			this.handleStoneDropped();
		}
	}
	handleStoneDropped() {
		// Check for >= 4 matching stone types horizontally.
		const [indexA, indexB] = this.activeStoneGroup;
		const indexDiff = Math.max(...this.activeStoneGroup) - Math.min(...this.activeStoneGroup);
		const matchingHorizontalA = this.getHorizontalMatches(indexA);
		const matchingHorizontalB = this.getHorizontalMatches(indexB);
		const matchingVerticalA = this.getVerticalMatches(indexA);
		const matchingVerticalB = this.getVerticalMatches(indexB);

		let markedAsDead = [];

		if (matchingHorizontalA.length >= 4) {
			markedAsDead = [...markedAsDead, ...matchingHorizontalA];
		}
		if (matchingHorizontalB.length >= 4) {
			markedAsDead = [...markedAsDead, ...matchingHorizontalB];
		}
		if (matchingVerticalA.length >= 4) {
			markedAsDead = [...markedAsDead, ...matchingVerticalA];
		}
		if (matchingVerticalB.length >= 4) {
			markedAsDead = [...markedAsDead, ...matchingVerticalB];
		}
		markedAsDead = [...new Set(markedAsDead)];
		// TODO: score and animations n stuff.
		markedAsDead?.forEach((index) => {
			this.tiles[index].isAlive = false;
			this.tiles[index] = 0;
		});
		// TODO: handle PlayerStone with siblings.
		// Maybe change sibling property to position offset for proper sibling check.
		// All PlayerStone entities should fall down.
		// All PlayerStone entities with siblings must fall down together.
		this.addNewStoneGroup();
	}
	getHorizontalMatches(start) {
		const matchingIndizes = [start];

		let countToLeft = start - 1;
		while (countToLeft % COLS !== COLS - 1 && this.tiles[countToLeft] instanceof Stone && this.tiles[countToLeft].type === this.tiles[start].type) {
			matchingIndizes.push(countToLeft);
			countToLeft--;
		}
		let countToRight = start + 1;
		while (countToRight % COLS !== 0 && this.tiles[countToRight] instanceof Stone && this.tiles[countToRight].type === this.tiles[start].type) {
			matchingIndizes.push(countToRight);
			countToRight++;
		}
		return matchingIndizes;
	}
	getVerticalMatches(start) {
		const matchingIndizes = [start];

		let countToTop = start - COLS;
		while (countToTop > 0 && this.tiles[countToTop] instanceof Stone && this.tiles[countToTop].type === this.tiles[start].type) {
			matchingIndizes.push(countToTop);
			countToTop -= COLS;
		}
		let countToBottom = start + COLS;
		while (countToBottom < COLS * ROWS && this.tiles[countToBottom] instanceof Stone && this.tiles[countToBottom].type === this.tiles[start].type) {
			matchingIndizes.push(countToBottom);
			countToBottom += COLS;
		}
		return matchingIndizes;
	}
	getRandomStoneGroup() {
		// Get random stone group.
		const stoneGroup = STONE_GROUPS[Math.floor(Math.random() * STONE_GROUPS.length)];
		const stoneA = new PlayerStone(this, stoneGroup[0]);
		const stoneB = new PlayerStone(this, stoneGroup[1]);
		stoneA.setSibling(stoneB);
		stoneB.setSibling(stoneA);
		return [stoneA, stoneB];
	}
	addStonegroupToTiles(stoneGroup) {
		// Add stone group to tiles.
		const initA = 3;// + COLS * 4;
		const initB = 4;// + COLS * 4;
		if (this.tiles[initA] !== 0 || this.tiles[initB] !== 0) {
			this.isGameOver = true;
			console.log('game over');
		} else {
			this.tiles[initA] = stoneGroup[0];
			this.tiles[initB] = stoneGroup[1];
			this.activeStoneGroup = [initA, initB];
			this.isDropping = false;
		}
	}
	addNewStoneGroup() {
		const newStoneGroup = this.getRandomStoneGroup();
		this.activeStoneGroup = null;
		this.addStonegroupToTiles(newStoneGroup);
	}
	addFoeStones(amount) {
		// Get available indexes.
		const offsetY = 3;
		const availableIndexes = [];
		for (let i = COLS * offsetY; i < this.tiles.length; i++) {
			if (this.tiles[i] === 0) {
				availableIndexes.push(i);
			}
		}
		// Create random foe stones.
		for (let i = 0; i < amount; i++) {
			const index = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
			const stoneType = Math.floor(Math.random() * STONE_TYPES.length);
			this.tiles[index] = new FoeStone(this, stoneType);
			availableIndexes.splice(availableIndexes.indexOf(index), 1);
		}
	}
}
