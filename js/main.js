//
var platforms;

// player variables
var player;
var cursors;
var keyZ;
var hearts;
var facing_left = false;
var can_shoot = true;
var speed;
var vulTimer;
var invul = false;

// gun variables
var bullets;
var gun_sound;

// boss variables
var boss;
var endText;
var bossText;
var bossStop = false;
var bossSpeed;
var bossSpecial = true;
var nukes;

// condition variables
var playerCollider;
var bossCollider;
var timedEvent;
var playerBossOverlap;
var playerNukesOverlap;
// Math.round(Math.random())

//MODIFIABLE VARIABLES
// player variables
var hp = 3;
var invulDuration = 3000;
var horizontalSpeed = 160;
var verticalJump = 300;

// gun variables
var gunSpeed = 300;
var gunVelocity = 400;

// boss variables
var bossHP = 50;
var bossStopDuration = 800;
var bossLeftBound = 100;
var bossRightBound = 1000;


class CommonScene extends Phaser.Scene{
    preload(){
        // common for all levels
        this.load.image('heart', 'assets/heart.png')
        this.load.spritesheet('pork', 'assets/pork.png', {frameWidth : 100, frameHeight : 78});
        this.load.image('weapon', 'assets/weapon.png');
        this.load.audio('boss_music', 'assets/boss.wav')
        this.load.audio('gun_sound', 'assets/gun_sound.wav')
        this.load.image('rice', 'assets/rice.png')
        this.load.image('rice2', 'assets/rice2.png')
    }
    create(){
        // music settings
        gun_sound = this.sound.add('gun_sound');

        // variable for all platforms
        platforms = this.physics.add.staticGroup();

        // create main char
        player = this.physics.add.sprite(50, 50, 'pork');
        player.setBounce(0.2);
        player.setCollideWorldBounds(false);
        player.body.width = 60;
        player.body.offset.x = 20;
        console.log("player loaded")

        // weapons
        bullets = this.physics.add.group({
            allowGravity: false
        });

        // lives for player
        hearts = this.physics.add.staticGroup({
            key: 'heart',
            frameQuantity: hp,
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
            frameRate: 20
        });
        this.anims.create({
            key: 'gun_left',
            frames: this.anims.generateFrameNumbers('pork', { start: 15, end: 16 }),
            frameRate: 20
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
        this.anims.create({
            key: 'gun_move_right',
            frames: this.anims.generateFrameNumbers('pork', { start: 17, end: 22 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'gun_move_left',
            frames: this.anims.generateFrameNumbers('pork', { start: 23, end: 28 }),
            frameRate: 10,
            repeat: -1
        });


    }
    update(time, delta){
        cursors = this.input.keyboard.createCursorKeys();
        keyZ = this.input.keyboard.addKey("z");
        boss.x += speed * delta;
        if(boss.x >= bossRightBound && !bossStop){
            // setInterval(this.dummy, 5000);
            //console.log("large")
            speed = 0;
            bossStop = true;
            this.time.addEvent({ delay: bossStopDuration, callback: this.moveStop, callbackScope: this});
        }
        if(boss.x <= bossLeftBound && !bossStop){
            // setInterval(this.dummy, 5000);
            speed = 0;
            bossStop = true;
            this.time.addEvent({ delay: bossStopDuration, callback: this.moveStop, callbackScope: this});
        }
        if(bossHP > 0 && bossHP < 30 && bossSpecial == true){
          bossSpecial = false;
          var i;
          var leek_nuke = nukes.create(player.x, Math.floor(Math.random() * (0 - -700) + -700), 'leek_nuke')
          for (i = 0; i < 3; i++) {
            var leek_nuke = nukes.create(player.x + Math.floor(Math.random() * (300 - -300) + -300), Math.floor(Math.random() * (0 - -700) + -700), 'leek_nuke')
          }
          this.time.addEvent({ delay: 2000, callback: this.enableSpecial, callbackScope: this});
        }
        if (cursors.space.isDown && can_shoot == true){
            can_shoot = false;
            gun_sound.play();
            if(facing_left == true){
              var b = bullets.create(player.x-20, player.y+5, 'rice2');
              if(cursors.left.isDown){
                player.anims.play('gun_move_left', true);
              }
              else{
                player.anims.play('gun_left');
              }
              b.setVelocityX(-1*gunVelocity);
            }
            else{
              var b = bullets.create(player.x+20, player.y+5, 'rice2');
              if(cursors.right.isDown){
                player.anims.play('gun_move_right', true);
              }
              else{
                player.anims.play('gun_right');
              }
              b.setVelocityX(gunVelocity);
            }
            if(player.body.onFloor()){
              player.setVelocityX(0);
            }
            timedEvent = this.time.delayedCall(gunSpeed, this.set_shoot, [], this);
        }else if (cursors.left.isDown){
            player.setVelocityX(-1*horizontalSpeed);
            if(cursors.space.isDown == false){
              player.anims.play('left', true);
            }
            facing_left = true;
        }else if (cursors.right.isDown){
            player.setVelocityX(horizontalSpeed);
            if(cursors.space.isDown == false){
              player.anims.play('right', true);
            }
            facing_left = false;
        }else{
            player.setVelocityX(0);
            if(player.anims.getCurrentKey() === 'left' || player.anims.getCurrentKey() === 'right'){
              if(facing_left == true){
                player.anims.play('idle_left');
              }
              else{
                player.anims.play('idle_right');
              }
            }
        }
        if (cursors.up.isDown && player.body.onFloor()){
            player.setVelocityY(-1*verticalJump);
        }
        /*if (keyZ.isDown){
            console.log("z");
        }*/
        if(hp == 0){
            player.anims.play('turn');
            this.physics.world.removeCollider(playerCollider);
            player.setCollideWorldBounds(false);
            endText = this.add.text(600, 500, "YOU LOST", { fontSize: '60px', fill: '#E00404' });
            return;
        }
        if(bossHP == 0){
            this.physics.world.removeCollider(bossCollider);
            this.physics.world.removeCollider(playerBossOverlap);
            this.physics.world.removeCollider(playerNukesOverlap);
            boss.setCollideWorldBounds(false);
            endText = this.add.text(600, 500, "YOU WIN", { fontSize: '60px', fill: '#C45827' });
            return;
        }
    }
    bossHurt(boss, bullet){
        bullet.disableBody(true, true);
        bossHP = bossHP == 0 ? 0 : bossHP - 1;
        bossText.setText('Boss HP: ' + bossHP);
    }
    set_shoot(){
        can_shoot = true;
    }
    takeDmg(player){
        if(invul == false)
        {
          player.setTint(0xB5F2F2);
          invul = true;
          vulTimer = this.time.addEvent({ delay: invulDuration, callback: this.blinking, callbackScope: this});
          hp = hp == 0 ? 0 : hp - 1;
          var heart = hearts.getChildren();
          hearts.killAndHide(heart[hp]);
          heart[hp].body.enable = false;
        }
    }
    blinking(){
        player.clearTint();
        invul = false;
    }
    enableSpecial(){
        bossSpecial = true;
    }
    moveStop(){
        bossSpeed = -bossSpeed;
        speed = bossSpeed;
        bossStop = false;
    }
}

class Level1 extends CommonScene{
    preload(){
        super.preload();

        this.load.image('boss', 'assets/leek.png');
        this.load.image('leek_nuke', 'assets/leek_bullet.png')
        // load bg and platform
        this.load.image('level1bg', 'assets/level1bg.png');
        this.load.image('background', 'assets/bg.png');
        this.load.image('platform', 'assets/ground.png');
        this.load.image('big_platform', 'assets/ground2.png');
        // we can initiate the variables for the specific boss info here
        // based on the level design
        hp = 3;
    }
    create(){
        // background
        // need normal bg

        // boss bg
        this.add.image(0, 0, 'level1bg').setOrigin(0, 0);
        this.add.image(9000, 0, 'background').setOrigin(0, 0);

        super.create();

        // make platforms
        platforms.create(0, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(1000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(2000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(3000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(4000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(5000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(6000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(7000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(8000, 900, "platform").setOrigin(0, 0).refreshBody();

        // make small enemies

        // play level music

        // should be conditional for when player approaches boss room
        // boss platform
        platforms.create(9997, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(9000, 900, "platform").setOrigin(0, 0).refreshBody();
        // make boss
        boss = this.physics.add.image(Phaser.Math.Between(9500, 9800), 200, 'boss').setOrigin(0, 1);
        bossSpeed = Phaser.Math.GetSpeed(600, 3);
        speed = bossSpeed;
        // boss music
        var music = this.sound.add('boss_music',{
            loop: true,
            delay: 0,
            volume: 0.2
          });
        music.play();

        // player - objects interaction logics
        player.anims.play('idle_right');
        playerCollider = this.physics.add.collider(player, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);
        this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);

        playerBossOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        playerNukesOverlap = this.physics.add.overlap(player, nukes, this.takeDmg, null, this);

        bossText = this.add.text(1200, 40, 'Boss HP: ' + bossHP, { fontSize: '32px', fill: '#4314B0' });
        console.log("everything is created")

        this.cameras.main.setBounds(0, 0, 90000, 1000);
        this.cameras.main.startFollow(player);
    }
}

class Level2 extends CommonScene{
    preload(){
        super.preload();

        this.load.image('boss', 'assets/fork.png');
        this.load.image('leek_nuke', 'assets/leek_bullet.png')
        // load bg and platform
        this.load.image('background', 'assets/bg.png');
        this.load.image('platform', 'assets/ground.png');
        this.load.image('big_platform', 'assets/ground2.png');

        // we can initiate the variables for the specific boss info here
        // based on the level design
        hp = 3;
    }
    create(){
        // background
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        super.create();

        // level specified platforms
        platforms.create(0, 100, "platform").setOrigin(0, 0).refreshBody();

        // boss platform
        platforms.create(997, 450, "big_platform").setOrigin(0, 0).refreshBody();
        platforms.create(0, 450, "big_platform").setOrigin(0, 0).refreshBody();

        // make entities
        boss = this.physics.add.image(Phaser.Math.Between(500, 800), 200, 'boss').setOrigin(0, 1);
        bossSpeed = Phaser.Math.GetSpeed(600, 3);
        speed = bossSpeed;

        // music
        var music = this.sound.add('boss_music',{
            loop: true,
            delay: 0,
            volume: 0.2
          });
        music.play();

        // player - objects interaction logics
        player.anims.play('idle_right');
        playerCollider = this.physics.add.collider(player, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);
        this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);

        playerBossOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        playerNukesOverlap = this.physics.add.overlap(player, nukes, this.takeDmg, null, this);

        bossText = this.add.text(1200, 40, 'Boss HP: ' + bossHP, { fontSize: '32px', fill: '#4314B0' });
    }
}


class MainMenu extends Phaser.Scene {
    preload(){
        this.load.image('background', 'assets/bg.png');
    }
    create(){
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        const clickButton1 = this.add.text(250, 100, 'Start the Level1!',
            {fontSize: '50px', fill: '#888'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked1());
        const clickButton2 = this.add.text(250, 300, 'Start the Level2!',
            {fontSize: '50px', fill: '#888'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked2());
    }
    onClicked1(){
        this.scene.add('Level1', Level1, true);
        //this.scene.start('Level1');
    }
    onClicked2(){
        this.scene.add('Level2', Level2, true);
        //this.scene.start('Level2');
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
    scene: [MainMenu]
  };


var game = new Phaser.Game(config);

// var config = {
//     type: Phaser.AUTO,
//     width: 900,
//     height: 600,
//     backgroundColor: "#5D0505",
//     physics: {
//           default: 'arcade',
//           arcade: {
//               gravity: { y: 500 },
//               debug: false
//           }
//       },
//     scene: [Level2]
//   };


// var game = new Phaser.Game(config);
