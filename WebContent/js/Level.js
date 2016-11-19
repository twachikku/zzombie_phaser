/**
 * Level state.
 */
function Level() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Level.prototype = proto;

Level.prototype.preload = function() {
	level=this.game.level;
	if(this.game.level>this.game.maxLevel)level=1;

	this.preloadBar = this.add.sprite(this.game.width/2,this.game.height/2,
	"loading");
	this.preloadBar.anchor.set(0.5, 0.5);
    this.load.setPreloadSprite(this.preloadBar);
	//console.log("Level:"+this.game.level);
	var tileset=[];
	tileset[1]={tile:"tileset",bg:"bg1",color:"#8ab"};
	tileset[2]={tile:"tileset",bg:"bg1",color:"#a86"};
	tileset[3]={tile:"tileset",bg:"bg0",color:"#111"};
	tileset[4]={tile:"tileset",bg:"bg0",color:"#115"};
	tileset[5]={tile:"tileset",bg:"bg1",color:"#151"};
	tileset[6]={tile:"tileset",bg:"bg0",color:"#511"};
	tileset[7]={tile:"tileset",bg:"bg0",color:"#511"};
	tileset[8]={tile:"tileset",bg:"bg0",color:"#511"};
	
	this.leveldat = tileset[level];
	this.load.tilemap("level","assets/tilemap/level10"+level+".json",null,Phaser.Tilemap.TILED_JSON);
}
/*
Level.prototype.render = function() {
//	this.game.debug.body(this.player);
	for(i in this.enemies.children){
	  this.game.debug.body(this.enemies.children[i]);
	}
	
}*/
Level.prototype.create = function() {
	this.killed=0;
	this.preloadBar.kill();
	this.showParticle=false;
	this.stage.backgroundColor = this.leveldat.color;
	this.nums={score:0,heal:0,damage:0};
	this.actor_scale = 0.5;
	this.sounds = [];
	this.music = this.add.audio("music", 0.5, true);
	this.music.play();
	this.sounds['zombie_dead'] = this.add.audio("zdead1", 1, false);
	this.sounds['zombie_1'] = this.add.audio("zombie_1", 1, false);
	this.sounds['zombie_2'] = this.add.audio("zombie_2", 1, false);
	this.sounds['attack'] = this.add.audio("sword", 1, false);
	this.sounds['power'] = this.add.audio("power", 1, false);
	this.sounds['ping']  = this.add.audio("ping", 1, false);
	this.sounds['hurt']  = this.add.audio("hurt", 1, false);
	for(i in this.sounds){
		this.sounds[i].allowMultiple = true;
		
	}
	//console.log(this.sounds);
	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.physics.arcade.gravity.y = 250;
	this.bg = [this.add.group(),this.add.group(),this.add.group()];	
	this.enemies = this.add.group();
	this.trabs   = this.add.group();
	this.actors = this.add.group();
	this.npc = this.add.group();
	this.fg = this.add.group();
	this.fg.y = 16;
	
	this.ui = this.add.group();
	this.items_effect = this.add.group();
	this.items = this.add.group();
	this.bargroup = this.add.group();
	this.effects = this.add.group();
	this.effects.enableBody=true;
		
	this.map = this.add.tilemap("level");
	this.map.addTilesetImage("tileset_01",this.leveldat.tile);
	this.tilelayers=[];
	yi=0;
	for(y in this.map.layers){
	  layer = this.map.layers[y];
	  if(!this.game.device.desktop){
	     if(layer.name=="fg" || layer.name=="bg1" || layer.name=="bg2") continue;
	  }
	  
	  this.tilelayers[yi]=this.map.createLayer(layer.name,null,null,this.bg[2]);
	  if(layer.name=="floor"){
		this.map_floor = this.tilelayers[yi];  
	  }
	  if(layer.name=="fg"){
		this.tilelayers[yi].x=20; 
		this.tilelayers[yi].y=20;	
		this.tilelayers[yi].alpha = 0.9;
		//this.tilelayers[yi].scale.y = 1.1;
		this.fg.add(this.tilelayers[yi]);
	  }
	  yi++;
	  //console.log(layer);
	}
		
	//this.map_floor.scale.set(2);
	this.map_floor.resizeWorld();
	
	this.items.enableBody = true;
	this.ui.fixedToCamera = true;
	
	for (x in this.map.objects.actors) {
		var obj = this.map.objects.actors[x];
		//console.log(obj);
		if (obj.type == "player") {
			this.player = this.addPlayer(obj);
		} else if (obj.type == "enemy") {
			this.addEnemy(obj);
		}else if (obj.type == "goal") {
			this.goal = this.add.sprite(obj.x,obj.y,"flag");
			this.physics.arcade.enableBody(this.goal);
			this.goal.body.allowGravity = false;
			this.goal.visible=false;
		}else if(obj.gid!=undefined){
			this.addTileObject(obj);			
		}
	}

	this.map.setCollisionBetween(0, 126, true, this.map_floor);
	
    this.createBg();
    this.createButtons();
    if(this.showParticle) this.createEmitter();
    this.createText();
    
	//console.log(this.world);    
};

