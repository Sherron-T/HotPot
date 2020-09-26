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
var hp = 3;
var cursors;
var keyZ;

function takeDmg(player){
    hp -= 1;
    console.log("ouch");
};

var bossSpeed = 50;

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
        platforms.create(0, 800, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(500, 800, "platform").setOrigin(0, 0).refreshBody();

        // create the boss object 
        var boss = this.physics.add.sprite(Phaser.Math.Between(500, 800), 0, 'boss');
        boss.setBounce(0.4);
        boss.setCollideWorldBounds(true);  

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
        cursors = this.input.keyboard.createCursorKeys();
        keyZ = this.input.keyboard.addKey("z");
        if (cursors.left.isDown){
            player.setVelocityX(-160);

        }else if (cursors.right.isDown){
            player.setVelocityX(160);

        }else{
            player.setVelocityX(0);
        }
        if (cursors.up.isDown && player.body.onFloor()){
            player.setVelocityY(-300);
        }
        if (keyZ.isDown){
            console.log("z");
        }
        setInterval(this.bossMovement.bind(null, this.boss), 1000);
    }
    bossMovement(boss){
        // move in range (500, 800)
        if(boss.x > 650){
            while(boss.x > 500){
                boss.setVelocityX(-50); 
            }
            boss.setVelocityX(0);
        }else{
            while(boss.x < 800){
                boss.setVelocityX(50);
            }
            boss.setVelocityX(0);
        }
    }
}

var config = {
    type: Phaser.AUTO,
    width: 1500,
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