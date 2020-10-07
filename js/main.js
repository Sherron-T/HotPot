// scene variables
var platforms;

// player variables
var control;
var player;
var cursors;
var keyZ;
var hearts;
var facing_left = false;
var can_shoot = true;
var speed;
var vulTimer;
var invul = false;
var score = 0;
var bullet_gone;

// gun variables
var bullets;
var gun_sound;

// small enemy variables
var enemies;

// boss variables
var boss;
var bossText;
var bossStop = false;
var bossSpeed;
var bossSpecial = true;
var nukes;

// condition variables
var playerCollider;
var enemyCollider;
var bossCollider;
var timedEvent;
var playerBossOverlap;
var playerNukesOverlap;
// Math.round(Math.random())

//MODIFIABLE VARIABLES
// player variables
var hp = 3;
var invulDuration = 3000;
// speed for player
//var horizontalSpeed = 160; // Real speed
var horizontalSpeed = 300; // Test speed
var verticalJump = 300;

// gun variables
var gunSpeed = 300;
var gunVelocity = 1000;
var bulletTime = 500; //Increase to adjust bullet distance

// boss variables
const boss1HP = 3;
const boss2HP = 3;
var bossHP = 3;
var bossLow = 1;
var bossStopDuration = 800;
var bossLeftBound = 9100;
var bossRightBound = 10000;
var bossScore = 233;
var bornL = 9500;
var bornR = 9800;

// level varables
var winLevel1 = false;
var winLevel2 = false;
var scene1;
var scene2;
var clickButton1;
var clickButton2;
var mainButton;
var lock2;
var endText;
var summary;
var lastIndex;


