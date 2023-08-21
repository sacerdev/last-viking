export function collisionRect(x1, y1, w1, h1, x2, y2, w2, h2) {
	return (
		y1 + h1 >= y2 &&
		y1 <= y2 + h2 &&
		x1 <= x2 + w2 &&
		x1 + w1 >= x2
	);
}

export function getCollidingTiles(entity, tiles) {
	const collidingTiles = [];
	if (tiles.length > 0) {
		tiles.forEach((tile) => {
			if (
				collisionRect(
					entity.x, entity.y, entity.width, entity.height,
					tile.x, tile.y, tile.width, tile.height
				)
			) {
				collidingTiles.push(tile);
			}
		});
	}
	return collidingTiles;
}

export function maybeLandOnTile (entity, tile) {
	if (entity.y + entity.height > tile.y + tile.height) {
		entity.y = tile.y + tile.height;
		entity.veloY = 1;
	} else {
		entity.y = tile.y - entity.height;
		entity.veloY = 0;
		entity.standsOnTile = true;
	}
}
