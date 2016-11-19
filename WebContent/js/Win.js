/**
 * Menu state.
 */
function Win() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Win.prototype = proto;

Win.prototype.preload = function() {
	this.load.pack("win", "assets/assets-pack.json");
};

Win.prototype.create = function() {
	g=this.add.group();
	var sprite = this.add.sprite(400,240,"win-state",null,g);
	sprite.fixedToCamera = true;
	sprite.anchor.set(0.5, 0.5);
	
	this.input.onDown.add(this.startGame, this);
};

Win.prototype.startGame = function() {
	this.game.state.start("Menu");
};