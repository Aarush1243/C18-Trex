var trex, trexRunning, trexCollided;
var ground, groundImg;
var invisibleGround;
var cloud, cloudImg;
var ob1, ob2, ob3, ob4, ob5, ob6, obstacle;
var cloudsGroup, obstaclesGroup;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var score = 0;
var gameOver, restart;
var jumpSound ;
var deathSound ;
var checkpointSound;

function preload() {
  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollided = loadAnimation("trex_collided.png");
  groundImg = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  ob1 = loadImage("obstacle1.png");
  ob2 = loadImage("obstacle2.png");
  ob3 = loadImage("obstacle3.png");
  ob4 = loadImage("obstacle4.png");
  ob5 = loadImage("obstacle5.png");
  ob6 = loadImage("obstacle6.png");
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  deathSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkpoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50, height-120, 20, 50)
  trex.scale = 0.5
  trex.addAnimation("running", trexRunning)
  trex.addAnimation("collided", trexCollided)

  ground = createSprite(width/2, height-50, width, 20)
  ground.x = ground.width / 2
  ground.addImage("grd", groundImg)

  invisibleGround = createSprite(width/2, height-55, width, 20)
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  gameover = createSprite(width/2, height/2-50);
  gameover.addImage(gameoverImg);
  gameover.scale = 3;

  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  restart.scale = 0.5;
}
function draw() {
  //set background color 
  background(200);
  if (gamestate == PLAY) {
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }
    ground.velocityX = -5
     if (touches.length>0 || keyDown("space") && trex.y >= height-180) {
      trex.velocityY = -7.5;
      jumpSound.play();
      touches = []
    }
    trex.velocityY += 0.75; 
    /*if(trex.isTouching (obstaclesGroup)){
      trex.velocityY = -7.5;
      jumpSound.play();
    }
      trex.velocityY += 0.25;*/

    if (frameCount % 60 == 0) {
      spawnClouds();
    }
    if (frameCount % 100 == 0) {
      spawnObstacles();
    }
     if (obstaclesGroup.isTouching(trex)) {
      gamestate = END
    } 
    score = score + Math.round(frameCount/60)
    //checkpointSound.play();

    gameover.visible = false
    restart.visible = false
  }
  else if (gamestate == END) {
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0)
    obstaclesGroup.setVelocityXEach(0)
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    //deathSound.play();

    trex.changeAnimation("collided", trexCollided);

    gameover.visible = true
    restart.visible = true
    if(mousePressedOver(restart)){
      restartGame();
    }
  }
  trex.collide(invisibleGround)
  text("score:" + score, width-100, 50)

  //trex.debug = true;
  trex.setCollider("circle",0, 0,30); 
  drawSprites();

}

function spawnClouds() {
  cloud = createSprite(width, height-300, 40, 10);
  cloud.scale = 0.75
  cloud.addImage(cloudImg)
  cloud.velocityX = -5
  cloud.y = Math.round(random(10, 60))
  cloud.depth = trex.depth
  trex.depth = trex.depth + 1
  cloud.lifetime = 120
  cloudsGroup.add(cloud);
}

function spawnObstacles() {
  obstacle = createSprite(width, height-75, 40, 10)
  var r = Math.round(random(1, 6))
  switch (r) {
    case 1:
      obstacle.addImage(ob1)
      break
    case 2:
      obstacle.addImage(ob2)
      break
    case 3:
      obstacle.addImage(ob3)
      break
    case 4:
      obstacle.addImage(ob4)
      break
    case 5:
      obstacle.addImage(ob5)
      break
    case 6:
      obstacle.addImage(ob6)
      break
  }
  obstacle.velocityX = -5
  obstacle.scale = 0.5
  obstacle.lifetime =-(width/obstacle.velocityX)
  obstaclesGroup.add(obstacle);
}

function restartGame(){
  gamestate = PLAY;
  score = 0;
  restart.visible = false;
  gameover.visible = false;

  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();

  trex.changeAnimation("running");
}
