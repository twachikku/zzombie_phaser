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
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
	this.world.width  = this.game.width;
	this.world.height = this.game.height;
	this.world.x=0;
	this.world.y=0;
	this.game.level = 1;
	this.game.maxLevel=8;
	this.game.score={coin:0,kill:0,heal:0,total:0,kstat:{dino:0,zombie1:0,zombie2:0,zombie3:0}};

    this.filter = new Phaser.Filter(this.game, null, this.cache.getShader('bg'));
    this.filter.setResolution(this.game.width,this.game.height);
	
	//console.log(this.world);
/*	var sprite = this.add.sprite(this.world.centerX, this.world.centerY,
			"tap-to-start");
	sprite.anchor.set(0.5, 0.5);
	sprite.fixedToCamera = true; */
	this.zb = this.add.sprite(-50,180,"zombie");
	this.zb.anchor.set(0.5, 0.5);
	var tw = this.add.tween(this.zb);
	tw.to({x:100},800,"Elastic",true,0,0);

	
	this.game.time.events.add(500,this.step1,this);

	this.background = this.add.sprite(0, 0);
	this.background.width = this.game.width;
	this.background.height =this.game.height;
	this.background.filters = [this.filter];
	this.bg = this.add.group();
	
	this.input.onDown.add(this.fullscreen, this);
};
Menu.prototype.fullscreen = function() {
   if(this.game.device.desktop){
	     if (this.game.scale.isFullScreen)
		    {
	    	//  this.game.scale.stopFullScreen();
		    }
		    else
		    {
		      this.game.scale.startFullScreen(false);
		    }  
   }
}
Menu.prototype.step1 = function() {
	var logo = this.add.sprite(this.world.centerX,100,"logo");
	logo.anchor.set(0.5, 0.5);
	//logo.alpha = 0.5;
	logo.scale.set(5);
	s=this.add.button(this.world.centerX,200,"start",
			   this.startGame, this );
			s.anchor.set(0.5,0.5);
	
	//var tw = this.add.tween(logo);
	//tw.to({y:100,alpha:1},1000,"Elastic",true,0,0);
	var tw = this.add.tween(logo.scale);
	tw.to({x:1,y:1},1200,"Linear",true,0,0);	
	this.game.time.events.add(500,this.step2,this);	
}
Menu.prototype.step2 = function() {
	a=this.add.sprite(0,this.world.height,"author");
	a.anchor.set(0,1);
	t=this.add.sprite(this.world.width,this.world.height,"tools");
	t.anchor.set(1,1);
	if(!this.game.device.desktop){
	  a.scale.set(0.8);	
	  t.scale.set(0.8);
	}
	this.game.time.events.add(500,this.step3,this);	
}

Menu.prototype.step3 = function() {
	a=this.add.sprite(this.world.width,this.world.height,"zombie",null,this.bg);
	a.anchor.set(1,1);
	a.scale.x=-1;
	var tw = this.add.tween(a);
	tw.to({x:0},1200,"Elastic",true,0,0);	
}

Menu.prototype.startGame = function() {
	this.game.state.start("Level");
};

Menu.prototype.update = function(){
	this.filter.update();
}