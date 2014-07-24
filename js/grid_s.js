function Grid(size) {
	this.size = size;
	this.cells = this.empty();
}

Grid.prototype.empty = function () {
	var cells = [];
	for (var x = 0; x < this.size; x++) {
		cells[x] = [];
		for (var y = 0; y < this.size; y++) {
			cells[x].push(null);
		}
	}
	return cells;
};

Grid.prototype.resetMerge = function () {
	for (var x = 0; x < this.size; x++) {
		for  (var y = 0; y < this.size; y++) {
			if(this.cells[x][y]) {
				this.cells[x][y].merge = false;
			}
		}
	}
};

Grid.prototype.randomAvailableCell =function () {
	var cells = this.availableCells();
	if(cells.length) {
		return cells[Math.floor(Math.random()*cells.length)];
	}
};

Grid.prototype.availableCells = function () {
	var cells = [];
	for (var x = 0; x<this.size; x++) {
		for (var y = 0; y<this.size; y++) {
			if(!this.cells[x][y]) {
				cells.push({x:x,y:y});
			}
		}
	}
	return cells;
};

Grid.prototype.cellsAvailable = function () {
	return !!this.availableCells().length;
};

Grid.prototype.cellAvailabel = function (cell) {
	return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
	return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
	if (this.withBounds(cell)) {
		return this.cells[x][y];
	}
	else {
		return null;
	}
};

Grid.prototype.withBounds = function (cell) {
	return cell.x >= 0 && cell.x < this.size &&
	       cell.y >= 0 && cell.y < this.size;
};

Grid.prototype.insertTile = function (tile) {
	this.cells[tile.x][tile.y] = tile;
	this.cells[tile.x][tile.y].insert = true;
};

Grid.prototype.removeTile = function (tile) {
	this.cells[tile.x][tile.y] = null;
};

Grid.prototype.updateView = function () {
	for (var x = 0; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			var index = x*this.size+y;
			$(".game-cell:eq("+index+")").empty();
			if(this.cells[x][y]) {
				if(this.cells[x][y].insert) {
					$div_tile = $("<div class='tile tile-"+this.cells[x][y].value+"'><span class='show-num'>"+this.cells[x][y].value+"</span></div>");
					$(".game-cell:eq("+index+")").append($div_tile);
					$div_tile.css({"top":"50%","left":"50%","width":"0","height":"0"});
					$div_tile.animate({
						width:"106.25px",
						height:"106.25px",
						top:0,
						left:0
					},100);
					this.cells[x][y].insert=false;
				}
				else {
					if(this.cells[x][y].previousPosition)
					{
						var value=this.cells[x][y].merge ? this.cells[x][y].value/2 : this.cells[x][y].value;
						$div_tile = $("<div class='tile tile-"+value+"'><span class='show-num'>"+value+"</span></div>");
					    $(".game-cell:eq("+index+")").append($div_tile);
                        var tshift=(this.cells[x][y].previousPosition.x-x)*121.25;
						var lshift=(this.cells[x][y].previousPosition.y-y)*121.25;
					    $div_tile.css({"top":tshift+"px","left":lshift+"px"});
						$div_tile.animate({
							top:0,
							left:0
						},200);
						if(this.cells[x][y].merge) {
							$(".game-cell:eq("+index+")").empty();
							$div_tile = $("<div class='tile tile-"+this.cells[x][y].value+"'><span class='show-num'>"+this.cells[x][y].value+"</span></div>");
							$div_tile.css({"top":"50%","left":"50%","width":"0","height":"0"});
							$(".game-cell:eq("+index+")").append($div_tile);
							$div_tile.animate({
								width:"106.25px",
								height:"106.25px",
								top:0,
								left:0
							},100);
							this.cells[x][y].merge=false;
						}
						this.cells[x][y].previousPosition=null;
					}
					else
					{
						$div_tile = $("<div class='tile tile-"+this.cells[x][y].value+"'><span class='show-num'>"+this.cells[x][y].value+"</span></div>");
						$(".game-cell:eq("+index+")").append($div_tile);
					}
				}
			}
		}
	}
};

