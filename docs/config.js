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
      rows: 10,
      cols: 100,
      blockSize: 50,
    },
    player: {
      x: 100,
      y: 0,
      bodyOptions: { inertia: Infinity, restitution: 0.5, friction: 0}
    },
    canvas: { width: 1300, height: 600},
    backgroundColor: [50,150,300],
    wireFrame: false,
    images: {
      blocks: "assets/images/bitMap.png",
      sprites: "assets/images/sprites.png",
    },
    sounds: {
      shovel: "assets/sounds/flatten3-shovel.mp3",
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
  