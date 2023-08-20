export class Camera {
	constructor(target, w, h) {
		this.target = target;
		this.width = w;
		this.height = h;
		this.x = this.target.x - this.width / 2 + this.target.width / 2;
		this.y = this.target.y - this.height / 2 + this.target.height / 2;
	}
	update() {
		this.x = this.clampX(this.target.x - this.width / 2 + this.target.width / 2);
		this.y = this.target.y - this.height / 2 + this.target.height / 2;
		if (this.x <= 0) {
			this.target.game.offsetX -= this.target.speed;
		} else if (this.x >= this.target.game.width - this.width) {
			this.target.game.offsetX += this.target.speed * -1;
		}
	}
	clampX(x) {
		return Math.max(0, Math.min(this.target.game.width - this.width, x));
	}
}
