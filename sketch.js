var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, ground, invisibleGround, cloud, obstacle;
var ObstaclesGroup = [];
var CloudsGroup = [];
var gameOver, restart;

function setup(){
  canvas = createCanvas(displayWidth - 20, displayHeight-30);
}

trex = createSprite(380, 200, 50, 20);
trex.setCollider("circle", 0, 0, 30);

trex.scale = 0.5;
trex.y = 50;

ground = createSprite(380, 200, 20, 400);
ground.y = ground.height/2;

invisibleGround = createSprite(385, 200, 5, 400);
invisibleGround.visible = false;


gameOver = createSprite(200, 300);
restart = createSprite(200, 340);
gameOver.scale = 0.5;
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

textSize(18);
textFont("Georgia");
textStyle(BOLD);

var count = 0;

function draw() {
  background("white");
  text("Score: "+ count, 250, 100);
  
  if(gameState === PLAY){
    ground.velocityY = -(6 + 3*count/100);
    count = count + Math.round(frameRate/60);
    
    if (ground.y < 0){
      ground.y = ground.height/2;
    }
    
    if(keyDown("space") && trex.x >= 359){
      trex.velocityX = -12 ;
    }
  
    trex.velocityX = trex.velocityX + 0.8;

    camera.position.x = displayWidth/2;
    camera.position.y = trex.y
    
    spawnClouds();
    spawnObstacles();
    
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityY = 0;
    trex.velocityX = 0;

    ObstaclesGroup.setVelocityYEach(0);
    CloudsGroup.setVelocityYEach(0);
    
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }

  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();  
  count = 0;
  
}

function spawnObstacles() {
  if(World.frameCount % 55 === 0) {
    obstacle = createSprite(365, 400, 40, 10);
    obstacle.velocityY = -(6 + 3*count/100);
              
    obstacle.scale = 0.5;
    obstacle.lifetime = 70;
    ObstaclesGroup.push(obstacle);
  }
}

function spawnClouds() {
  if (World.frameCount % 60 === 0) {
    cloud = createSprite(320, 400, 10, 40);
    cloud.y = randomNumber(320, 280);
    cloud.scale = 0.5;
    cloud.velocityY = -3;
    
    cloud.lifetime = 134;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    CloudsGroup.push(cloud);
  }
}