class CommonScene extends Phaser.Scene{
    preload(){
        // common for all levels
        this.load.image('heart', 'assets/heart.png')
        this.load.spritesheet('pork', 'assets/pork.png', {frameWidth : 100, frameHeight : 78});
        this.load.audio('boss_music', 'assets/boss.wav')
        this.load.audio('main_music', 'assets/main_music.wav')
        this.load.audio('gun_sound', 'assets/gun_sound.wav')
        this.load.image('rice', 'assets/rice.png')
        this.load.image('scoreBoard', 'assets/scoreboard.png')
        this.load.image('back', 'assets/back.png');
        this.restart();
    }
    create(){
        // music settings
        gun_sound = this.sound.add('gun_sound',{
          volume: 0.2
        });

        // variable for all platforms
        platforms = this.physics.add.staticGroup();

        // block edges of the level
        platforms.create(0, 0, "back").setOrigin(1, 0).refreshBody();
        platforms.create(10500, 0, "back").setOrigin(0, 0).refreshBody();

        // boss platform
        platforms.create(9997, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(9000, 900, "platform").setOrigin(0, 0).refreshBody();

        // variable for small enemies
        enemies = this.physics.add.group();

        // create main char
        control = true;
        player = this.physics.add.sprite(50, 50, 'pork');
        player.setBounce(0);
        player.setCollideWorldBounds(false);
        player.body.width = 60;
        player.body.offset.x = 20;
        console.log("player loaded")

        this.cameras.main.setBounds(0, 0, 10500, 1000);
        this.cameras.main.startFollow(player);

        // boss HP text
        bossText = this.add.text(lastIndex+1200, 40, 'Boss HP: ' + bossHP, { fontSize: '32px', fill: '#4314B0' });

        // weapons
        bullets = this.physics.add.group({
            allowGravity: false
        });

        // lives for player
        hearts = this.physics.add.staticGroup({
            key: 'heart',
            frameQuantity: hp,
            setXY: {x: 50, y: 50, stepX: 50}
        });
        // make heart follow camera
        var heart = hearts.getChildren();
        var x;
        for(x of heart){
            x.setScrollFactor(0, 0)
        };

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

        // controls for the player
        if(control == true){
            if (cursors.space.isDown && can_shoot == true){
                can_shoot = false;
                gun_sound.play();
                if(facing_left == true){
                var b = bullets.create(player.x-20, player.y+5, 'rice');
                if(cursors.left.isDown){
                    player.anims.play('gun_move_left', true);
                }
                else{
                    player.anims.play('gun_left');
                }
                b.setVelocityX(-1*gunVelocity);
                }
                else{
                var b = bullets.create(player.x+20, player.y+5, 'rice');
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
                bullet_gone = this.time.delayedCall(bulletTime, this.bullet_dissapear, [b], this);
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
        }
        // when player fall out of world
        if(player.y >= 1000){
            hp = 0;
        }
        // when player dies
        if(hp == 0){
            hearts.getChildren().map(child => child.destroy());
            player.anims.play('turn');
            this.physics.world.removeCollider(playerCollider);
            player.setCollideWorldBounds(false);
            this.summary("LOST", 0);
            control = false;
            player.setVelocityX(0);
            return;
        }

        // when boss dies
        if(bossHP == 0){
            this.physics.world.removeCollider(bossCollider);
            this.physics.world.removeCollider(playerBossOverlap);
            this.physics.world.removeCollider(playerNukesOverlap);
            boss.setCollideWorldBounds(false);
            this.summary("WON", bossScore);
            control = false;
            player.setVelocityX(0);
            return;
        }
    }
    bossHurt(boss, bullet){
        //bullet.disableBody(true, true);
        bullet.destroy();
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
    // shows player how they did after kill boss/ death
    summary(text, add){
        // endText = this.add.text(600, 500, "YOU WIN", { fontSize: '60px', fill: '#C45827' });
        this.add.image(player.x-150, 40, 'scoreBoard').setOrigin(0, 0);
        endText = this.add.text(player.x-20, 75, "YOU "+text, { fontSize: '60px', fill: '#290048' });
        summary = this.add.text(player.x, 420, "Score: "+(score+add), { fontSize: '50px', fill: '#290048' });
        mainButton = this.add.text(player.x-20, 770, 'Back to Menu',
            {fontSize: '40px', fill: '#F5ED00'}).
            setInteractive().on('pointerdown',
            ()=>this.backToMenu());
    }
    backToMenu(){
        this.scene.start('MainMenu');
        mainButton.disableInteractive();
        clickButton1.setInteractive();
        clickButton2.setInteractive();
        this.registry.destroy();
        this.events.off();
        console.log("back")
    }
    restart(){
        score = 0;
        hp = 3;
        if(boss) boss.destroy();
        if(platforms) platforms.destroy();
        if(player) player.destroy();
        if(endText) endText.setVisible(false);
        if(summary) summary.setVisible(false);
        console.log("restart");
    }
    bullet_dissapear(b){
      b.destroy();
    }
}

class Level1 extends CommonScene{
    preload(){
        super.preload();

        this.load.image('leek', 'assets/leek.png');
        this.load.image('leek_nuke', 'assets/leek_bullet.png')
        // load bg and platform
        this.load.image('level1bg', 'assets/level1bg.png');
        this.load.image('background', 'assets/bg.png');
        this.load.image('platform', 'assets/ground.png');
        this.load.image('big_platform', 'assets/ground2.png');

        // we can initiate the variables for the specific boss info here
        // based on the level design
        hp = 3;
        bossHP = boss1HP;
        bornL = 9500;
        bornR = 9600;
        bossLeftBound = bornL - 200;
        bossRightBound = bornR + 300;
        lastIndex = 9000;
    }
    create(){
        // background
        this.add.image(0, 0, 'level1bg').setOrigin(0, 0);

        // boss bg
        this.add.image(9000, 0, 'background').setOrigin(0, 0);

        super.create();

        // make platforms
        platforms.create(-700, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(100, 950, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();

        platforms.create(500, 800, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();

        platforms.create(2000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(3000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(4000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(5000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(6000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(7000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(8000, 900, "platform").setOrigin(0, 0).refreshBody();


        // make small enemies
        enemies.create(250, 950, "leek").setOrigin(0, 1).setScale(0.15).refreshBody();

        enemies.create(600, 800, "leek").setOrigin(0, 1).setScale(0.15).refreshBody();

        enemies.create(100, 800, "leek").setOrigin(0, 1).setScale(0.15).refreshBody();
        enemies.create(100, 800, "leek").setOrigin(0, 1).setScale(0.15).refreshBody();
        enemies.create(100, 800, "leek").setOrigin(0, 1).setScale(0.15).refreshBody();
        enemies.create(100, 800, "leek").setOrigin(0, 1).setScale(0.15).refreshBody();
        enemies.create(100, 800, "leek").setOrigin(0, 1).setScale(0.15).refreshBody();
        enemies.create(100, 800, "leek").setOrigin(0, 1).setScale(0.15).refreshBody();
        enemies.create(100, 800, "leek").setOrigin(0, 1).setScale(0.15).refreshBody();
        enemies.create(100, 800, "leek").setOrigin(0, 1).setScale(0.15).refreshBody();

        // play level music
        // should be conditional for when player approaches boss room

        // make boss
        boss = this.physics.add.image(Phaser.Math.Between(bornL, bornR), 200, 'leek').setOrigin(0, 1);
        boss.body.width = 115;
        boss.body.offset.x = 30;
        bossSpeed = Phaser.Math.GetSpeed(600, 3);
        speed = bossSpeed;
        // boss music
        var music = this.sound.add('main_music',{
            loop: true,
            delay: 0,
            volume: 1
          });
        music.play();
        // boss attacks
        nukes = this.physics.add.group({});

        // player - objects interaction logics
        player.anims.play('idle_right');
        playerCollider = this.physics.add.collider(player, platforms);
        enemyCollider = this.physics.add.collider(enemies, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);
        this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);

        playerBossOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        playerNukesOverlap = this.physics.add.overlap(player, nukes, this.takeDmg, null, this);


        // bossText.setScrollFactor(0, 0)
    }
    update(time, delta){
        if(bossHP == 0) winLevel1 = true;
        super.update(time, delta);

        boss.x += speed * delta;
        if(boss.x >= bossRightBound && !bossStop){
            speed = 0;
            bossStop = true;
            this.time.addEvent({ delay: bossStopDuration, callback: this.moveStop, callbackScope: this});
        }
        if(boss.x <= bossLeftBound && !bossStop){
            speed = 0;
            bossStop = true;
            this.time.addEvent({ delay: bossStopDuration, callback: this.moveStop, callbackScope: this});
        }
        if(bossHP > 0 && bossHP < bossLow && bossSpecial == true){
          bossSpecial = false;
          var i;
          var leek_nuke = nukes.create(player.x, Math.floor(Math.random() * (0 - -700) + -700), 'leek_nuke')
          for (i = 0; i < 3; i++) {
            var leek_nuke = nukes.create(player.x + Math.floor(Math.random() * (300 - -300) + -300), Math.floor(Math.random() * (0 - -700) + -700), 'leek_nuke')
          }
          this.time.addEvent({ delay: 2000, callback: this.enableSpecial, callbackScope: this});
        }
    }
}

class Level2 extends CommonScene{
    preload(){
        super.preload();

        this.load.image('boss', 'assets/fork.png');
        this.load.image('leek_nuke', 'assets/leek_bullet.png')
        // load bg and platform
        this.load.image('level2bg', 'assets/level1bg.png');
        this.load.image('background', 'assets/bg.png');
        this.load.image('platform', 'assets/ground.png');
        this.load.image('big_platform', 'assets/ground2.png');

        // we can initiate the variables for the specific boss info here
        // based on the level design
        hp = 3;
        bossHP = boss2HP;
        bornL = 9500;
        bornR = 9600;
        bossLeftBound = bornL - 200;
        bossRightBound = bornR + 300;
        lastIndex = 9000;
    }
    create(){
        // background
        this.add.image(0, 0, 'level2bg').setOrigin(0, 0);

        // boss bg
        this.add.image(9000, 0, 'background').setOrigin(0, 0);

        super.create();

        // level specified platforms
        platforms.create(-700, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(100, 950, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();

        platforms.create(500, 800, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();

        platforms.create(2000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(3000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(4000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(5000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(6000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(7000, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(8000, 900, "platform").setOrigin(0, 0).refreshBody();



        // make entities
        boss = this.physics.add.image(Phaser.Math.Between(bornL, bornR), 200, 'boss').setOrigin(0, 1);
        bossSpeed = Phaser.Math.GetSpeed(600, 3);
        boss.setScale(2);
        speed = bossSpeed;

        // music

        nukes = this.physics.add.group({});

        // player - objects interaction logics
        player.anims.play('idle_right');
        playerCollider = this.physics.add.collider(player, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);
        this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);

        playerBossOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        playerNukesOverlap = this.physics.add.overlap(player, nukes, this.takeDmg, null, this);
    }
    update(time, delta){
        if(bossHP == 0) winLevel2 = true;
        super.update(time, delta);

        boss.x += speed * delta;
        if(boss.x >= bossRightBound && !bossStop){
            speed = 0;
            bossStop = true;
            this.time.addEvent({ delay: bossStopDuration, callback: this.moveStop, callbackScope: this});
        }
        if(boss.x <= bossLeftBound && !bossStop){
            speed = 0;
            bossStop = true;
            this.time.addEvent({ delay: bossStopDuration, callback: this.moveStop, callbackScope: this});
        }
    }
}


class MainMenu extends Phaser.Scene {
    preload(){
        this.load.image('background', 'assets/bg.png');
        this.load.image('lock', 'assets/lock.png');
        this.load.image('title', 'assets/title.png');
    }
    create(){
        this.add.image(0, 0, 'title').setOrigin(0, 0);
        clickButton1 = this.add.text(450, 600, 'Start the Level1!',
            {fontSize: '50px', fill: '#888'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked1());
        clickButton2 = this.add.text(450, 750, 'Start the Level2!',
            {fontSize: '50px', fill: '#888'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked2());
         lock2 = this.physics.add.staticImage(420, 775, 'lock');
    }
    update(){
        // comment out this snippet if you want to visit level2
        // without completing level1

        // if(!winLevel1){
        //     clickButton2.disableInteractive();
        // }else{
        //     clickButton2.setInteractive();
        //     lock2.destroy();
        // }

    }
    onClicked1(){
        this.scene.remove('Level1');
        scene1 = this.scene.add('Level1', Level1, true);
        clickButton1.disableInteractive();
        clickButton2.disableInteractive();
        // clickButton2.setInteractive();
        //this.scene.start('Level1');
    }
    onClicked2(){
        this.scene.remove('Level2');
        scene2 = this.scene.add('Level2', Level2, true);
        clickButton1.disableInteractive();
        clickButton2.disableInteractive();
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
