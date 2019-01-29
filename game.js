var canvas;
var ctx;
var running = false;
var dead = false;
var animation_timer = 0;
var animation_state = 0;
var level_timer = 0;
var dino;
var obstacleManager;
var sprite1;
var sprite2;
var sprite_crouch1;
var sprite_crouch2;
var cacto1, cacto2, cacto3, flying1, flying2;
var ground, cloud;
var clouds = [];
var LEVEL_SPEED = 5;
var score = 0;
var goal = 100;
var goal_text = 100;
var goal_timer = 0;
var goal_state = 0;
var charm_timer = 0;
var night = false;
var day_cycle_mode = false;

function init(){
	canvas = 			document.getElementById('canvas');
	ctx = 				canvas.getContext('2d');
	ctx.font =  		"10px PressStart2P";
	sprite1 = 			document.getElementById('dino1');
	sprite2 = 			document.getElementById('dino2');
	sprite_crouch1 = 	document.getElementById('dino_crouch1');
	sprite_crouch2 = 	document.getElementById('dino_crouch2');
	cacto1 =			document.getElementById('cacto1');
	cacto2 =			document.getElementById('cacto2');
	cacto3 =			document.getElementById('cacto3');
	flying1 =			document.getElementById('flying1');
	flying2 =			document.getElementById('flying2');
	ground = 			document.getElementById('ground');
	cloud = 			document.getElementById('cloud'); 
	clouds[0] = [canvas.width, Math.floor(Math.random() * (canvas.height/2 - 100 - canvas.height/2) + canvas.height/2)];
	clouds[1] = [1.5*canvas.width, Math.floor(Math.random() * (canvas.height/2 - 100 - canvas.height/2) + canvas.height/2)];
	clouds[2] = [2*canvas.width, Math.floor(Math.random() * (canvas.height/2 - 100 - canvas.height/2) + canvas.height/2)];
	dino = 				new dino();
	obstacleManager =   new obstacleManager();
	obstacleManager.generateFirstThree();
	ground1 = 			new groundObject(0);
	ground2 = 			new groundObject(canvas.width);
	gameLoop();
}

function gameLoop(){
	if(running){
	level_timer++;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(night && day_cycle_mode){
		ctx.globalCompositeOperation='difference';
		ctx.fillStyle='black';
		ctx.fillRect(0,0,canvas.width,canvas.height);
	}
	if(score>=goal){
		LEVEL_SPEED+=1;
		goal_state = 1;
		if(goal<=1000){
			goal*=10;
		}else{
			goal+=1000;
		}
		document.getElementById('audio2').play();
	}
	if(goal_state==1){
		goal_timer++;
		charm_timer++;
		if(charm_timer<=20){
			ctx.fillStyle = 'white';
		}else if(charm_timer>=20){
			ctx.fillStyle = 'gray';
			if(charm_timer>=40){
				charm_timer = 0;
			}
		}
	}else{
		ctx.fillStyle = 'gray';
	}
	if(goal_timer>=150){
		if(night){
			night = false;
		}else{
			night = true;
		}
		goal_state = 0;
		goal_timer = 0;
		if(goal_text<=1000){
			goal_text*=10;
		}else{
			goal_text+=1000;
		}
		charm_timer = 0;
	}
	for(let i = 0; i < clouds.length; i++){
		ctx.drawImage(cloud, clouds[i][0], clouds[i][1]);
		clouds[i][0]-=LEVEL_SPEED*0.7;
		if(clouds[i][0]<=-10){
			clouds[i][0] = 1.5*canvas.width;
		}
	}
	if(goal_state == 0){
		if(score<10){
			ctx.fillText("0000"+score, canvas.width-120, 25);
		}
		else if(score>=10 && score<100){
			ctx.fillText("000"+score, canvas.width-120, 25);
		}
		else if(score>=100 && score<1000){
			ctx.fillText("00"+score, canvas.width-120, 25);
		}
		else if(score>=1000 && score<10000){
			ctx.fillText("0"+score, canvas.width-120, 25);
		}else{
			ctx.fillText(""+score, canvas.width-120, 25);
		}
	}else{
		if(goal_text<10){
			ctx.fillText("0000"+goal_text, canvas.width-120, 25);
		}
		else if(goal_text>=10 && goal_text<100){
			ctx.fillText("000"+goal_text, canvas.width-120, 25);
		}
		else if(goal_text>=100 && goal_text<1000){
			ctx.fillText("00"+goal_text, canvas.width-120, 25);
		}
		else if(goal_text>=1000 && goal_text<10000){
			ctx.fillText("0"+goal_text, canvas.width-120, 25);
		}else{
			ctx.fillText(""+goal_text, canvas.width-120, 25);
		}
	}
	if(level_timer>=8){
		level_timer = 0;
		score++;
	}
	dino.draw();
	obstacleManager.drawObstacles();
	dino.collision();
	ground1.draw();
	ground2.draw();
	}
	if(!dead){
		requestAnimationFrame(gameLoop);
	}

}

