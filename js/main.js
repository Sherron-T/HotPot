import {Scene1} from "./scene1.js";
import {Scene2} from "./scene2.js";


var config = {
  type: Phaser.AUTO,
  width: 600,
  height: 400,
  backgroundColor: "#5D0505",
  physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
  scene: [Scene2, Scene1]
};

var game = new Phaser.Game(config);
