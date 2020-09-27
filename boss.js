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
// 6. use weapon to attack the boss 

var player;
var hp = 3;
var cursors;
var keyZ;
var boss;
var hearts; 
var endText;
var bossText;
var playerCollider;
var bossCollider;
var bullets; 
var bossHP = 50;
var facing_left = false; //True if Left

function takeDmg(player){
    hp = hp == 0 ? 0 : hp - 1;
    console.log("ouch");
    var heart = hearts.getChildren(); 
    hearts.killAndHide(heart[hp]); 
    heart[hp].body.enable = false;
}

var bossSpeed = 50;

class Leek extends Phaser.Scene {
    preload(){
        this.load.image('platform', 'assets/ground.png');
        this.load.image('background', 'assets/bg.png');
        this.load.image('boss', 'assets/leek.png');
        this.load.spritesheet('pork', 'assets/pork.png', {frameWidth : 100, frameHeight : 78});
        this.load.image('weapon', 'assets/weapon.png');
        this.load.audio('boss_music', 'assets/boss.wav')
        this.load.image('heart', 'assets/heart.png')
        this.load.image('rice', 'assets/rice.png')
        // this.load.script('WeaponPlugin', 'node_modules/phaser3-weapon-plugin/out/WeaponPlugin.js', 'weaponPlugin', 'weapons');
    }
    create(){
        // this.plugins.install('WeaponPlugin', WeaponPlugin.WeaponPlugin, 'weapons', this);
        // add background image 1000x5000
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        var music = this.sound.add('boss_music',{
            loop: true,
            delay: 0,
            volume: 0.2
          });
        music.play();
        // variable for all platforms 100x1000
        var platforms = this.physics.add.staticGroup();
        platforms.create(0, 800, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(500, 800, "platform").setOrigin(0, 0).refreshBody();

        // create the boss object
        // var boss = this.physics.add.sprite(Phaser.Math.Between(500, 800), 0, 'boss');
        // boss.setBounce(0.4);
        // boss.setCollideWorldBounds(true);
        boss = this.physics.add.image(Phaser.Math.Between(500, 800), 200, 'boss').setOrigin(0);
        bossSpeed = Phaser.Math.GetSpeed(600, 6); 

        // create main char
        player = this.physics.add.sprite(0, 0, 'pork');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        // weapons
        // this.add.weapon(10, 'rice');
        bullets = this.physics.add.group({
            allowGravity: false
        }); 

        // lives for player 
        hearts = this.physics.add.staticGroup({
            key: 'heart',
            frameQuantity: 3,
            immovable: true,
            setXY: {x: 50, y: 50, stepX: 50}
        });

        // animations 
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('pork', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'pork', frame: 6 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('pork', { start: 7, end: 12 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'gun_right',
            frames: this.anims.generateFrameNumbers('pork', { start: 13, end: 14 }),
            frameRate: frameRate: 7
        });
        this.anims.create({
            key: 'gun_left',
            frames: this.anims.generateFrameNumbers('pork', { start: 15, end: 16 }),
            frameRate: 7
        });
        this.anims.create({
            key: 'idle_left',
            frames: [ { key: 'pork', frame: 15 } ],
            frameRate: 10
        });
        this.anims.create({
            key: 'idle_right',
            frames: [ { key: 'pork', frame: 13 } ],
            frameRate: 10               
        });

        // make player collide with platforms
        playerCollider = this.physics.add.collider(player, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);
        this.physics.add.collider(boss, bullets, this.bossHurt, null, this);

        this.physics.add.overlap(player, boss, takeDmg, null, this);

        bossText = this.add.text(1200, 40, 'Boss HP: ' + bossHP, { fontSize: '32px', fill: '#4314B0' });

        // clearInterval(timeInter) when the boss dies <---- !!!
        
        // this.physics.moveTo(boss, 500, 0, 150);
        // boss.setVelocityX(10);
        // var timeInter = setInterval(this.bossMovement.bind(null, boss, bossSpeed), 5000);

    }
    update(time, delta){
        player.body.width = 60;
        player.body.offset.x = 20;
        cursors = this.input.keyboard.createCursorKeys();
        keyZ = this.input.keyboard.addKey("z");
        if (cursors.space.isDown && facing_left == true){
            player.anims.play('gun_left', true);
            if(player.body.onFloor()){
              player.setVelocityX(0);
            }
            var b = bullets.create(player.x, player.y, 'rice');
            b.setVelocityX(-150);
        }else if (cursors.space.isDown){
            player.anims.play('gun_right', true);
            if(player.body.onFloor()){
              player.setVelocityX(0);
            }
            var b = bullets.create(player.x, player.y, 'rice');
            b.setVelocityX(150);
        }else if (cursors.left.isDown){
            player.setVelocityX(-160);
            player.anims.play('left', true);
            facing_left = true;
        }
        else if (cursors.left.isDown){
            player.setVelocityX(-160);
            player.anims.play('left', true);

        }else if (cursors.right.isDown){
            player.setVelocityX(160);
            player.anims.play('right', true);
            facing_left = true;
        }else{
            player.setVelocityX(0);
            //player.anims.play('turn');
            if(facing_left == true){
              player.anims.play('idle_left', true);
            }
            else{
              player.anims.play('idle_right', true);
            }
        }
        if (cursors.up.isDown && player.body.onFloor()){
            player.setVelocityY(-300);
        }
        if (keyZ.isDown){
            console.log("z");
        }

        boss.x += bossSpeed * delta; 
        if(boss.x >= 800){
            // setInterval(this.dummy, 5000); 
            bossSpeed = -bossSpeed; 
        }
        if(boss.x <= 500){
            // setInterval(this.dummy, 5000); 
            bossSpeed = -bossSpeed; 
        }
        if(hp == 0){
            player.anims.play('turn');
            this.physics.world.removeCollider(playerCollider);
            player.setCollideWorldBounds(false);
            endText = this.add.text(600, 500, "YOU LOST", { fontSize: '60px', fill: '#E00404' });
            return;
        }
        if(bossHP == 0){
            this.physics.world.removeCollider(bossCollider);
            boss.setCollideWorldBounds(false);
            endText = this.add.text(600, 500, "YOU WIN", { fontSize: '60px', fill: '#C45827' });
            return;
        }
    }
    // bossMovement(boss, bossSpeed){
    //     // move in range (500, 800)
    //     console.log("here")
    //     let x = boss.x;
    //     if(x > 650){
    //         console.log("1")
    //         while(boss.x < 800){
    //             console.log("2")
    //             boss.x += bossSpeed;
    //         }
    //     }else{
    //         console.log("3")
    //         while(boss.x > 500){
    //             boss.x -= bossSpeed;
    //         }
    //     }
    // }
    dummy(){
        console.log("Waiting"); 
    }
    bossHurt(boss, bullet){
        bullet.disableBody(true, true);
        bossHP = bossHP == 0 ? 0 : bossHP - 1; 
        bossText.setText('Boss HP: ' + bossHP);
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
              debug: true
          }
      },
    scene: [Leek]
  };


var game = new Phaser.Game(config);