Level.prototype.createText = function(){
	this.text= {};
	this.text['level'] = this.add.text(50, 20, "Level:"+this.game.level, { font: "20px Arial Black", fill: "#faa" },this.ui);
	this.text['level'].stroke = "#000";
	this.text['level'].strokeThickness = 6;

	this.text['score'] = this.add.text(150, 20, "0", { font: "20px Arial Black", fill: "#ff0" },this.ui);
	this.text['score'].stroke = "#000";
	this.text['score'].strokeThickness = 6;
//	this.text['score'].setShadow(2, 2, "#333333", 2, true, false);

	this.text['coin'] = this.add.text(300, 20, "0", { font: "20px Arial Black", fill: "#fa0" },this.ui);
	this.text['coin'].stroke = "#000";
	this.text['coin'].strokeThickness = 6;

	this.text['kill'] = this.add.text(450, 20, "Kill:0", { font: "20px Arial Black", fill: "#0a0" },this.ui);
	this.text['kill'].stroke = "#00a";
	this.text['kill'].strokeThickness = 6;
	
	msgTxt =  this.add.text(this.game.width/2,this.game.height/2, "Level "+this.game.level+"\n", { font: "25px Arial Black", fill: "#f00" },this.ui);
	msgTxt.stroke = "#000";
	msgTxt.strokeThickness = 6;
	msgTxt.scale.set(5);
	msgTxt.anchor.set(0.5,0.5);
	
	tw = this.add.tween(msgTxt.scale);
	tw.to({x:1,y:1},1000,"Linear",true, 0, 0, false);
	this.time.events.add(2000,function(){this.text = "Kill All Zombies";},msgTxt);
	this.time.events.add(4000,function(){this.destroy();},msgTxt);
}


Level.prototype.createEmitter = function() {
//this.grass = this.add.tileSprite(0,this.world.height-175,this.world.width,175,"bg2");
    
    this.epower = this.add.emitter(0,0,50);
    this.epower.makeParticles("heal",[0,1,2]);
    this.epower.minParticleSpeed.set(-20, -200);
    this.epower.maxParticleSpeed.set(20, -100);
    this.epower.minParticleScale = 0.1;
    this.epower.maxParticleScale = 0.3;
    this.epower.gravity=0;

    this.eping = this.add.emitter(0,0,50);
    this.eping.makeParticles("coin",[0,1,2]);
    this.eping.minParticleSpeed.set(-50, -200);
    this.eping.maxParticleSpeed.set(50, -100);
    this.eping.minParticleScale = 0.1;
    this.eping.maxParticleScale = 0.2;
    this.eping.gravity=0;

    // this.epower.bounce.set(0.5);
    this.eblood = this.add.emitter(0,0,50);
    this.eblood.makeParticles("actors_img",["blood1"]);
    this.eblood.minParticleSpeed.set(-100, -100);
    this.eblood.maxParticleSpeed.set(100, -50);
    this.eblood.minParticleScale = 0.05;
    this.eblood.maxParticleScale = 0.2;
    this.eblood.gravity=100;

    this.eflash = this.add.emitter(0,0,15);
    this.eflash.makeParticles("actors_img",["muzzleflash2"]);
    this.eflash.minParticleSpeed.set(-150, -150);
    this.eflash.maxParticleSpeed.set(150, -50);
    this.eflash.minParticleScale = 0.05;
    this.eflash.maxParticleScale = 0.2;
    this.eflash.gravity=50;
};

