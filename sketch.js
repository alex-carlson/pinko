var slash, peg, ball;
var pegs;
var grav = .2;
var maxSpeed = 10;
var ballCount = 511;
var w;
var h;
var shake = false;
var score = 0;
var shakeAmount = 5;
var shoot;
var scoreSound;
var font, font2;
var level = 1;

function preload() {
  shoot = loadSound('assets/shoot.wav');
  scoreSound = loadSound('assets/score.wav');
  font = loadFont('assets/font2.otf');
  font2 = loadFont('assets/font1.otf');
}

function setup() {
		var pegImg = loadImage("assets/circle.png");
		var ballImg = loadImage("assets/ball.png");
		
  createCanvas(windowWidth, windowHeight);
  background(20);
  noStroke();
  
  textFont(font);
  textSize(300);
  
  var w = width;
  var h = height - (height/5);

  pegs = new Group();
  balls = new Group();
  cups = new Group();
  shoot.setVolume(1);
  scoreSound.setVolume(1);

  //createBall();
  
  for(var i = 0; i<round(width/100); i++) {
  	
	  for(var j = 0; j<round(height / 200); j++){
	  	
	  	var pegsWide = w/(width/120);
	  	
	  	var px = width - w + ( i * (pegsWide) );
		  var py = height - h + ( j * h/5 );
		  createPeg('circle', px, py);

	  }
	  
  }
  
  createCup('rect', width/2);
  
  textAlign(CENTER);
  
  wallLeft = createSprite(0, height/2, 5, height);
  wallLeft.immovable = true;
  
  wallRight = createSprite(width, height/2, 5, height);
  wallRight.immovable = true;
  
  wallBottom = createSprite(width/2, height, width, 5);
  wallBottom.immovable = true;
}

function draw() {
  background('rgba(20,20,20, 0.50)');
  
  fill(30);
  text(score, width/2, height/2);
  
  textFont(font2);
  textSize(32);
  fill(255);
  text("tries: "+ballCount, 80, 50);
  
  strokeWeight(3);
  stroke(255);
  line(mouseX, 0, mouseX, 50);
  
  balls.bounce(pegs);
  balls.bounce(balls);
  balls.collide(pegs, dampen);
  balls.bounce(wallRight);
  balls.bounce(wallLeft);
  balls.bounce(wallBottom, hitBottom);
  
  for(i = 0; i < balls.length; i++){
  
  	if(balls[i].velocity.y < maxSpeed){
	  	balls[i].velocity.y += grav;
	  } else {
	  	balls[i].velocity.y = maxSpeed;
	  }
  }
  
  if(shake === true){
  	for(var t = 0; t < 1; t++){
  		cameraShake();
  	}
  	cameraShake();
  	shake = false;
  }
  
  balls.collide(cups, getPoints);
  
  drawSprites();
}

function mousePressed(){
	createBall();
}

function touchStarted(){
	createBall();
}

function keyPressed(){
	createBall();
}

function createPeg(type, x, y) {
  var a = createSprite(x, y);
  var img  = loadImage("assets/circle.png");
  a.addImage(img);
  a.setCollider(type, 0, 0, 15);
  //a.debug = true;
  a.immovable = true;
  pegs.add(a);
  return a;
}

function createCup(type, x) {
  var a = createSprite(x, height-120);
  var img  = loadImage("assets/cup.png");
  a.addImage(img);
  a.setCollider(type, 0, 0, 120);
  a.immovable = true;
  cups.add(a);
  return a;
}

function createBall(){
	if(ballCount > 0){
		ballCount--;
		shake = true;
		//shoot.play();
		var b = createSprite(mouseX, 0);
		var bImg = loadImage("assets/ball0"+round(random(1,3))+".png");
	 b.addImage(bImg);
	 b.setCollider("circle", 0, 0, 15);
	 //b.debug = true;
	 var r = random(0, 180);
	 b.setSpeed(5, r);
	 balls.add(b);
	 return b;
	}
}

function cameraShake(){
	var xx = 0;
	var yy = 0;

	if(shake == true){
		xx += round(random(-shakeAmount, shakeAmount));
		yy += round(random(-shakeAmount, shakeAmount));
		translate(xx, yy);
	} else {
		translate(-xx, -yy);
	}
}

function getPoints(ball){
	score += 1;
	ball.remove();
	//scoreSound.play();
}

function dampen(ball){
	
// 	ball.velocity.y *= 1;
// 	ball.velocity.x *= 2;
	//ball.velocity -= 0.5;
}

function hitBottom(ball){
	ball.remove();
}