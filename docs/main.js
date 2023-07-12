let images;
let grid;
let wireFrames = config.wireFrame;
let player;
let spriteCache, imageCache;
let sounds;

function preload() {
  
  images = {}
  Object.keys(config.images).map(name => {
    print("Loading image " + name);
    images[name] = loadImage(config.images[name]);
  })
  sounds = {};
  Object.keys(config.sounds).map(name => {
    var sound = loadSound(config.sounds[name]);
    sounds[name] = _.throttle(() => sound.play(), 1000); 
  })
}

function mouseReleased() {
  MatterObject.mouseReleased();
}

function mouseDown() {
  logIt("Mouse pressed");
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
  //deactive inspect right click menu thing
  canvas = document.querySelector('canvas');
  canvas.addEventListener('contextmenu', event => event.preventDefault());
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

function mousePressed() {
  if (mouseButton === RIGHT) {
    if(grid.mouseIsOnBlock()) return
    grid.addItem(grid.inventory.selected)
    console.log("Right-click detected");
  }
}

function keyPressed() {
  if(key == " ") {
    wireFrames = !wireFrames;
  }
  if (key >= '1' && key <= '9') {
    grid.inventory.setActive(float(key)-1);
  }
}

function createCache() {
  var spriteIndex = [0,1,2,3,4,5,6,7,8,9];
  spriteCache = {};
  spriteIndex.map(index=>{ 
      spriteCache[index] = images.sprites.get(index*10,0,10,10)    
  })

  imageCache = {};
  var mapBlocks = 10;
  var blockSize = images.blocks.width / mapBlocks;

  Object.keys(config.blockTypesMap).map(type => {
    imageCache[type] = images.blocks.get(type*blockSize,0,blockSize,images.blocks.height)    
  })
}
function setup() {
  createCache();
  rectMode(CENTER);
  imageMode(CENTER);
  setupWorld();
  t = 0; fr = 0;
  setInterval(() => { fr = frameRate() }, 500);
  config.canvas = {width: windowWidth, height: windowHeight}
  createCanvas(config.canvas.width, config.canvas.height);
  createGUI();
  
  grid = new Grid(images.blocks,
                 config.grid.translate.x,
                 config.grid.translate.y,
                 config.grid.rows, 
                 config.grid.cols, 
                 config.grid.blockSize
                );

  player = new Player(images.sprites,config.player.x,config.player.y)  
  setInterval(centerPlayerToMiddle,5);
}

function centerPlayerToMiddle() {
  return;
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
  if(config.showGUI) {
    text(floor(fr), 150, 25);
  }

  MatterObject.draw(wireFrames);

  // cursor
  if(!grid.mouseIsOnBlock()) {
    var coordinates = grid.snappedXYcoordinates();
    var snapGrid = config.grid.snap;
    if(coordinates != undefined) {
      push()
      if(snapGrid)
        translate(coordinates.x, coordinates.y);
      else
        translate(mouseX,mouseY);
      var scaling = 1/15 * config.grid.blockSize / 20;
      scale(scaling,scaling)
      image(imageCache[grid.inventory.selected],0,0);
      pop();
    } 
  }
//  cursor(Block.cursor);
  player.checkMovement()
  if(mouseIsPressed)
    mouseDown();
  grid.inventory.draw()
    
}
