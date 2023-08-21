import { Game } from './game';

window.addEventListener('load', () => {
	//const startBtn = document.querySelector('#game--last-viking--start');
	const canvas = document.querySelector('#game--last-viking');
	const ctx = canvas.getContext('2d');

	canvas.width = 960;
	canvas.height = 544;
	ctx.imageSmoothingEnabled = false;

	const assets = {
		sprites: {
			viking: document.querySelector('#sprite--viking'),
			weapon: document.querySelector('#sprite--weapon'),
			tiles: document.querySelector('#sprite--tiles'),
		}
	};
	//startBtn.addEventListener('click', (e) => {
		//e.target.remove();
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
	//});
});
