/**
 * Preload state.
 */
function Preload() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Preload.prototype = proto;

Preload.prototype.preload = function() {
	
	var txt1=this.add.text(this.world.centerX,250,"322-218 Basic of Game Programming",
			 {font:"28px Arial",fill:"#f00"});
	txt1.anchor.set(0.5,0.5);
	var txt2=this.add.text(this.world.centerX,300,"Department of Computer Science\Faculty of Science\nKhon Kaen University, Thailand.",
			 {font:"16px Arial",fill:"#bb0",align:"center"});	
	txt2.anchor.set(0.5,0.5);

	// This sets the preloadBar sprite as a loader sprite.
	// What that does is automatically crop the sprite from 0 to full-width
	// as the files below are loaded in.
	this.aloaded = false;
	this.logoshown = false;
	this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY,
			"loading");
	this.preloadBar.anchor.set(0.5, 0.5);
	this.load.setPreloadSprite(this.preloadBar);
	
	
	// Here we load the rest of the assets our game needs.
	this.load.pack("start", "assets/assets-pack.json");
	this.load.pack("level", "assets/assets-pack.json");
	this.game.time.events.add(200,this.step1,this);
};
Preload.prototype.step1=function(){
	var logo = this.add.sprite(this.world.centerX,0,"logo");
	logo.anchor.set(0.5, 1);
	//logo.alpha = 0.5;
	logo.scale.set(0.1);
	//var tw = this.add.tween(logo);
	//tw.to({y:100,alpha:1},1000,"Elastic",true,0,0);
	var tw = this.add.tween(logo.scale);
	tw.to({x:1,y:1},600,"Linear",true,0,0);	
	tw = this.add.tween(logo);
	tw.to({y:150},600,"Linear",true,0,0);	
	this.game.time.events.add(3000,this.step2,this);
}
Preload.prototype.step2=function(){
	this.logoshown=true;
	
}

Preload.prototype.create = function() {
	//this.game.state.start("Menu");
	this.aloaded = true;
	this.input.onDown.add(this.startGame, this);
};
Preload.prototype.startGame = function() {
	this.game.state.start("Menu");
};
Preload.prototype.update = function() {
	//console.log(this.logoshown);
	if(this.aloaded && this.logoshown){
	 this.game.state.start("Menu");	
	}
	if(this.aloaded){
	   this.preloadBar.kill();
	}
}