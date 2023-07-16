class Game {
    constructor(grid, player, inventory) {
        this.grid = grid;
        this.player = player;
        this.inventory = inventory;
        if(!inventory)
            this.generateInventory();
        Game._instance = this;
    }

    generateInventory() {
        this.inventory = new Inventory();
        for(var i=0;i<100;i++) {
          var randomBlockType = floor(random() * (Object.keys(config.blockTypes).length-1)); 
          print(randomBlockType);
          this.inventory.addItem(randomBlockType);
        }
    }

    static Instance() {
        return Game._instance;
    }

    static draw() {
        Game.Instance().inventory.draw();
    }
}