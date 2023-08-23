import { Base } from './base.js';

export class Animator extends Base {
	constructor(parent) {
		super();
		this.parent = parent;
		this.frameTimer = 0;

		this.animations = {}
		this.currentAnimation = null;
	}
	update(deltaTime) {
		this.animate(deltaTime);
	}
	animate(deltaTime) {
		if (this.currentAnimation !== null) {
			const { loop, maxFrame, fps } = this.currentAnimation;

			if (this.frameTimer > 1000 / fps) {
				if (loop) {
					this.frameTimer = 0;
				}
				if (this.parent.frameX < maxFrame) {
					this.parent.frameX++;
				} else if (loop) {
					this.parent.frameX = 0;
				}
			} else if (this.parent.frameX <= maxFrame) {
				this.frameTimer += deltaTime;
			}
		}
	}
	play(index) {
		this.frameTimer = 0;
		console.log(this.animations);
		this.currentAnimation = this.animations[index] || null;
		if (this.currentAnimation !== null) {
			this.parent.frameX = this.currentAnimation.startFrameX;
			this.parent.frameY = this.currentAnimation.startFrameY;
		}
	}
}
