let config = {
  showGUI: true,
  gravity: 0.9,
  movement: {
    //in minecraft it takes .80 secs to fall 4 blocks
    jumpAmount: 5,
    speed: 5
  },
  grid : {
    translate: {
      x:-400,
      y: 200,
    },
    rows: 20,
    cols: 100,
    blockSize: 20,
  },
  player: {
    x: 100,
    y: 0,
    bodyOptions: { inertia: Infinity, restitution: 0.5, friction: 0}
  },
  canvas: { width: 800, height: 700},
  backgroundColor: [50,150,300],
  wireFrame: false,
  images: {
    blocks: "assets/bitMap.png",
    sprites: "assets/sprites.png",
  },
  log: true,
  blockTypes: {
    "GRASS": 1,
    "EARTH": 4,
    "IRON": 6,
    "DIAMOND": 7,
    "AIR": 11,
  }
}

let images;
let grid;
let wireFrames = config.wireFrame;
let player;

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

function setup() {
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
    background(...config.backgroundColor);
    MatterObject.draw(wireFrames);
    player.checkMovement()
    if(config.showGUI) {
      text(floor(fr), 150, 25);
      text(world.bodies.length, 250, 25);
    }
    
}
