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
				fps: 16,
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
