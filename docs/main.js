let images;
let grid;
let wireFrames = config.wireFrame;
let player;
let spriteCache;

function preload() {
  
  images = {}
  Object.keys(config.images).map(name => {
    images[name] = loadImage(config.images[name]);
  })
}

function mouseClicked() {
    MatterObject.mouseDown();
}
  

function setupWorld() {
  engine = Engine.create();
  world = engine.world;
  print(world.gravity.y);
  world.gravity.y = config.gravity;
  
  Matter.Runner.run(engine);  
}

function createGUI() {
  if(!config.showGUI) return;
  button = createButton("Left");
  button.position(20, 40);
  button.size(100, 25);
  button.mousePressed(scrollLeft);
  
  button2 = createButton("Right");
  button2.position(150, 40);
  button2.size(100, 25);
  button2.mousePressed(scrollRight);
  
  slider = createSlider(50, 500, 50, 50);
  slider.position(300, 35);
  slider.style('width', '200px');  
  
  checkbox = createCheckbox('Wireframes', wireFrames);
  checkbox.position(10, 10);
  checkbox.changed(onChange);
}

function onChange() {
  wireFrames = !wireFrames;
}

function keyPressed() {
  if(key == " ") {
    wireFrames = !wireFrames;
  }
}

function createCache() {
  var spriteIndex = [0,1,2,3,4,5,6,7,8,9];
  spriteCache = {};
  spriteIndex.map(index=>{ 
      spriteCache[index] = images.sprites.get(index*10,0,10,10)    
  })
}

function setup() {
  createCache();
  rectMode(CENTER)
  setupWorld();
  t = 0; fr = 0;
  setInterval(() => { fr = frameRate() }, 500);
  createCanvas(config.canvas.width, config.canvas.height);
  createGUI();
  
  var mapBlocks = 20;
  var blockSize = images.blocks.width / mapBlocks;
  grid = new Grid(images.blocks,
                 config.grid.translate.x,
                 config.grid.translate.y,
                 config.grid.rows, 
                 config.grid.cols, 
                 config.grid.blockSize
                );

  player = new Player(images.sprites,config.player.x,config.player.y)  
  setInterval(centerPlayerToMiddle,5)
}

function centerPlayerToMiddle() {
  var playerPosition = player.absolutePosition().x;
  var middle = windowWidth/2;
  var centeringSpeed = 0.005;
  var translation = 0;
  if(abs(playerPosition - middle) > 100)
    translation = centeringSpeed * (middle - playerPosition)
    
  MatterObject.translate(translation,0);
}

function scrollRight(){
  t-=slider.value();
  print("Scrolling")
  MatterObject.translate(-slider.value(),0)
}
function scrollLeft(){
  t+=slider.value();
  print("Scrolling")
  MatterObject.translate(slider.value(),0)
}

function draw() {
    cursor(Block.cursor);
    background(...config.backgroundColor);
    MatterObject.draw(wireFrames);
    player.checkMovement()
    if(config.showGUI) {
      text(floor(fr), 150, 25);
    }
    
}
