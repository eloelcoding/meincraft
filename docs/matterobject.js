// Matter.js module aliases
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

class MatterObject {
	static objects = [];
    static _translate = {x:0,y:0};
	constructor() {
		MatterObject.objects.push(this);
	};	

    absolutePosition() {
      return { 
        x: player.body.position.x + MatterObject._translate.x,
        y: player.body.position.y + MatterObject._translate.y,
      } 
    }

    static translate(x,y) {
      MatterObject._translate.x += x;
      MatterObject._translate.y += y;
    }

	static draw(wireFrame) {
		MatterObject.objects.map(obj => {
          push();
          translate(MatterObject._translate.x, MatterObject._translate.y);
          obj.draw(wireFrame)
          pop();
        });
	}

    static mouseDown() {
      MatterObject.objects.map(obj => obj.mouseDown && obj.mouseDown());
    }
}