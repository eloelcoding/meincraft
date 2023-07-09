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
        push()
            translate(500, 400);
            rect(0,0,slotSize*10,slotSize,10);
            var items = Object.keys(this.items);
            var i = 0;
            
            textSize(20);
            textStyle(BOLD);
            fill(255);
            items.map(itemType=>{
                var img=imageCache[itemType];
                image(img,slotSize*(i-4.4),0,slotSize*0.9,slotSize*0.9);
                text(this.items[itemType],slotSize*(i-4.3),slotSize/3);
                i++
            })
        pop()
    }
}