function dino(){
	this.collisionBox = [0, 0];
	this.pos = [];
	this.frontX = false;
	this.rearX = false;
	this.minimumY = canvas.height/2 + sprite1.height - 5;
	this.isCrouching = false;
	this.isJumping = false;
	this.jumpTimer = 0;
	this.ascendingForce = 8;
	this.descendingForce = 8;
	this.x = 100;
	this.y = canvas.height/2;
	this.maximumY = this.y;
	this.draw = function(){
		if(this.isCrouching){
			this.maximumY = canvas.height/2 + 20;	
		}else{
			this.maximumY = canvas.height/2;
		}

		if(this.isJumping){
			this.jumpTimer++;
			if(this.jumpTimer<=20){
				this.y-=this.ascendingForce;
				this.ascendingForce-=0.5;
				this.descendingForce = -this.ascendingForce;
			}else{
				this.y+=this.descendingForce;
				this.descendingForce+=0.5;
			}
		}

		if(this.y>canvas.height/2){
				this.isJumping = false;
				this.jumpTimer = 0; 
				this.ascendingForce = 8;
				this.descendingForce = 8;
				this.y = canvas.height/2;
		}



		animation_timer++;
		if(animation_timer>=8){
			animation_timer = 0;
			if(animation_state==0){
				animation_state = 1;
			}else{
				animation_state = 0;
			}
		}
		if(!this.isCrouching){
			switch(animation_state){
				case 0:
					ctx.drawImage(sprite1, this.x, this.y);
				break;
				case 1:
					ctx.drawImage(sprite2, this.x, this.y);
				break;
			}
		}else if(this.isCrouching){
			switch(animation_state){
				case 0:
					ctx.drawImage(sprite_crouch1, this.x, this.y);
				break;
				case 1:
					ctx.drawImage(sprite_crouch2, this.x, this.y);
				break;
			}
		}
				this.minimumY = this.y + sprite1.height - 5;
	};
	this.jump = function(){
		if(!this.isJumping){
			this.isJumping = true;
		}
	};
	this.collision = function(){
		if(!this.isCrouching){
			this.collisionBox = [43, 46];
			this.pos = [this.x, this.y];
			this.frontX = this.x+37;
			this.rearX = this.x;
			
		}else{
			this.collisionBox = [59, 30];
			this.pos = [this.x, this.y+this.collisionBox[1]/1.5];
			this.frontX = this.x+50;
			this.rearX = this.x;
			
		}
		for(let i = 0; i<obstacleManager.obstacles.length; i++){
			if(this.frontX >= obstacleManager.obstacles[i].frontX && 
			   this.rearX <= obstacleManager.obstacles[i].rearX &&
			   this.rearX + this.collisionBox[0]/2 >= obstacleManager.obstacles[i].frontX){
				if(obstacleManager.obstacles[i].type==4){
					if(this.minimumY>=obstacleManager.obstacles[i].pos[1]){
						if(this.maximumY<=obstacleManager.obstacles[i].pos[1]){
							running = false;
							dead = true;
						}
					}else{
						if(this.minimumY>=obstacleManager.obstacles[i].pos[1]-20){
							running = false;
							dead = true;
						}
					}
				}else{
					if(this.minimumY>=obstacleManager.obstacles[i].pos[1]){
						running = false;
						running = false;
						dead = true;
					}
				}
			}
		}
		

	}
}

