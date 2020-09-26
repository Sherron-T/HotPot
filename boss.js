// Boss combat 
// boss: leek
// player: warrior 
// ingredients: meatball, meatball2, .... 
// monsters: fork, fork2, ... 
// lives: heart 
// weapon: pork chop 

// 1. player l r u , space -> attack (phaser tutorial)
// 2. boss randomly generated at the right part of the scene (phaser tutorial)
//  2.1 move randomly left right left 
// 3. ingredients move in a small range (x=10 - x=50)
// 4. increasing the scores 
// 5. collide with boss/ingredients -> lose 1 heart 
// 6. use 

var player;

function takeDmg(player){
    
}

var bossSpeed = 100;

class Leek extends Phaser.Scene {
    preload(){
        this.load.image('platform', 'img/ground.png');
        this.load.image('background', 'img/bg.png');
        this.load.image('boss', 'img/leek.png');
        this.load.spritesheet('warrior', 'img/warriors.png', {frameWidth : 80, frameHeight : 85});
        this.load.image('weapon', 'img/weapon.png');
    }
    create(){
        // add background image 1000x5000
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // variable for all platforms 100x1000
        var platforms = this.physics.add.staticGroup();
        platforms.create(0, 800, "platform").setOrigin(0, 0);

        // create the boss object 
        var boss = this.physics.add.group();
        boss.create(Phaser.Math.Between(500, 1000), 0, 'boss');
        // boss.setCollideWorldBounds(true);  

        // create main char
        player = this.physics.add.sprite(0, 0, 'warrior');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        // make player collide with platforms
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(boss, platforms);

        this.physics.add.overlap(player, boss, takeDmg, null, this);
    }
    update(){
        
        // setInterval(bossMovement, 500); 
    }
    bossMovement(){
        
    }
}

var config = {
    type: Phaser.AUTO,
    width: 2000,
    height: 1000,
    backgroundColor: "#5D0505",
    physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 500 },
              debug: false
          }
      },
    scene: [Leek]
  };
  

var game = new Phaser.Game(config);