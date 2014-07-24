function Tile(position,value) {
	this.x = position.x;
	this.y = position.y;
	this.value = value || 2;
	this.merge = false;
	this.insert = false;
	this.previous = null;

	this.previousPosition = null;
	this.mergeFrom = null;
}

Tile.prototype.updatePosition = function (position) {
	this.x = position.x;
	this.y = position.y;
};

Tile.prototype.savePosition = function () {
	this.previousPosition = { x: this.x, y: this.y };
};