Level.prototype.createBg = function() {
   this.filter=null;
   this.bg[0].fixedToCamera = true;
   if(this.game.device.desktop){

	    this.filter = new Phaser.Filter(this.game, null, this.cache.getShader('bg21'));
	    this.filter.setResolution(this.game.width,this.game.height);

	    this.background = this.add.sprite(0, 0);
	    //this.background .fixedToCamera = true;
		this.background.width = this.game.width;
		this.background.height =this.game.height;
		this.background.filters = [this.filter];
		this.bg[0].add(this.background);
   }else{
     bg = this.add.sprite(100,10,this.leveldat.bg ,null,this.bg[0]);//.scale.set(2);
     var wt = this.add.tileSprite(0,this.world.height-64,this.world.width,64,"tileset",42,this.fg);
     wt = this.add.tileSprite(0,this.world.height-128,this.world.width,64,"tileset",40,this.fg);    	   
   }
   
  // bg.animations.add("idle").play(2,true);
/*   var x=50+Math.random()*50;
   while(x<this.world.width){
	   var m = this.add.image(x,0,"bg1",null,this.bg[1]);
	   x+=100+Math.random()*400;
	   m.height = this.world.height+Math.random()*200;
   }
   var x=60+Math.random()*50;
   while(x<this.world.width){
	   var m = this.add.image(x,0,"bg1",null,this.bg[2]);
	   x+=100+Math.random()*400;
	   m.height = this.world.height+Math.random()*200;
   }*/
}

Level.prototype.addPlayer = function(obj) {
	var a = this.add.spriter(obj.x, obj.y, "actors", "actors_img", "sman");
	a.scale.set(this.actor_scale);
	a.play("idle");
	this.physics.arcade.enableBody(a);
	a.initBody();
	a.body.gravity.y=1000;
	a.body.checkCollision.up = false;
	this.actors.add(a);
	this.camera.follow(a, Phaser.Camera.FOLLOW_PLATFORMER);
    //a.body.offset.y = 50;
    
    //a.body.offset.x = 32;
    //a.body.width = 32;
	a.isAttack = false;
	a.attackTime = 0;
	a.health = 100;
	a.maxHealth = 100;
	a.body.maxVelocity.y = 800;
	a.ap = 40;
	a.hby = a.height+10;
	a.healbar = this.addHealBar(a);
	a.kill = function() {
		this.isDead = true;
		this.play("dead");
		this.game.time.events.add(3000,function(){
		   this.game.state.start("GameOver",false);	
		},this);
	}
	a.body.height = 50;
	
	return a;
};

Level.prototype.addEnemy = function(obj) {
	var a = this.add.spriter(obj.x, obj.y, "actors", "actors_img", obj.name);
	a.play("idle");
	a.name = obj.name;
	a.scale.set(this.actor_scale+0.15);
	this.physics.arcade.enableBody(a);
	a.initBody();
	a.body.gravity.y=1000;
	a.isAttack = false;
	a.attackTime = 0;
	a.nextAttack = 0;
	a.isDead = false;
	a.cankilled=true;
	a.ap = 5;
	if(obj.name=="zombie1"){a.ap=10;a.maxHealth=100;a.speed=30;}
	if(obj.name=="zombie2"){a.ap=20;a.maxHealth=150;a.speed=40;}
	if(obj.name=="zombie3"){a.ap=30;a.maxHealth=200;a.speed=50;}
	if(obj.name=="dino"){
		a.ap=40;a.maxHealth=300;a.speed=60;
		a.body.offset.x=50;
	}
	a.health = a.maxHealth;
	a.deadsound = this.sounds['zombie_dead'];
	a.hby = a.height+5;
	a.level = this;
	a.kill = function() {
		this.isDead = true;
		this.deadsound.play();
		this.play("dead");
		this.game.score.total+=10;
		this.game.score.kill++;
		this.level.killed++;
		this.game.score.kstat[name]++;
		var tw = this.game.add.tween(this);
		tw.to({
			alpha : 0.1
		}, 3000, "Linear", true, 0, 0, false);
		tw.onComplete.addOnce(function() {
			this.destroy();
		}, this);
	}
	a.healbar = null; //this.addHealBar(a);
	this.enemies.add(a);
	return a;
}
Level.prototype.addHealBar = function(obj) {
	var h = this.add.image(obj.x,obj.y, "greenbar",null,this.bargroup);
	//obj.add(h);
	h.actor = obj;
	h.w = 40;
	h.ox = obj.width/2;
	h.oy = obj.hby;
	h.height = 8;
	h.resize = function() {
		var w = this.w * (this.actor.health / this.actor.maxHealth);
		if (w < 0)
			w = 0;
		this.width = w;
	};
	h.update = function(){
		if(!this.actor.alive){
		  this.kill();
		  return;
		}
		this.x = this.actor.x-this.ox;
		this.y = this.actor.y-this.oy;
	}
	h.resize();
	return h;
}

