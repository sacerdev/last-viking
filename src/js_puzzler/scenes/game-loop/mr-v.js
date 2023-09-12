import { Base } from '../../classes/base';
import { Animator } from '../../classes/animator';

export class MrV extends Base {
	constructor(game) {
		super();

		this.width = 64;
		this.height = 64;

		this.spriteWidth = 32;
		this.spriteHeight = 32;

		this.animator = new VikingAnimator(this, game.assets.sprites.viking, 32);
	}
	draw(context, x, y) {
		this.animator.draw(context, x, y);
	}
	update(deltaTime) {
		this.animator.update(deltaTime);
	}
}

class VikingAnimator extends Animator {
	constructor(parent, sprite, spriteWidth, spriteHeight) {
		super(parent);

		this.sprite = sprite;
		this.spriteWidth = spriteWidth;
		this.spriteHeight = spriteHeight || spriteWidth;
		this.frameX = 0;
		this.frameY = 0;

		this.animations = [
			{ // IDLE.
				startFrameX: 0,
				startFrameY: 0,
				maxFrame: 4,
				fps: 2,
				loop: true,
			},
		];

		this.currentAnimation = this.animations[0];
	}
	draw(context, x, y) {
		context.drawImage(
			this.sprite, // Image.
			this.frameX * this.spriteWidth, // Source x.
			this.frameY * this.spriteHeight, // Source y.
			this.spriteWidth, // Source width.
			this.spriteHeight, // Source height.
			x, // Destination x.
			y, // Destination y.
			this.parent.width, // Destination width.
			this.parent.height // Destination height.
		);
	}
}
