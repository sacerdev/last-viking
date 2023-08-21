export class Camera {
	constructor(target, w, h) {
		this.target = target;
		this.width = w;
		this.height = h;
		this.x = this.target.x - this.width / 2 + this.target.width / 2;
		this.y = this.target.y - this.height / 2 + this.target.height / 2;
	}
	update() {
		const map = this.target.game.getCurrentLevel().map;
		const inLeftBounds = map.minCol * 32 < this.target.x - (this.width / 2 - this.target.width / 2);
		const inRightBounds = map.maxCol * 32 > this.target.x + (this.width / 2 - this.target.width / 2);

		if (this.x <= 0 && inLeftBounds && inRightBounds) {
			this.target.game.offsetX -= this.target.speed;
		}
	}
	clampX(x) {
		return Math.max(0, Math.min(this.target.game.width - this.width, x));
	}
}
