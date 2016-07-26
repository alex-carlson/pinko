var slash, peg, ball;
var pegs;
var grav = .2;
var maxSpeed = 10;
var ballCount = 10;
var w;
var h;
var speed = 3;
var shake = false;
var score = 0;
var shakeAmount = 5;
var shoot;
var scoreSound;
var font, font2;
var level = 1;
var offset;
var angle = 0;
var angleLeft = false;

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
  angleMode(DEGREES);

  textFont(font);
  textSize(300);

  var w = width;
  var h = height - (height/5);

  pegs = new Group();
  balls = new Group();
  cups = new Group();
  shoot.setVolume(0.2);
  scoreSound.setVolume(0.2);

  //createBall();

  for(var i = 0; i<round(width/100); i++) {

	  for(var j = 0; j<round(height / 200); j++){

	    if(j % 2)
        offset = 1;
      else
        offset = 0;

	  	var pegsWide = w/(width/120);

	  	var px = width - w + ( i * (pegsWide) ) + (offset * width/14);
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

  moveAngle();

  fill(30);
  text(score, width/2, height/2);
  textSize(45)
  fill(255);
  text("Restart", width-100, 45);

  textFont(font2);
  textSize(32);
  text("tries: "+ballCount, 80, 50);

  strokeWeight(3);
  stroke(255);
  push();
  translate(mouseX, 0);
  rotate(angle-90);
  line(0, 0, 0, 50);
  pop();

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

  if(mouseX > width-170 && mouseY < 45){
    score = 0;
    ballCount = 10;
    return;
  }
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
  a.setCollider(type, 0, 0, 80);
  a.immovable = true;
  cups.add(a);
  return a;
}

function createBall(){
	if(ballCount > 0){
		ballCount--;
		shake = true;
		shoot.play();
		var b = createSprite(mouseX, 0);
		var bImg = loadImage("assets/ball0"+round(random(1,4))+".png");
	 b.addImage(bImg);
	 b.setCollider("circle", 0, 0, 15);
	 //b.debug = true;
	 print(angle);
	 b.setSpeed(5, angle*60);
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
	scoreSound.play();
}

function dampen(ball){

// 	ball.velocity.y *= 1;
// 	ball.velocity.x *= 2;
	//ball.velocity -= 0.5;
}

function hitBottom(ball){
	ball.remove();
}

function moveAngle(){
  if(angle <= 0){
     angleLeft = true;
  } else if (angle >= 180){
    angleLeft = false;
  }

  if(angleLeft){
    angle+=speed;
  } else {
    angle-=speed;
  }
}