Level.prototype.createButtons = function() {
    this.world.bringToTop(this.ui);
	this.btn_left = this.add.button(10, this.game.height - 100, "button");
	this.btn_left.anchor.set(1, 0);
	this.btn_left.scale.x = -1;
	this.btn_left.alpha = 0.4;

	this.btn_right = this.add.button(140, this.game.height - 100, "button");
	this.btn_right.alpha = 0.4;

	this.btn_jump = this.add.button(this.game.width - 100,
			this.game.height - 100, "button");
	this.btn_jump.anchor.set(1, 0);
	this.btn_jump.angle = -90;
	this.btn_jump.alpha = 0.4;

	this.btn_attack = this.add.button(this.game.width - 100 * 2,
			this.game.height - 100, "button_attk");
	this.btn_attack.alpha = 0.4;

	this.btn_left.isdown = false;
	this.btn_right.isdown = false;
	this.btn_jump.isdown = false;
	this.btn_attack.isdown = false;

	this.ui.add(this.btn_left);
	this.ui.add(this.btn_right);
	this.ui.add(this.btn_jump);
	this.ui.add(this.btn_attack);
	

	this.btn_left.onInputDown.add(this.inputDown, this.btn_left);
	this.btn_left.onInputUp.add(this.inputUp, this.btn_left);
	this.btn_right.onInputDown.add(this.inputDown, this.btn_right);
	this.btn_right.onInputUp.add(this.inputUp, this.btn_right);
	this.btn_jump.onInputDown.add(this.inputDown, this.btn_jump);
	this.btn_jump.onInputUp.add(this.inputUp, this.btn_jump);
	this.btn_attack.onInputDown.add(this.inputDown, this.btn_attack);
	this.btn_attack.onInputUp.add(this.inputUp, this.btn_attack);

	// add keyboard event
	this.keys = this.input.keyboard.addKeys({
		"left" : Phaser.Keyboard.LEFT,
		"right" : Phaser.Keyboard.RIGHT,
		"jump" : Phaser.Keyboard.UP,
		"attack" : Phaser.Keyboard.X
	});
	this.keys.left.onDown.add(this.inputDown, this.btn_left);
	this.keys.left.onUp.add(this.inputUp, this.btn_left);
	this.keys.right.onDown.add(this.inputDown, this.btn_right);
	this.keys.right.onUp.add(this.inputUp, this.btn_right);
	this.keys.jump.onDown.add(this.inputDown, this.btn_jump);
	this.keys.jump.onUp.add(this.inputUp, this.btn_jump);
	this.keys.attack.onDown.add(this.inputDown, this.btn_attack);
	this.keys.attack.onUp.add(this.inputUp, this.btn_attack);

	this.homebtn = this.add.button(0,0,"home",function(){
		this.game.state.start("Menu");
	},this);
	this.ui.add(this.homebtn);
}

