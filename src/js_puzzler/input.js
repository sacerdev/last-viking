const LEFT_KEY = 'a';
const RIGHT_KEY = 'd';
const ROTATE_CW_KEY = 'e';
const ROTATE_CCW_KEY = 'q';
const DOWN_KEY = 's';
const DROP_KEY = ' ';

export class InputHandler {
	constructor() {
		this.leftPressed = 0;
		this.rightPressed = 0;
		this.rotateClockwisePressed = 0;
		this.rotateCounterClockwisePressed = 0;
		this.dropPressed = 0;

		document.addEventListener('keydown', (event) => {
			const key = event.key.toLowerCase();
			if (key === LEFT_KEY) {
				this.leftPressed = 1;
			} else if (key === RIGHT_KEY) {
				this.rightPressed = 1;
			} else if (key === ROTATE_CW_KEY) {
				this.rotateClockwisePressed = 1;
			} else if (key === ROTATE_CCW_KEY) {
				this.rotateCounterClockwisePressed = 1;
			} else if (key === DROP_KEY) {
				this.dropPressed = 1;
			}
		});

		document.addEventListener('keyup', (event) => {
			const key = event.key.toLowerCase();
			if (key === LEFT_KEY) {
				this.leftPressed = 0;
			} else if (key === RIGHT_KEY) {
				this.rightPressed = 0;
			} else if (key === ROTATE_CW_KEY) {
				this.rotateClockwisePressed = 0;
			} else if (key === ROTATE_CCW_KEY) {
				this.rotateCounterClockwisePressed = 0;
			} else if (key === DROP_KEY) {
				this.dropPressed = 0;
			}
		});
	}
}
