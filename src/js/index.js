/**
 * Depencencies.
 */
import { Game } from './game';

/**
 * Last Viking - Entry point.
 *
 * Start everything after the page has been loaded.
 */
window.addEventListener('load', () => {
	// For sound to work, the user must interact with the page first.
	// Use a simple button for that.
	//const startBtn = document.querySelector('#game--last-viking--start');
	// Prepare the canvas.
	const canvas = document.querySelector('#game--last-viking');
	const ctx = canvas.getContext('2d');

	canvas.width = 960;
	canvas.height = 544;
	ctx.imageSmoothingEnabled = false; // Gimme dem crispy pixels!

	// Load assets.
	const assets = {
		sprites: {
			viking: document.querySelector('#sprite--viking'),
			playerStones: document.querySelector('#sprite--player-stones'),
			foeStones: document.querySelector('#sprite--foe-stones'),
		}
	};
	//startBtn.addEventListener('click', (e) => {
		// Yeet the button.
		//e.target.remove();
		// Start the game.
		const game = new Game(canvas.width, canvas.height, assets);
		let lastTime = 0;
		// Game loop.
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
