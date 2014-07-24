function GameManager(size) {
	this.size = size;
	this.startTiles = 2;
	this.setup();
}

GameManager.prototype.setup = function () {
	this.grid = new Grid(this.size);
	this.addStartTiles();
	this.updateView();
};

GameManager.prototype.addStartTiles = function () {
	for(var i=0;i<this.startTiles;i++) {
		this.addRandomTile();
	}
};

GameManager.prototype.addRandomTile = function () {
	if(this.grid.cellsAvailable()) {
		var value = Math.random() < 0.5 ? 2 : 4;
		var tile = new Tile(this.grid.randomAvailableCell(),value);
		this.grid.insertTile(tile);
	}
}

GameManager.prototype.updateView = function () {
	this.grid.updateView();
};

GameManager.prototype.move = function (keycode) {
	var flag=false;
	switch(keycode) {
		case 37:
			flag=this.grid.moveLeft();
			break;
		case 38:
			flag=this.grid.moveUp();
			break;
		case 39:
			flag=this.grid.moveRight();
			break;
		case 40:
			flag=this.grid.moveDown();
			break;
		default:
			break;
	}
	if(flag) {
		this.addRandomTile();
		this.updateView();
		if(this.isGameover())
			alert("Game Over");
	}
};

GameManager.prototype.isGameover = function () {
	if(!this.grid.cellsAvailable() && this.grid.noMerge())
		return true;
	else
		return false;
};
