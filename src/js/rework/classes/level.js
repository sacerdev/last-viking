import { Base } from './base';

export class Level extends Base {
	constructor(game, index) {
		super()
		this.game = game;
		this.index = index;
		this.map = null;
		console.log({ level: this});
	}
}
