import { Node2D } from '../node2D';

export class Level extends Node2D {
	constructor(game, index) {
		super(game)
		this.index = index;
		this.map = null;
	}
}
