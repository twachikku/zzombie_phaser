/**
 * Menu state.
 */
function GameOver() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
GameOver.prototype = proto;

GameOver.prototype.preload = function() {
	this.load.pack("gameover", "assets/assets-pack.json");
};

GameOver.prototype.create = function() {
	g=this.add.group();
	g.enableBody=false;
	this.world.bringToTop(g);
	var sprite = this.add.sprite(400,240, "gameover",null);
	sprite.anchor.set(0.5, 0.5);
	sprite.fixedToCamera = true;
	
	this.input.onDown.add(this.startGame, this);
};

GameOver.prototype.startGame = function() {
	this.game.state.start("Menu");
};