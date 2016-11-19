window.onload = function() {
	// Create your Phaser game and inject it into an auto-created canvas.
	// We did it in a window.onload event, but you can do it anywhere (requireJS
	// load, anonymous function, jQuery dom ready, - whatever floats your boat)
	var ua = navigator.userAgent;
	var game=null;
	if (/Windows/.test(ua)){
	 game = new Phaser.Game(800,600, Phaser.AUTO);
	}else{
	 game = new Phaser.Game(640,340, Phaser.AUTO);
		
	}
	// Add the States your game has.
	game.state.add("Boot", Boot);
	game.state.add("Menu", Menu);
	game.state.add("Preload", Preload);
	game.state.add("Level", Level);
	game.state.add("Win", Win);
	game.state.add("GameOver", GameOver);

	// Now start the Boot state.
	game.state.start("Boot");
};
