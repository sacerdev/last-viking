import { Entity } from '../classes/entities';
import { WeaponAnimator } from './animator';
import { AttackingWeaponState, IdleWeaponState } from './states';

export class Weapon extends Entity {
	constructor(parent) {
		super(parent.game);
		this.parent = parent;
		this.animator = new WeaponAnimator(this);

		this.width = 24;
		this.height = 16;
		this.x = this.parent.x;
		this.y = this.parent.y;

		this.sprite = this.parent.game.assets.sprites.weapon;
		this.spriteWidth = 12;
		this.spriteHeight = 8;
		this.frameX = 1;
		this.rotate = false;

		this.isAttacking = false;
		this.states = [
			new IdleWeaponState(this),
			new AttackingWeaponState(this),
		];
		this.currentState = this.states[0];
		this.currentState.enter();
	}
	draw(context) {
		let destX = (this.parent.directionH === 1) ? this.x : -this.x - this.width + this.parent.width - this.spriteWidth;
		let destY = this.y;

		context.save(); // Save the current transformation state.

		if (this.rotate) {
			context.translate(destX, destY + this.height);
			context.rotate(Math.PI/2 * 3);
			// Adjust the drawing coordinates
			destX = 0; // The rotated X coordinate
			destY = 0;
		}

		context.drawImage(
			this.sprite, // Image.
			this.frameX * this.spriteWidth, // Source x.
			0, // Source y.
			this.spriteWidth, // Source width.
			this.spriteHeight, // Source height.
			destX, // Destination x.
			destY, // Destination y.
			this.width, // Destination width.
			this.height // Destination height.
		);
		context.restore(); // Restore the previous transformation state.
	}
	update(deltaTime) {
		this.x = this.parent.x;
		this.y = this.parent.y;
		this.animator.update(deltaTime);
		this.currentState.update(deltaTime);
	}
}
