import { Animator } from '../classes/animator';

export class PlayerAnimator extends Animator {
	constructor(parent) {
		super(parent);

		this.animations = {
			IDLE: {
				startFrameX: 0,
				startFrameY: 0,
				maxFrame: 4,
				fps: 2,
				loop: true,
			},
			RUNNING: {
				startFrameX: 0,
				startFrameY: 1,
				maxFrame: 2,
				fps: 4 * this.parent.maxSpeed,
				loop: true,
			},
			JUMPING: {
				startFrameX: 1,
				startFrameY: 2,
				maxFrame: 1,
				fps: 1,
				loop: false,
			},
			FALLING: {
				startFrameX: 1,
				startFrameY: 2,
				maxFrame: 1,
				fps: 1,
				loop: false,
			},
		}
	}
}

export class WeaponAnimator extends Animator {
	constructor(weapon) {
		super(weapon);
		this.weapon = this.parent;
		this.offsets = {
			IDLE: [[46, 34], [46, 36], [46, 36], [46, 38], [46, 36]],
			RUNNING: [[46, 34], [48, 32], [46, 34]],
			JUMPING: [[46, 34], [46, 34]],
			FALLING: [[46, 34], [46, 34]],
			ATTACKING: [[46, 32], [48, 32], [46, 32]],
		};
		this.currentOffset = 0;
		this.attackTimer = 0;
		this.attackFrame = 0;
		this.offY = 0;
	}
	update(deltaTime) {
		const [offX, offY] = this.getOffset()[this.weapon.parent.frameX];
		this.weapon.x += offX;
		this.weapon.y += offY + this.offY;
		if (this.weapon.isAttacking) {
			this.playAttack(deltaTime);
		}
	}
	getOffset() {
		return this.offsets[Object.keys(this.offsets)[this.currentOffset]];
	}
	play(state) {
		if (state === 'ATTACKING') {
			this.isAttacking = true;
		}
		this.currentOffset = Object.keys(this.offsets).indexOf(state);
	}
	playAttack(deltaTime) {
		if (this.attackTimer > 1000 / 10) {
			if (this.attackFrame === 1) {
				this.weapon.frameX = 1;
				this.weapon.rotate = false;
			} else if (this.attackFrame === 2) {
				this.weapon.frameX = 0;
				this.weapon.rotate = false;
				this.offY += this.weapon.height - 4;
			} else if (this.attackFrame > 2) {
				this.weapon.frameX = 1;
				this.weapon.rotate = false;
				this.weapon.isAttacking = false;
				this.attackFrame = -1;
				this.attackTimer = 0;
				this.offY = 0;
			}

			this.attackFrame++;
			this.attackTimer = 0;
		}
		this.attackTimer += deltaTime;
	}
}
