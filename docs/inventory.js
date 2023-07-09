class Inventory{
    constructor(){
        this.items = {};
        
    }
    addItem(type){
        
        if (!this.items[type]){
         this.items[type]=1 
        } else{
        this.items[type]++
        }
        print (this.items)  

    }
    
    draw(){
        var slotSize=60
        var itemSize=slotSize*0.75
        var black=80
        push()
            translate(500, 400);
            push()
            fill(black,black,black,180)
            rect(0,0,slotSize*10,slotSize,10);
            image(images.hotbar,0,0,slotSize*10,slotSize)
            pop()
            var items = Object.keys(this.items);
            var i = 0;
            
            textSize(20);
            textStyle(BOLD);
            fill(255);
            translate(-slotSize/10,0)
            items.map(itemType=>{
                var img=imageCache[itemType];
                image(img,slotSize*(i-4.4),0,itemSize,itemSize);
                text(this.items[itemType],slotSize*(i-4.3),slotSize/3);
                i++
            })
        pop()
    }
}