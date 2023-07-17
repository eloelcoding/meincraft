class Player extends MatterObject {
  constructor(img,x,y) {
    super();
    this.width = 10;
    this.height = 20;
    this.imgLeft = img.get(0,0,this.width,this.height)
    this.imgRight = img.get(10,0,this.width,this.height)
    this.direction = 1
    this.scale = config.grid.blockSize/this.width;
    // inertia
    var options =  config.player.bodyOptions;
    this.body = Bodies.rectangle(
      x, y, 
      this.width*this.scale,this.height*this.scale,
      options
    );
    
    World.add(world, this.body);    
  }  
  
  setDirection(direction){
    if (direction==0) return
    this.direction = direction
  }

  getCoordinates() {
    var grid = Game.grid 
    let pos = this.body.position;
    var col = round(( pos.x - grid.x - MatterObject._translate.x ) / config.grid.blockSize);
    var row = round(( pos.y - grid.y - MatterObject._translate.y ) / config.grid.blockSize);

    // if we are outside the grid, return nothing
    if(col < 0 || col >= grid.cols || row < 0 || row >= grid.rows)
      return;
    return {
      row, col
    }
  }
  
  checkMovement(){
    var speed = config.movement.speed;
    var jumpAmount = config.movement.jumpAmount;
    var x = speed * (keyIsDown(RIGHT_ARROW) - keyIsDown(LEFT_ARROW));
    var y = jumpAmount * (keyIsDown(DOWN_ARROW) - keyIsDown(UP_ARROW));
    var speedUp = keyIsDown(SHIFT);
    if(speedUp) {
      x *= config.movement.shiftSpeedupFactor;
      y *= config.movement.shiftSpeedupFactor;
    }
    this.setDirection(x)
    Matter.Body.translate(this.body, {x,y});
    // if(abs(this.absolutePosition().x-windowWidth) > 200)
    MatterObject.translate(-x/3,0);
  }
    
  draw(wireFrame) {
    let pos = this.body.position;
    if(wireFrame) {
      var cords = this.getCoordinates()
    if (cords){
      print(cords);
    }
      translate(pos.x,pos.y)
      rotate(this.body.angle)
      rect(0,0,this.width*this.scale,this.height*this.scale)
      return;
    }
    
    translate(pos.x,pos.y);
    
    scale(this.scale,this.scale)
    // rotate(this.body.angle)

    if (this.direction<0)
      image(this.imgLeft,0,0)
    if (this.direction>0)
      image(this.imgRight,0,0);

  }  
}