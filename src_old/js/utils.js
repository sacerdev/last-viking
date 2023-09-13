export function collisionRect(x1, y1, w1, h1, x2, y2, w2, h2) {
	return (
		y1 + h1 >= y2 &&
		y1 <= y2 + h2 &&
		x1 <= x2 + w2 &&
		x1 + w1 >= x2
	);
}

export function getCollidingObjects(entity, objects) {
	const collidingObjects = [];
	if (objects.length > 0) {
		objects.forEach((obj) => {
			if (
				collisionRect(
					entity.x, entity.y, entity.width, entity.height,
					obj.x, obj.y, obj.width, obj.height
				)
			) {
				collidingObjects.push(obj);
			}
		});
	}
	return collidingObjects;
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
