/**
 * Dependencies.
 */
import { FoeStone, PlayerStone, STONE_GROUPS, STONE_TYPES } from '../../classes/stones';

/**
 * Get random stone group.
 *
 * @param {Object} parent The parent object to get bounds from.
 *
 * @returns {Array} The stone group.
 */
export function getRandomStoneGroup(parent) {
	// Get random stone group.
	const stoneGroup = STONE_GROUPS[Math.floor(Math.random() * STONE_GROUPS.length)];
	// Create stones.
	const stoneA = new PlayerStone(parent, stoneGroup[0], parent.INDEX_START_A);
	const stoneB = new PlayerStone(parent, stoneGroup[1], parent.INDEX_START_B);
	// Set siblings.
	stoneA.setSibling(stoneB);
	stoneB.setSibling(stoneA);
	return [stoneA, stoneB];
}

/**
 * Get foe stones.
 *
 * @param {number} amount The amount of foe stones to get.
 * @param {Object} parent The parent object to get bounds from.
 *
 * @returns {Array} The foe stones.
 */
export function getFoeStones(amount, parent) {
	const stones = [];
	// Get available indexes.
	const offsetY = 3;
	const availableIndexes = [];
	// FoeStones get set first, so the field must be empty anways.
	for (let i = parent.COLS * offsetY; i < parent.COLS * parent.ROWS; i++) {
		availableIndexes.push(i);
	}
	// Create random foe stones.
	for (let i = 0; i < amount; i++) {
		const index = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
		const stoneType = Math.floor(Math.random() * STONE_TYPES.length);
		stones.push(new FoeStone(parent, stoneType, index));
		availableIndexes.splice(availableIndexes.indexOf(index), 1);
	}
	return stones;
}

/**
 * Move stone group down.
 *
 * @param {Array} stoneGroup The stone group to move down.
 * @param {Array} obstacles The obstacles to check for collision.
 * @param {Object} parent The parent object to get bounds from.
 *
 * @returns {Array} The result of the move.
 */
export function moveStoneGroupDown(stoneGroup, obstacles, parent) {
	let canMove = [false, false];
	stoneGroup.forEach((stone, si) => {
		canMove[si] = canMoveTo(stone.index + parent.COLS, obstacles, parent);
	});

	// Both stones must be able to move down.
	if (canMove[0] && canMove[1]) {
		stoneGroup.forEach((stone) => {
			stone.index += parent.COLS;
		});
	}
	return canMove;
}

/**
 * Check if stone group can move to index.
 *
 * @param {number} index The index to check.
 * @param {Array} obstacles The obstacles to check for collision.
 * @param {Object} parent The parent object to get bounds from.
 *
 * @returns {boolean} True if the stone group can move to the index.
 */
export function canMoveTo(index, obstacles, parent) {
	// Check bounds.
	// Do that one after another to spare some runtime.
	const isOnBottom = Math.floor(index / parent.COLS) === parent.ROWS;
	if (isOnBottom) {
		return false;
	}
	// If in bounds check for collision with obstacles.
	const hitsStuff = hitsStuff(index, obstacles);
	return !hitsStuff;
}

/**
 * Check if index hits stuff.
 *
 * @param {number} index The index to check.
 * @param {Array} obstacles The obstacles to check for collision.
 *
 * @returns {boolean} True if the index hits stuff.
 */
export function hitsStuff(index, obstacles) {
	return obstacles.some((obstacle) => {
		return obstacle.index === index;
	});
}
