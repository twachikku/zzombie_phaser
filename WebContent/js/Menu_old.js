/**
 * Menu state.
 */
function Menu() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Menu.prototype = proto;

Menu.prototype.preload = function() {
	this.load.pack("start", "assets/assets-pack.json");
};

Menu.prototype.create = function() {
	this.stage.backgroundColor = "#555";
	this.world.width  = this.game.width;
	this.world.height = this.game.height;
	this.world.x=0;
	this.world.y=0;
	this.game.level = 1;
	this.game.maxLevel=3;
	this.game.score={coin:0,kill:0,heal:0,total:0,kstat:{dino:0,zombie1:0,zombie2:0,zombie3:0}};
	this.game.playmusic = true;
	this.game.playsound = true;
	
	//console.log(this.world);
	var sprite = this.add.sprite(0,0,"tap-to-start");
	sprite.anchor.set(0, 0);
	sprite.width=this.game.width;
	sprite.height=this.game.height;
	sprite.fixedToCamera = true;
	this.input.onDown.add(this.startGame, this);
};

Menu.prototype.startGame = function() {
	this.game.state.start("Level");
};