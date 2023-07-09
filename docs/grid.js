let imageCache = {};

class Block extends MatterObject {
  static cursor;
  constructor(grid, row, col, type) {
    super();
    var img = grid.img;
    if(!imageCache[type]) {
      imageCache[type] = img.get(type*grid.blockSize,0,grid.blockSize,img.height)    
    }

    this.img = imageCache[type]; //img.get(type*grid.blockSize,0,grid.blockSize,img.height)    
    this.type = type;
    this.grid = grid;
    this.type = type;
    this.row = row;
    this.col = col;
    this.x = grid.x + col * grid.size 
    this.y = grid.y + row * grid.size
    var airAbove = true;
    this.health = 100;

    if(row>0){
      var blockAbove = grid.grid[row-1][col];
      airAbove = !blockAbove.isVisible()
    }    
    
    if(this.isVisible()&&airAbove) 
      this.addToWorld();
  }
  
  addToWorld() {
    logIt("Creating body at ", this.row, this.col);
    if(this.body || !this.isVisible()) {
      logIt("... canceled - not visible or already has a body")
      return;
    }
    var grid = this.grid;
    this.body = Bodies.rectangle(this.x, this.y, grid.size, grid.size, 
                                 { isStatic: true, friction: 0 });
    World.add(world, this.body);        
  }
  
  isVisible() {
    return !this.isDestroyed() && this.type != config.blockTypes.AIR;
  }

  isTouchedByMouse() {
    if(!this.body) return false;
    var translate = MatterObject._translate;
    var coordinates = {x:mouseX-translate.x,y:mouseY-translate.y};
    var isInside = Matter.Vertices.contains(this.body.vertices,coordinates);
    return isInside;
  }

  mouseReleased() {
    // if it wasn't fully destroyed then restore it back to 100
    if(!this.isDestroyed())
      this.health = 100;
  }

  takeHit() {
    var typeName = config.blockTypesMap[this.type];
    var hit = config.hitSpeedByBlockType[typeName] * config.hitSpeed;
    if(hit == 0) console.error("Could not find blocktype");
    this.health -= hit;
    sounds.shovel();
  }

  isDestroyed() {
    return this.health<=0;   
  }

  neighbors() {
    var blocks = [];
    var neighbors = [[1,0],[0,-1],[0,1],[-1,0]];
    logIt("Destroying block",this.row,this.col);
    neighbors.map(neighbor => {
      var row = this.row + neighbor[0];
      var col = this.col + neighbor[1];
      // corner cases: top rows/cols
      if(row==0 || row == this.grid.grid.length) return;
      // if(col==0 || col == this.grid.grid[0].length) return;
      var neighborBrick = this.grid.grid[row][col];
      blocks.push(neighborBrick);
    });
    return blocks;
  }

  mouseDown() {
    if(this.isTouchedByMouse()) {
      this.takeHit();
      // take the hit and then return
      if(!this.isDestroyed())
        return;
      // create a physical body for all neighbors
      this.neighbors().map(brick => brick.addToWorld());
      World.remove(world,this.body);
      delete(this.body);
    }
  }
  
  draw(wireFrame) {
    if(this.isTouchedByMouse()) {
      Block.cursor = HAND;
    };
    if (this.isVisible()) {
      if(wireFrame) {
        if(!this.body) return
        rect(this.x,this.y,this.grid.size,this.grid.size)
        return;
      }
      push();
      translate(this.x-this.grid.size/2, this.y-this.grid.size/2);
      scale(this.grid.size/this.grid.blockSize)
      image(this.img,0,0);
      if(this.health<100){
        var level = 9 - floor(this.health / 25);
        scale(30,30)
        image(spriteCache[level],0,0)
      }
      pop();
    }
  }
}


//cols=collumns | size is the size of a single square
class Grid {
  blockType(row, col) {
    col*=0.15
    var waveOne=Math.sin(col/2)
    var waveTwo=Math.cos(3*col/2)/2
    var waveThree=Math.sin(3*col/4)
      
    var h = -3.5*(-1.4+(waveOne+waveTwo)*waveThree);

    let blockType;

    const BLOCKTYPE = config.blockTypes;
    
    if (row < h){
      // air
      blockType = BLOCKTYPE.AIR;
    }
    else if(row<h+1){
      blockType = BLOCKTYPE.GRASS;
    }
    else if(row>h+3){
      blockType = BLOCKTYPE.EARTH;
        // place iron with prob
      if (random() < 0.1) blockType = BLOCKTYPE.IRON;
      // place diamongs but only at a certain depth
      if (row > 7 && random() < 0.05)
        // if(random() < 0.005 * (10-row))
        blockType = BLOCKTYPE.DIAMOND;
    }
    else {
      blockType = 0;

    }

    return blockType;
  }

  constructor(img, x, y, rows, cols, size) {
    this.x = x;
    this.y = y;
    var mapBlocks = 10;
    var blockSize = img.width / mapBlocks; // 287 or 10
    this.size = size;
    this.blockSize = blockSize;
    this.img = img;
    this.rows = rows;
    this.cols = cols;
    
    var grid = [];
    this.grid = grid;

    for (var i = 0; i < rows; i++) {
      var row = [];
      for (var j = 0; j < cols; j++) {
        var blockType = this.blockType(i, j);
        row.push(new Block(this, i, j, blockType));
      }
      grid.push(row);
    }
    
  }
}
