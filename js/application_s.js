$(document).ready(function () {
	gm = new GameManager(4);
	$(".new-game").bind("click",function () {gm.setup();});
	$(document).keydown( function (event) {
		gm.move(event.keyCode);
	});
});
