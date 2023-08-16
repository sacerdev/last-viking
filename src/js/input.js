const MOVEMENT_KEYS = ['ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
const KEY_DOWN_UP_KEYS = [...MOVEMENT_KEYS];

export class InputHandler {
	constructor() {
		this.keys = [];
		window.addEventListener('keydown', (e) => {
			if (KEY_DOWN_UP_KEYS.includes(e.key) && !this.keys.includes(e.key)) {
				this.keys.push(e.key);
			}
		});
		window.addEventListener('keyup', (e) => {
			if (KEY_DOWN_UP_KEYS.includes(e.key)) {
				this.keys.splice(this.keys.indexOf(e.key), 1);
			}
		});
	}
}