Level.prototype.inputDown = function() {
	this.alpha = 1;
	this.isdown = true;
}
Level.prototype.inputUp = function() {
	this.alpha = 0.4;
	this.isdown = false;
}

Level.prototype.update = function() {
	if(!this.player.isDead && (this.nums.heal>0 || this.nums.damage>0)){
		if(this.nums.heal>0) {this.nums.heal--; this.player.heal(1); }	
		if(this.nums.damage>0) {this.nums.damage-=0.5; this.player.damage(0.5); }
		this.player.healbar.resize();		
	}
	this.goal.visible=(this.killed>2);
	
	if(this.nums.score>0){
	  var sd=5; if(sd>this.nums.score)sd=this.nums.score;	
	  this.nums.score-=sd;
	  this.game.score.total+=sd;
	}
	if(this.filter!=null)this.filter.update();
	
	this.bg[1].x = this.camera.x * 0.8;
	this.text['score'].text = "Score:"+this.game.score.total;
	this.text['coin'].text = "Coin:"+this.game.score.coin;
	this.text['kill'].text = "Kill:"+this.game.score.kill;
	
	//this.physics.arcade.overlap(this.player, this.enemies, this.onCollideEnemy,	null, this);
	this.physics.arcade.collide(this.player, this.goal, this.onCollideGoal,null,this);
	this.physics.arcade.collide(this.player, this.items, this.onCollideItem,null,this);
	this.physics.arcade.overlap(this.player, this.npc, this.onCollideNpc,null,this);
	this.physics.arcade.collide(this.actors, this.map_floor, this.onCollideFloor,	null, this);
	this.physics.arcade.collide(this.enemies, this.map_floor);
	this.physics.arcade.collide(this.effects, this.map_floor);
    var pw=64; if(this.player.isAttack)pw=100; 
	for (i in this.enemies.children) {
		var em = this.enemies.children[i];
		if(!em.worldVisible) continue;
		var ds = distance(this.player, em);
		if (ds.dy<em.height && ds.dx<pw){
			this.onCollideEnemy(this.player,em,ds);
		}
		if (em.isDead || em.isAttack)
			continue;
		if(ds.dy < 300 && ds.dx > 20 && ds.dx < 500) {
			var d = (ds.x < 0) ? -1 : 1;
			if(Math.random()>0.3 && d*em.body.velocity.x < em.speed*4) em.body.velocity.x += d * 15;
			if(em.name=="dino")d=-d;
			em.scale.x = d * this.actor_scale;
			em.play("walk",80+(Math.random()*30));			
			if(em.name!="dino"&Math.random()>0.8 && em.body.onFloor())em.body.velocity.y=-210;
		} else {
			em.body.velocity.x=0;
			//em.play("idle");
		}
	}

	if (this.player.isDead) return;
	if (this.player.body.y>this.world.height-74){
		this.player.kill();
		//console.log("dead");
	}
	if (this.player.isAttack)
		return;
	if (this.player._animationName == "hurt")
		return;

	// add condition for controlling the player actor.
	if (this.btn_right.isdown) {
		if(this.player.body.velocity.x<200) this.player.body.velocity.x +=20;
	}
	if (this.btn_left.isdown) {
		if(this.player.body.velocity.x>-200) this.player.body.velocity.x-=20;
	}

	if (this.btn_jump.isdown && this.player.body.onFloor()) {
		this.player.body.velocity.y = -600;
	}

	//if (this.game.time.now - this.player.actionTime > 100) {
		if (this.player.body.onFloor()) {
			if (this.player.body.velocity.x > 0) {
				this.player.play("walk",180);
				this.player.scale.x = this.actor_scale;
			} else if (this.player.body.velocity.x < 0) {
				this.player.play("walk",180);
				this.player.scale.x = -this.actor_scale;
			} else {
				this.player.play("idle");
			}
		} else {
			this.player.play("fall");
		}
	//}

	if (this.btn_attack.isdown) {
		this.player.isAttack = true;	
		this.player.attackTime = this.game.time.now + 360;
		//this.player.body.offset.x = 60;
		this.player.play("attack", 100);
		this.player.body.velocity.x=0;
		this.player.onLoop.addOnce(this.afterAttack, this.player);
	}
}