Grid.prototype.moveLeft = function () {
	var flag = false;
	for (var x = 0; x < this.size; x++) {
		for (var y = 1; y < this.size; y++) {
			if(this.cells[x][y]) {
				var k = y-1;
				while(k>=0 && !this.cells[x][k] )
					k--;
				if(k>=0 && this.cells[x][k].value == this.cells[x][y].value && !this.cells[x][k].merge ) {
					this.cells[x][k].value+=this.cells[x][y].value;
					this.cells[x][k].merge=true;
					this.cells[x][k].previousPosition={x:x,y:y};
					this.cells[x][y]=null;
					flag=true;
				}
				else
				{
					if(k+1 != y) {
						this.cells[x][k+1]=this.cells[x][y];
					    this.cells[x][k+1].previousPosition={x:x,y:y};
						this.cells[x][y]=null;
						flag=true;
					}
				}
			}
		}
	}
	return flag;
};

Grid.prototype.moveRight = function () {
	var flag = false;
	for (var x = 0; x < this.size; x++) {
		for (var y = this.size-2; y >= 0; y--) {
			if(this.cells[x][y]) {
				var k = y+1;
				while(k<this.size && !this.cells[x][k])
					k++;
				if(k<this.size && this.cells[x][k].value == this.cells[x][y].value && !this.cells[x][k].merge) {
					this.cells[x][k].value+=this.cells[x][y].value;
					this.cells[x][k].merge=true;
					this.cells[x][k].previousPosition={x:x,y:y};
					this.cells[x][y]=null;
					flag=true;
				}
				else
				{
					if(k-1 != y) {
						this.cells[x][k-1]=this.cells[x][y];
					    this.cells[x][k-1].previousPosition={x:x,y:y};
						this.cells[x][y]=null;
						flag=true;
					}
				}
			}
		}
	}
	return flag;
};
				
Grid.prototype.moveUp = function () {
	var flag = false;
	for (var y = 0; y < this.size; y++) {
		for (var x = 1; x < this.size; x++) {
			if(this.cells[x][y]) {
				var k = x-1;
				while(k>=0 && !this.cells[k][y])
					k--;
				if(k>=0 && this.cells[k][y].value == this.cells[x][y].value && !this.cells[k][y].merge) {
					this.cells[k][y].value+=this.cells[x][y].value;
					this.cells[k][y].merge=true;
					this.cells[k][y].previousPosition={x:x,y:y};
					this.cells[x][y]=null;
					flag=true;
				}
				else
				{
					if(k+1 != x) {
						this.cells[k+1][y]=this.cells[x][y];
					    this.cells[k+1][y].previousPosition={x:x,y:y};
						this.cells[x][y]=null;
						flag=true;
					}
				}
			}
		}
	}
	return flag;
};


Grid.prototype.moveDown = function () {
	var flag = false;
	for (var y = 0; y < this.size; y++) {
		for (var x = this.size-2; x >=0 ; x--) {
			if(this.cells[x][y]) {
				var k = x+1;
				while(k<this.size && !this.cells[k][y])
					k++;
				if(k<this.size && this.cells[k][y].value == this.cells[x][y].value && !this.cells[k][y].merge) {
					this.cells[k][y].value+=this.cells[x][y].value;
					this.cells[k][y].merge=true;
					this.cells[k][y].previousPosition={x:x,y:y};
					this.cells[x][y]=null;
					flag=true;
				}
				else
				{
					if(k-1 != x) {
						this.cells[k-1][y]=this.cells[x][y];
					    this.cells[k-1][y].previousPosition={x:x,y:y};
						this.cells[x][y]=null;
						flag=true;
					}
				}
			}
		}
	}
	return flag;
};

Grid.prototype.noMerge = function () {
	for (var x = 0; x < this.size; x++) {
		for (var y = 1; y < this.size; y++) {
			if(this.cells[x][y].value==this.cells[x][y-1].value)
				return false;
		}
	}

	for (var x = 1; x < this.size; x++) {
		for (var y = 0; y < this.size; y++) {
			if(this.cells[x][y].value==this.cells[x-1][y].value)
				return false;
		}
	}
	return true;
};





