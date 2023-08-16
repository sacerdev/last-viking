import { Game } from './game';

window.addEventListener('load', () => {
	const canvas = document.querySelector('#game--last-viking');
	const ctx = canvas.getContext('2d');

	canvas.width = 960;
	canvas.height = 540;
	ctx.imageSmoothingEnabled = false;

	const assets = {
		sprites: {
			viking: document.querySelector('#sprite--viking'),
		}
	};
	const game = new Game(canvas.width, canvas.height, assets);
	let lastTime = 0;
	function gameLoop(time) {
		const deltaTime = time - lastTime;
		lastTime = time;
		game.update(deltaTime);
		game.draw(ctx);
		requestAnimationFrame(gameLoop);
	}
	gameLoop(0);
});