Level.prototype.afterAttack = function() {
	//this.body.offset.x = 0;
	//console.log("afterAttack ");
	//console.log(this);
	if (!this.isDead){
		this.play("idle");
	}
	else{
		this.play("dead");
	}
	this.isAttack = false;
};

Level.prototype.onCollideFloor = function(p, em) {
  //console.log(em);
	p.canAttack=true;
	if(em.faceLeft&&p.scale.x<0){
		p.canAttack=false;
	}
	if(em.faceRight&&p.scale.x>0){
		p.canAttack=false;		
	}
}
Level.prototype.onCollideEnemy = function(p, em, ds) {
	if (em.isDead) {
		em.play("dead");
		return true;
	}
	//console.log(" dx ");console.log(ds);
	var now = this.game.time.now;
	 if (em.cankilled && p.isAttack && ds.x*p.scale.x<0 && ds.dx<80 && now > p.attackTime && now < p.attackTime + 500) {
		//p.attackTime = now + 500;		
		p.isAttack = false;
		var d = this.game.rnd.between(10, p.ap);
		this.nums.score+=d*2;
		this.addDamage(em, d);
		//if(em.is)
		this.sounds['attack'].play();
		if(this.showParticle){
		  this.eflash.x = em.body.center.x;
		  this.eflash.y = em.body.center.y;
		  this.eflash.explode(400,10);
		}
		if(em.scale.x<0) em.body.velocity.x=300;
		else em.body.velocity.x=-300;
		em.body.velocity.y=-200;
		// player attack enemy
		return;
	 }
	

	if (!em.isAttack) {
		if (now > em.nextAttack) {
			em.isAttack = true;			
			em.play("attack",80+(Math.random()*30));
			
			if(Math.random()>0.6){
			  if(Math.random()>0.5){
				this.sounds['zombie_1'].play();
			  }else{
				this.sounds['zombie_2'].play();				
			  }
			}
			if(em.scale.x<0) em.body.velocity.x=100;
			else em.body.velocity.x=-100;
			em.attackTime = this.game.time.now + 300;
			//console.log(now+" > "+ em.attackTime);
			em.nextAttack = now + 3000;
			em.onLoop.addOnce(this.afterAttack, em);
		}
	} else if(ds.dx<50 && ds.dy<em.height-20){		
		var dt=(em.attackTime + 600)-now;
		//console.log(now+" > "+ em.attackTime+"  dt:"+dt);
		if (now > em.attackTime && now < em.attackTime + 600) {
			//console.log("attack");
			em.attackTime = now + 400;
			em.nextAttack = now + 2000;
			var d = this.game.rnd.between(1, em.ap);
			this.addDamage(p, d);
			this.sounds['hurt'].play();
			if(this.showParticle){
		  	  this.eblood.x = p.body.center.x;
			  this.eblood.y = p.body.center.y;
			  this.eblood.explode(500,15);
			}
			p.onLoop.addOnce(this.afterAttack, p);
		}
		if(dt<-200){
		  em.attackTime = this.game.time.now + 300;
		  em.nextAttack = now + 3000;
		}
	}
}

Level.prototype.addDamage = function(actor, v) {
	//var txt = this.game.add.text(actor.x, actor.y - 100, v, {
	//	fill : "#f00"
	//});
	if(actor!=this.player) {
	    actor.damage(v);
	}else{
		this.nums.damage+=v;
	}
	actor.play("hurt",150);
	var s=v/40;
	if(s<0.2) s=0.2; else if(s>1)s=1;
	
	var txt = this.game.add.sprite(actor.x, actor.y-60,"blood",null,this.effects);
	txt.anchor.set(0.5,0.5);
	txt.scale.set(s);
	txt.body.gravity.y=300;
	txt.body.bounce.y=0.5;
	this.game.time.events.add(1000,function(){this.destroy();}, txt);	
}

function distance(a1, a2) {
	var r = {};
	r.x = a1.body.center.x-a2.body.center.x;
	r.y = a1.y - a2.y;
	r.dx = Math.abs(r.x);
	r.dy = Math.abs(r.y);
	return r;
}