function groundObject(x){
	this.x = x;
	this.y = canvas.height/2+30;
	this.draw = function(){
		this.x-=LEVEL_SPEED;
		if(this.x<=-1200){
			this.x = canvas.width;
		}
		ctx.drawImage(ground, this.x, this.y);
	}
}

function obstacleManager(){
	this.obstacles = [];
	this.drawObstacles = function(){
		for(let i = 0; i < this.obstacles.length; i++){
			if(this.obstacles[i].canDraw){
				this.obstacles[i].draw();
			}
			if(this.obstacles[i].x<=-20){
				if(this.obstacles[i].canDraw){
					this.generateNewObstacle();
				}
				this.obstacles[i].canDraw = false;
			}
			if(this.obstacles[i].x<=-50){
				this.obstacles.splice(i, 1);
				
			}
		}
	}
	this.generateFirstThree = function(){
		spacing = 0;
		for(var i = 0; i < 3; i++){
			type = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
			x = canvas.width + spacing;
			this.obstacles.push(new obstacle(type, x));
			spacing += Math.floor(Math.random() * (300 - 1 + 250)) + 250;
		}
	}
	this.generateNewObstacle = function(){
		spacing = 0;
		y = false;
		type = Math.floor(Math.random() * 4) + 1;      // returns a random integer from 0 to 10
		spacing = Math.floor(Math.random() * (50)); 
		console.log(type);
		if(type==4){
			state = Math.floor(Math.random() * 3) + 1; 
			console.log('state: '+state);
			if(state == 1){
				y = canvas.height/2;
			}else if(state == 2){
				y = canvas.height/2-25;
			}else if(state == 3){
				y = canvas.height/2-50;
			}
		}
		x = canvas.width * 2 + spacing;
		this.obstacles.push(new obstacle(type, x, y));
	}
}

function obstacle(type, x, y = false){
	this.type = type;
	this.animation_timer = 0;
	this.canDraw = true;
	this.pos = [];
	this.frontX = false;
	this.rearX = false;
	this.x = x;
	if(y == false){
		this.y = canvas.height/2;
	}else{
		this.y = y;
	}
	this.draw = function(){
		if(this.type==1){
			ctx.drawImage(cacto1, this.x, this.y+5);
			this.pos = [this.x, this.y+5];
			this.frontX = this.x;
			this.rearX = this.x + cacto1.width - 5;
			this.x-=LEVEL_SPEED;
		}
		else if(this.type==2){
			ctx.drawImage(cacto2, this.x, this.y-5);
			this.pos = [this.x, this.y-5];
			this.frontX = this.x;
			this.rearX = this.x + cacto2.width - 5;
			this.x-=LEVEL_SPEED;
		}
		else if(this.type==3){
			ctx.drawImage(cacto3, this.x, this.y+5);
			this.pos = [this.x, this.y+5];
			this.frontX = this.x;
			this.rearX = this.x + cacto3.width - 5;
			this.x-=LEVEL_SPEED;
		}
		else if(this.type==4){
			this.animation_timer++;
			if(this.animation_timer<20){
				ctx.drawImage(flying2, this.x, this.y+5);
			}else if(this.animation_timer>=20){
				ctx.drawImage(flying1, this.x, this.y+5);
				if(this.animation_timer>=40){
					this.animation_timer = 0;
				}
			}
			this.pos = [this.x, this.y + flying1.height - 10];
			this.frontX = this.x;
			this.rearX = this.x + flying1.width - 5;
			this.x-=LEVEL_SPEED;

		}

	}
}


document.onkeydown = function(e){
	if(e.keyCode == 40){
		if(!dino.isCrouching){
			dino.isCrouching = true;
			dino.jumpTimer = 25;

		}
		dino.descendingForce += 10;
			console.log('ai sim mano');
	}
	if(e.keyCode == 38){
		if(!running && !dead){
			running = true;
		}else if(running && !dead){
			if(!dino.isJumping)
				document.getElementById('audio').play();
			dino.jump();
		}
	}
	if(e.keyCode == 80){
		/*if(running){
			running = false;
		}else{
			running = true;
		}*/
		day_cycle_mode = true;
	}
}
document.onkeyup = function(e){
	if(e.keyCode==40){
		if(dino.isCrouching){
			dino.isCrouching = false;
		}
	}
}
