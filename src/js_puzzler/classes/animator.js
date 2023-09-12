import { Base } from './base.js';

export class Animator extends Base {
	constructor(parent) {
		super();
		this.parent = parent;
		this.frameTimer = 0;

		this.animations = [];
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
				if (this.frameX < maxFrame) {
					this.frameX++;
				} else if (loop) {
					this.frameX = 0;
				}
			} else if (this.frameX <= maxFrame) {
				this.frameTimer += deltaTime;
			}
		}
	}
}