Level.prototype.onCollideGoal = function(p,g){
	this.game.level++;
	if(this.game.level>this.game.maxLevel){
	   this.game.state.start("Win",false);
	}else{
	   this.game.state.restart();		
	}
}
Level.prototype.onCollideNpc = function(p,t){
    if(t.hit==0 || this.game.time.now - t.time> 10000){
      txt = this.add.text(this.game.width/2,this.game.height/2+50,t.text,{fill:"#fff",font:"30px Tahoma"},this.ui);
      txt.strokeThickness = 5;
      txt.strokeColors="#000";      
      txt.anchor.set(0.5,0.5);
      t.time = this.game.time.now;
      t.hit++;
      
      this.time.events.add(3000,function(){txt.destroy()},txt);
    }
}
Level.prototype.onCollideItem = function(p,t){
	//console.log(t);
	if(t.item == "heal"){
	   
	   this.sounds['power'].play();
	   if(this.showParticle){
	     this.epower.x= p.body.center.x;
	     this.epower.y= p.body.center.y;
	     this.epower.start(true, 1000, null, 10);
	   }
	   this.game.score.heal++;
	   this.nums.heal += 25;	
	   this.nums.score+=5;
	}
	if(t.item == "coin"){
	   this.sounds['ping'].play();
	   if(this.showParticle){
	     this.eping.x= p.body.center.x;
	     this.eping.y= p.body.center.y;
	     this.eping.start(true,500, null, 10);
	   }
	   this.game.score.coin++;
	   this.nums.score+=10;
	}
	if(t.effect!=null){
	   t.effect.destroy();
	   t.destroy();
	}else{
	   var tw = this.add.tween(t);
	   this.fg.add(t);
	   tw.to({ y:this.camera.y}, 500, "Linear", true, 0, 0, false);
	   tw.onComplete.addOnce(function() { this.destroy(); },t);
	   
	}
	
}

Level.prototype.shutdown = function(){
	this.music.stop();
}

Level.prototype.addTileObject = function(obj){
	
	var t=null;
	//console.log(obj);
	if(obj.gid==9){
		t = this.add.sprite(obj.x,obj.y,"tileset",obj.gid-1,this.enemies);
		this.physics.arcade.enableBody(t);
		t.anchor.set(0,1);
		t.body.allowGravity = false;
		t.item = "trab";
		t.cankilled=false;
		t.isAttack = true;
		t.attackTime = 0;
		t.nextAttack = 0;
		t.isDead = false;
		t.ap = 5;
		return;
	}
	if(obj.gid==10){
		t = this.add.sprite(obj.x,obj.y,"coin",null);
		var i=5+Math.round(Math.random()*10);
		t.animations.add("h",null,i,true).play();
		t.item = "coin";
	}
	if(obj.gid==34 || obj.gid==35){
		t = this.add.sprite(obj.x,obj.y,"apple",null);
		t.animations.add("h",null,8,true).play();
		t.item = "heal";
	}
	if(obj.gid==17 || obj.gid==20 || obj.gid==21){
		console.log(obj);
		t = this.add.sprite(obj.x,obj.y,"tileset",obj.gid-1,this.npc);
		t.text = obj.properties.text;
		t.time = this.game.time.now;
		t.anchor.set(0,1);
		this.physics.arcade.enableBody(t);
		t.body.allowGravity = false;	
		t.hit=0;
		return t;
	}
	if(t!=null){	
		t.width=28;
		t.height=28;
	    t.anchor.set(0,1);	
	    this.physics.arcade.enableBody(t);
	    t.body.allowGravity = false;			
    	t.effect=null;
	    this.items.add(t);		   
	    if(this.showParticle){
	      var a = this.add.sprite(obj.x,obj.y,"flash",null);
		  a.x = t.centerX;
		  a.y = t.centerY;
		  a.anchor.set(0.5,0.5);
  		  a.width=50;
		  a.height=50;
		  this.items_effect.add(a);
		  t.tween = this.add.tween(a);
		  t.tween.to({angle:200},500,"Circ",true,0,-1,true);
		  t.effect = a;
	    }
	}
};
