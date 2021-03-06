// scene variables
var platforms;
var mvPlatforms;
var movingPlatforms;
var mvPlatformsCollider;
var locked = false;
var lockedTarget;
var collectHeart;

// player variables
var control;
var player;
var playBornX = 50;
var playBornY = 50;
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
var scoreText;
var scoreTextScore;

// gun variables
var bullets;
var gun_sound;

// small enemy variables
var enemies;
var mvEnem = [];
var i = 0;

//ingredient VARIABLES
var inEnem = [];
var z = 0;

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
var bulletPlatformOverlap;
var playerBossOverlap;
var playerNukesOverlap;
var bulletBossOverlap;
var bulletEnemOverlap;
var playerEnemOverlap;
var platformNukesOverlap;
var platformSpeed = Phaser.Math.GetSpeed(400, 3);
var pSpeed;
var movingPlatformDict = {};
var enemyHPcount = 0;
// Math.round(Math.random())

//MODIFIABLE VARIABLES
// player variables
var hp = 3;
var setPlayerHP = 3;
var invulDuration = 3000;
// speed for player
//var horizontalSpeed = 160; // Real speed
var horizontalSpeed = 300;
var testSpeed = 1000;// Test speed
var verticalJump = 600;

// gun variables
var gunSpeed = 300;
var gunVelocity = 1000;
var bulletTime = 500; //Increase to adjust bullet distance

// boss variables
const boss1HP = 20;
const boss2HP = 30;
const finalBossHP = 40;
var bossHP = 3;
var bossLow = 10;
var bossStopDuration = 800;
var bossLeftBound = 9100;
var bossRightBound = 10000;
var bossScore = 300;
var bornL = 9500;
var bornR = 9550;
var bossBar;
var bgBar;
var bossHpText;
var setValue;
// var bossbullet;

// heart stuff
var heartPlayerCollider

//Boss 2
var tintCharge;
var boss_facing_left = false;
var boss_facing_right = true;
var can_shoot_2 = true;
var bossSpecial2 = true;
var chargeCooldown = 5000; //ms

//Final level variable
var madeFish1 = false;
var madeOcto1 = false;
var madeFish2 = false;
var madeOcto2 = false;
var madeMP1 = false;
var madeEnemyFalls1 = false;
var can_shoot_3 = true;
var canStab = true;
var madeBack = false;
var stabAttack;

// level varables
var winLevel1 = false;
var winLevel2 = false;
var winEndStory = false;
var scene1;
var scene2;
var clickButton1;
var clickButton2;
var clickButtonEnd;
var mainButton;
var retryButton
var lock2;
var endText;
var summary;
var lastIndex;

// main menu
var diffulculty1;
var diffulculty2;
var diffulculty3;
var diffulcultyList;

// tutorial
var tutorialTextColor = "#034680";
var clickButtonBegin;
var clickInstruction;
var hurtText;
var bossTutorialText;
var enemyTutorialText;
var tutorialScene;

//dialogue vars
var dialogue;
var enter;
var stop1 = true;
var dialogue1x = 50;
var stop2 = true;
var dialogue2x = 50;
var stop3 = true;
var dialogue3x = 800;
var stop4 = true;
var dialogue4x = 1000;
var stop5 = true;
var dialogue5x = 1005;
var stop6 = true;
var dialogue6x = 1500;
var stop7 = true;
var dialogue7x = 2500;
var stop8 = true;
var dialogue8x = 2505;


// instruction
var clickStart;


//Music
var isMusicOn = false;
var isBossMusicOn = false;
var main_music;
var lvl2music;
var boss_music;
var jump_sound;
var hurt_sound;

//Alive/dead
var win = false;
var dead = false;


class CommonScene extends Phaser.Scene{
    preload(){
        // common for all levels
        this.load.image('heart', 'assets/player/heart.png')
        this.load.spritesheet('pork', 'assets/player/pork.png', {frameWidth : 100, frameHeight : 78});
        this.load.audio('gun_sound', 'assets/sfx/gun_sound.wav')
        this.load.image('rice', 'assets/player/rice.png')
        this.load.audio('jump_sound', 'assets/sfx/jump.mp3')
        this.load.audio('hurt_sound', 'assets/sfx/hurt.mp3')
        this.load.image('scoreBoard', 'assets/scoreboard.png')
        this.load.image('backmenu', 'assets/menu/backmenu.png')
        this.load.image('retry', 'assets/menu/retry.png')
        this.load.image('back', 'assets/ground/back.png');
        this.load.audio('click_sfx', 'assets/sfx/button.mp3');
        this.load.spritesheet('fork', 'assets/moving_ingredient/fork.png', {frameWidth : 68, frameHeight : 158});
        this.load.spritesheet('knife', 'assets/moving_ingredient/knife.png', {frameWidth : 64, frameHeight : 155});
        this.restart();
    }
    create(){
        // music settings
        gun_sound = this.sound.add('gun_sound',{
          volume: 0.2
        });
        jump_sound = this.sound.add('jump_sound',{
          volume: 1
        });
        hurt_sound = this.sound.add('hurt_sound',{
          volume: 1
        });

        // variable for all platforms
        platforms = this.physics.add.staticGroup();
        mvPlatforms = this.physics.add.staticGroup();

        // moving platforms
        // movingPlatforms = this.physics.add.image();
        locked = false;

        // starting platform
        platforms.create(-700, 900, "platform").setOrigin(0, 0).refreshBody();

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
        player = this.physics.add.sprite(playBornX, playBornY, 'pork');
        player.setBounce(0);
        player.setCollideWorldBounds(false);
        player.body.width = 60;
        player.body.offset.x = 20;

        this.cameras.main.fadeIn(700, 0, 0, 0);
        this.cameras.main.setBounds(0, 0, 10500, 1000);
        this.cameras.main.startFollow(player);

        // weapons
        bullets = this.physics.add.group({
            allowGravity: false
        });

        // collecting heart
        collectHeart = this.physics.add.image(8500, 0, 'heart');
        // collectHeart.create(8500, 0, 'heart');
        // collectHeart.create(Phaser.Math.Between(bornL-200, bornR+200), 0, 'heart');
        // collectHeart.create(Phaser.Math.Between(bornL-200, bornR+200), 0, 'heart');
        this.physics.add.collider(platforms, collectHeart);
        heartPlayerCollider = this.physics.add.overlap(player, collectHeart, this.heal, null, this);

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

        // lives for player
        // hearts = this.physics.add.staticGroup({
        //     key: 'heart',
        //     frameQuantity: hp,
        //     setXY: {x: 50, y: 50, stepX: 50}
        // });
        // // make heart follow camera
        // var heart = hearts.getChildren();
        // var x;
        // for(x of heart){
        //     x.setScrollFactor(0, 0);
        // };
    }
    update(time, delta){
        cursors = this.input.keyboard.createCursorKeys();
        keyZ = this.input.keyboard.addKey("z");

        // score
        this.updateScore()

        // when boss dies
        if(bossHP == 0){
            if(win == false)
            {
              this.physics.world.removeCollider(bossCollider);
              this.physics.world.removeCollider(playerBossOverlap);
              this.physics.world.removeCollider(playerNukesOverlap);
              this.physics.world.removeCollider(playerEnemOverlap);
              boss.setCollideWorldBounds(false);
              score += 300;
              if(scoreTextScore) scoreTextScore.destroy();
              scoreTextScore = this.add.text(1390, 30, score, {fontSize: '23px', fill: '#290048'});
              this.summary("WON", bossScore);
              control = false;
              player.setVelocityX(0);
              win = true;
              return;
            }
            win = true;
            return
         }

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
                jump_sound.play();
            }
        }
        // when player fall out of world
        if(player.y >= 1000){
            hp = 0;
        }
        // when player dies
        if(hp == 0){
            if(dead == false)
            {
              hearts.getChildren().map(child => hearts.killAndHide(child));
              // hearts.killAndHide(heart[hp]);
              // heart[hp].body.enable = false;
              player.anims.play('turn');
              this.physics.world.removeCollider(playerCollider);
              player.setCollideWorldBounds(false);
              this.summary("LOST", 0);
              control = false;
              player.setVelocityX(0);
              dead = true;
              return;
            }
            dead = true;
            return
        }

        // moving with mvPlatforms
        for(var center in movingPlatformDict){
            var movingP = movingPlatformDict[center];
            movingP.x += pSpeed * delta;
            movingP.refreshBody();
            if(movingP.x >= parseInt(center)+200){
                pSpeed = -platformSpeed;
            }
            if(movingP.x <= parseInt(center)-200){
                pSpeed = platformSpeed;
            }
        }
        mvPlatformsCollider = this.physics.add.collider(player, mvPlatforms, this.mvPlatformCollided, null, this)
        if (locked) {
            if (player.x < lockedTarget.body.left || player.x > lockedTarget.body.right || !player.body.onFloor()) {
                locked = false;
                lockedTarget = null;
            } else if(player.body.onFloor() && mvPlatformsCollider){
                player.x += pSpeed * delta;
                // player.y += pSpeedY;
            }
        }

    }
    bossHurt(boss, bullet){
        //bullet.disableBody(true, true);
        bullet.destroy();
        bossHP = bossHP == 0 ? 0 : bossHP - 1;
        this.setValue(bossBar, bossHP)
    }
    setValue(bar, percent){
    }
    enemyHurt(enemy, bullet){
        //bullet.disableBody(true, true);
        bullet.destroy();
        if(Math.round(Math.random()) == 0 || enemyHPcount >= 2){
            enemy.destroy();
            // score += Math.floor(Math.random() * 20); // making hotpot needs luck, so the score is also by luck
            score += 10;
            enemyHPcount = 0;
        }else{
            enemyHPcount += 1
        }
    }
    set_shoot(){
        can_shoot = true;
    }
    takeDmg(player){
        if(invul == false){
            hurt_sound.play();
            player.setTint(0xB5F2F2);
            invul = true;
            // console.log("damage");
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
        this.enable_music();
        // this.add.image(player.x-150, 40, 'scoreBoard').setOrigin(0, 0);
        // endText = this.add.text(player.x-20, 75, "YOU "+text, {fontSize: '60px', fill: '#290048'});
        this.add.image(750, 40, 'scoreBoard').setScrollFactor(0).setOrigin(0.5, 0);
        endText = this.add.text(750, 75, "YOU "+text, {fontSize: '60px', fill: '#290048'}).setScrollFactor(0).setOrigin(0.5, 0);
        summary = this.add.text(750, 420, "Score: "+score, {fontSize: '50px', fill: '#290048'}).setScrollFactor(0).setOrigin(0.5, 0);
        mainButton = this.add.image(200,100,'backmenu').
          setInteractive().on('pointerdown',
          ()=>this.backToMenu()).setScrollFactor(0).setOrigin(0.5, 0);
        /*mainButton = this.add.text(750, 770, 'Back to Menu',
            {fontSize: '40px', fill: '#F5ED00'}).
            setInteractive().on('pointerdown',
            ()=>this.backToMenu()).setScrollFactor(0).setOrigin(0.5, 0);*/
        if(text == "LOST")
        {
          retryButton = this.add.image(750,775,'retry').setScale(0.7).
            setInteractive().on('pointerdown',
            ()=>this.retry()).setScrollFactor(0).setOrigin(0.5, 0.5);
          /*retryButton = this.add.text(750, 800, 'Retry',
              {fontSize: '40px', fill: '#F5ED00'}).
              setInteractive().on('pointerdown',
              ()=>this.retry()).setScrollFactor(0).setOrigin(0.5, 0);*/
        }
    }
    backToMenu(){
        this.sound.play('click_sfx');
        this.scene.start('GameMenu');
        mainButton.disableInteractive();
        clickButton1.setInteractive();
        clickButton2.setInteractive();
        this.registry.destroy();
        this.events.off();
        this.enable_music();
    }
    retry(){
        this.sound.play('click_sfx');
        this.scene.restart();
    }
    makeMoveEnemy(i, xPos, yPos, duration, enemyName){
        this.anims.create({
            key: enemyName+'walk',
            frames: this.anims.generateFrameNumbers(enemyName, { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        mvEnem[i] = this.physics.add.sprite(xPos, yPos, enemyName).setOrigin(0, 1).refreshBody().setScale(0.5);
        enemies.add(mvEnem[i]);
        mvEnem[i].anims.play(enemyName+'walk');
        this.tweens.timeline({
            targets: mvEnem[i].body.velocity,
            loop: -1,
            tweens: [
            {x:60, duration:duration, ease:'Stepped'},
            {x:-60, duration:duration, ease:'Stepped'},
        ]});
        i += 1;
    }
    makeIngredient(i, xPos, yPos, enemyName)
    {
      inEnem[z] = enemies.create(xPos,yPos,enemyName).setOrigin(0,1).refreshBody();
      inEnem[z].setBounceY(1);
      z+=1;
    }
    bullet_dissapear(b){
      b.destroy();
    }
    bulletDestroy(platforms,b){
      b.destroy();
    }
    enable_music(){
        if(isBossMusicOn == true)
        {
            isBossMusicOn = false;
            this.tweens.add({
                targets:  boss_music,
                volume:   0,
                duration: 2000
            });
            //boss_music.stop();
            let bossMusicClear = this.time.addEvent({ delay: 4000, callback: function(){boss_music.stop()}, callbackScope: this});
        }
        if(isMusicOn == false)
         {
           isMusicOn = true;
           /*main_music = this.sound.add('main_music',{
                loop: true,
                delay: 0,
                volume: 0
           });*/
           this.tweens.add({
               targets:  main_music,
               volume:   1,
               duration: 7000
           });
           main_music.play();
         }
    }
    mvPlatformCollided(player, mvPlatforms){
        if (!locked) {
            locked = true;
            lockedTarget= mvPlatforms;
        }
    }
    restart(){
        score = 0;
        hp = setPlayerHP;
        movingPlatformDict = {};
        mvEnem = [];
        i = 0;
        playBornX = 50;
        invul = false;
        if(scoreText) scoreText.destroy();
        if(boss) boss.destroy();
        if(enemies) enemies.destroy();
        if(hearts) hearts.destroy();
        if(platforms) platforms.destroy();
        if(mvPlatforms) mvPlatforms.destroy();
        if(player) player.destroy();
        if(endText) endText.setVisible(false);
        if(summary) summary.setVisible(false);
        this.enable_music();
        win = false;
        dead = false;
    }
    start_music(songName){
      this.tweens.add({
          targets:  main_music,
          volume:   0,
          duration: 2000
      });
      this.tweens.add({
          targets:  boss_music,
          volume:   0,
          duration: 2000
      });
      let mainMusicLower = this.time.addEvent({ delay: 1500, callback: function(){
        main_music.stop()
      }, callbackScope: this});
      let mainMusicEnable = this.time.addEvent({ delay: 1500, callback: function(){
        main_music = this.sound.add(songName,{
            loop: true,
            delay: 0,
            volume: 0
       });
       main_music.play();
       this.tweens.add({
           targets:  main_music,
           volume:   0.6,
           duration: 2000
       });
      }, callbackScope: this});
    }
    createHeart(){
        // lives for player
        hearts = this.physics.add.staticGroup({
            key: 'heart',
            frameQuantity: hp,
            setXY: {x: 50, y: 50, stepX: 50}
        });
        // make heart follow camera
        // console.log("CREATE HEART");
        var heart = hearts.getChildren();
        var x;
        for(x of heart){
            x.setScrollFactor(0, 0);
        };
        scoreText = this.add.text(1300, 30, "Score: ", {fontSize: '23px', fill: '#290048'});
        scoreText.setScrollFactor(0, 0);
    }
    updateScore(){
        if(scoreTextScore) scoreTextScore.destroy();
        scoreTextScore = this.add.text(1390, 30, score, {fontSize: '23px', fill: '#290048'});
        scoreTextScore.setScrollFactor(0, 0);
    }
    heal(){
        hp = setPlayerHP;
        var heart = hearts.getChildren();
        for(var i = 0; i < hp; i ++){
            hearts.killAndHide(heart[i]);
            heart[i].body.enable = false;
        }
        this.createHeart();
        collectHeart.destroy();
    }
}

class Level1 extends CommonScene{
    preload(){
        super.preload();

        this.load.image('leek', 'assets/boss_asset/leek.png');
        this.load.image('leek_nuke', 'assets/boss_asset/leek_bullet.png')
        // load bg and platform
        this.load.image('level1bg', 'assets/background/level1bg.png');
        this.load.image('background', 'assets/background/background/bg.png');
        this.load.image('platform', 'assets/ground/ground.png');
        this.load.image('big_platform', 'assets/ground/ground2.png');
        this.load.spritesheet('introbg', 'assets/background/bg-sheet-small.png', {frameWidth : 1470, frameHeight : 1000});
        this.load.audio('boss_music', 'assets/music/boss.wav') //Boss Music
        // this.load.spritesheet('fork', 'assets/moving_ingredient/fork.png', {frameWidth : 68, frameHeight : 158});
        // we can initiate the variables for the specific boss info here
        // based on the level design
        hp = setPlayerHP;
        bossHP = boss1HP;
        bornL = 9500;
        bornR = 9600;
        bossLeftBound = bornL - 300;
        bossRightBound = bornR + 350;
        lastIndex = 9000;
        pSpeed = platformSpeed;
        // for testing
        // hp = 30;
        //playBornX = 8300;
        //horizontalSpeed = testSpeed;
    }
    create(){
        // background
        this.add.image(0, 0, 'level1bg').setOrigin(0, 0);

        //Animated bg
        this.anims.create({
            key: 'boil',
            frames: this.anims.generateFrameNumbers('introbg', { start: 0, end: 6 }),
            frameRate: 2,
            repeat: -1
        });
        this.add.sprite(0,0,'introbg').setOrigin(0, 0).setScale(1.1).anims.play('boil').setScrollFactor(0, 0);
        // boss bg
        this.add.image(9000, 0, 'background').setOrigin(0, 0);
        //this.add.sprite(1470,0,'introbg').setOrigin(0, 0).anims.play('boil');
        super.create();

        // first 2 platforms
        platforms.create(500, 800, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        var mp1 = mvPlatforms.create(300, 900, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        movingPlatformDict[300] = mp1;

        //this.makeMoveEnemy(i, 100, 900, 2500, 'fork');

        this.makeMoveEnemy(i, 500, 800, 2500, 'fork');

        // little cave place
        platforms.create(1100, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(1100, 750, "platform").setScale(0.5).setOrigin(0, 0).refreshBody();
        platforms.create(900, 0, "back").setScale(0.8).setOrigin(0, 0).refreshBody();
        platforms.create(900, 900, "back").setScale(1).setOrigin(0, 0).refreshBody();
        platforms.create(1700, 0, "back").setScale(0.8).setOrigin(0, 0).refreshBody();
        platforms.create(900, 550, "platform").setOrigin(0, 0).refreshBody();

        this.makeMoveEnemy(i, 1100, 750, 7000, 'fork');
        this.makeMoveEnemy(i, 1200, 900, 6500, 'knife');
        //this.makeMoveEnemy(i, 1200, 900, 10000, 'fork');
        this.makeMoveEnemy(i, 1300, 900, 8000, 'fork');
        //this.makeMoveEnemy(i, 1600, 900, 7500, 'fork');

        // stairs
        platforms.create(2100, 800, "back").setOrigin(0, 0).refreshBody();
        platforms.create(2200, 700, "back").setOrigin(0, 0).refreshBody();
        platforms.create(2300, 600, "back").setOrigin(0, 0).refreshBody();
        platforms.create(2400, 500, "back").setOrigin(0, 0).refreshBody();

        this.makeMoveEnemy(i, 2100, 800, 1000, 'fork');
        this.makeMoveEnemy(i, 2300, 600, 500, 'fork');

        // floating platforms
        platforms.create(2800, 400, "platform").setScale(0.5).setOrigin(0, 0).refreshBody();
        platforms.create(3500, 450, "platform").setScale(0.5).setOrigin(0, 0).refreshBody();
        platforms.create(4200, 350, "platform").setScale(0.5).setOrigin(0, 0).refreshBody();

        this.makeMoveEnemy(i, 2900, 400, 8000, 'fork');
        this.makeMoveEnemy(i, 2900, 400, 6000, 'fork');
        this.makeMoveEnemy(i, 3000, 400, 4000, 'fork');

        this.makeMoveEnemy(i, 3500, 450, 4000, 'knife');
        this.makeMoveEnemy(i, 3500, 450, 5000, 'knife');
        this.makeMoveEnemy(i, 3700, 450, 4500, 'knife');

        this.makeMoveEnemy(i, 4200, 350, 5000, 'fork');
        this.makeMoveEnemy(i, 4300, 350, 4000, 'fork');
        this.makeMoveEnemy(i, 4350, 350, 2020, 'fork');

        // thin pillars
        platforms.create(5200, 600, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(5450, 500, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(5750, 400, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(6150, 300, "back").setScale(0.3).setOrigin(0, 0).refreshBody();

        // platforms
        platforms.create(6500, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(6600, 700, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(7000, 550, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(7400, 700, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(7400, 400, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(7600, 400, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();

        this.makeMoveEnemy(i, 6500, 900, 14000, 'fork');
        this.makeMoveEnemy(i, 75000, 900, 10000, 'knife');
        this.makeMoveEnemy(i, 95000, 900, 5000, 'fork');

        this.makeMoveEnemy(i, 6600, 700, 4000, 'fork');
        this.makeMoveEnemy(i, 7000, 550, 3900, 'fork');
        this.makeMoveEnemy(i, 7400, 700, 4000, 'knife');
        this.makeMoveEnemy(i, 7400, 400, 2000, 'fork');
        this.makeMoveEnemy(i, 7400, 400, 4000, 'fork');
        this.makeMoveEnemy(i, 7500, 400, 1000, 'knife');

        // platform right infront of boss
        platforms.create(8300, 900, "platform").setOrigin(0, 0).refreshBody();


        // play level music
        // should be conditional for when player approaches boss room

        // make boss
        boss = this.physics.add.image(Phaser.Math.Between(bornL, bornR), 200, 'leek').setOrigin(0, 1);
        boss.body.width = 115;
        boss.body.offset.x = 30;
        bossSpeed = Phaser.Math.GetSpeed(600, 3);
        speed = bossSpeed;
        this.tweens.timeline({
            targets: boss.body.velocity,
            loop: -1,
            tweens: [
            {x:259, duration:5000, ease:'Stepped'},
            {x:-250, duration:5000, ease:'Stepped'},
        ]});
        bossSpecial = true;

        //Boss HP Bar
        bgBar = this.add.graphics().setScrollFactor(0).setVisible(false);
        bgBar.fillStyle(0x000000, 1);
        bgBar.fillRect(0,0,610,60);
        bgBar.x = 495;
        bgBar.y = 45;
        bossBar = this.add.graphics().setScrollFactor(0).setVisible(false);
        bossBar.fillStyle(0xFF0000, 1);
        bossBar.fillRect(0,0,600,50);
        bossBar.x = 500;
        bossBar.y = 50;
        bossHpText = this.add.text(750, 50, 'LEEK',
            {fontSize: '50px', fill: '#FFFFFF',}).setScrollFactor(0).setVisible(false);

        this.setValue(bossBar,boss1HP);

        // fork with bosses
        this.makeMoveEnemy(i, 9000, 800, 8000, 'fork');
        this.makeMoveEnemy(i, 9200, 700, 6000, 'fork');
        this.makeMoveEnemy(i, 9500, 800, 4000, 'fork');
        this.makeMoveEnemy(i, 9800, 700, 8000, 'fork');
        this.makeMoveEnemy(i, 9900, 800, 3000, 'fork');

        // boss attacks
        nukes = this.physics.add.group({});

        // player - objects interaction logics
        player.anims.play('idle_right');

        this.createHeart();

        // colliders
        playerCollider = this.physics.add.collider(player, platforms);
        enemyCollider = this.physics.add.collider(enemies, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);

        // overlaps
        bulletPlatformOverlap = this.physics.add.overlap(platforms, bullets, this.bulletDestroy, null, this);
        bulletBossOverlap = this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);
        playerBossOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        bulletEnemOverlap = this.physics.add.overlap(enemies, bullets, this.enemyHurt, null, this);
        playerEnemOverlap = this.physics.add.overlap(player, enemies, this.takeDmg, null, this);
        playerNukesOverlap = this.physics.add.overlap(player, nukes, this.takeDmg, null, this);

        // bossText.setScrollFactor(0, 0)

        //music
        this.start_music('main_music');
    }
    update(time, delta){
        super.update(time, delta);
        if(bossHP == 0) winLevel1 = true;

        /*boss.x += speed * delta;
        if(boss.x >= bossRightBound && !bossStop){
            speed = 0;
            bossStop = true;
            this.time.addEvent({ delay: bossStopDuration, callback: this.moveStop, callbackScope: this});
        }
        if(boss.x <= bossLeftBound && !bossStop){
            speed = 0;
            bossStop = true;
            this.time.addEvent({ delay: bossStopDuration, callback: this.moveStop, callbackScope: this});
        }*/
        if(bossHP > 0 && bossHP < bossLow && bossSpecial == true){
          bossSpecial = false;
          var i;
          var leek_nuke = nukes.create(player.x, Math.floor(Math.random() * (0 - -700) + -700), 'leek_nuke')
          for (i = 0; i < 3; i++) {
            var leek_nuke = nukes.create(player.x + Math.floor(Math.random() * (300 - -300) + -300), Math.floor(Math.random() * (0 - -700) + -700), 'leek_nuke')
          }
          this.time.addEvent({ delay: 2000, callback: this.enableSpecial, callbackScope: this});
        }

        //Enable Boss Music
        if(player.x > 9000 && isBossMusicOn == false && bossHP != 0 && hp > 0)
        {
            bossBar.setVisible(true);
            bgBar.setVisible(true);
            bossHpText.setVisible(true);
            isMusicOn = false;
            this.tweens.add({
                targets:  main_music,
                volume:   0,
                duration: 5000
            });
            isBossMusicOn = true;
            boss_music = this.sound.add('boss_music',{
                loop: true,
                delay: 0,
                volume: 0
           });
           this.tweens.add({
               targets:  boss_music,
               volume:   1,
               duration: 5000
           });
           boss_music.play();
        }
    }
    setValue(bar, percent){
      this.tweens.add({
          targets:  bar,
          scaleX:   percent/boss1HP,
          duration: 500
      });
    }
}

class Level2 extends CommonScene{
    preload(){
        super.preload();
        this.load.spritesheet('introbg2', 'assets/background/bg-sheet-small-2.png', {frameWidth : 1470, frameHeight : 1000});
        // load bg and platform
        this.load.image('level2bg', 'assets/background/level1bg.png');
        this.load.image('background', 'assets/background/bg.png');
        this.load.image('platform', 'assets/ground/ground.png');
        this.load.image('big_platform', 'assets/ground/ground2.png');
        // load ingredients
        this.load.image('fish', 'assets/ingredients/fish.png');
        this.load.image('octopus', 'assets/ingredients/octopus.png');
        this.load.image('beef', 'assets/ingredients/beef.png');
        // this.load.spritesheet('fork', 'assets/moving_ingredient/fork.png', {frameWidth : 68, frameHeight : 158});
        // this.load.spritesheet('knife', 'assets/moving_ingredient/knife.png', {frameWidth : 64, frameHeight : 155});
        // load boss
        this.load.spritesheet('tofu', 'assets/boss_asset/tofu.png', {frameWidth : 112, frameHeight : 147});
        this.load.image('tofu_nuke', 'assets/boss_asset/tofu_bullet.png')
        // load music
        this.load.audio('main_music', 'assets/music/main_music.wav')
        this.load.audio('lvl2music', 'assets/music/lvl2music.wav')
        this.load.audio('boss_music', 'assets/music/boss.wav') //Boss Music
        // we can initiate the variables for the specific boss info here
        // based on the level design
        hp = setPlayerHP;
        bossHP = boss2HP;
        bornL = 10200;
        bornR = 10300;
        lastIndex = 9000;
        pSpeed = platformSpeed;
        can_shoot_2 = true;
        // for testing purposes
        // horizontalSpeed = testSpeed;
        // playBornX = 5300;
    }
    create(){
        // background
        this.add.image(0, 0, 'level2bg').setOrigin(0, 0);
        this.anims.create({
            key: 'boil2',
            frames: this.anims.generateFrameNumbers('introbg2', { start: 0, end: 6 }),
            frameRate: 2,
            repeat: -1
        });
        this.add.sprite(0,0,'introbg2').setOrigin(0, 0).setScale(1.1).anims.play('boil2').setScrollFactor(0, 0);
        // boss bg
        this.add.image(9000, 0, 'background').setOrigin(0, 0);

        super.create();

        // level specified platforms
        var basePlatform = [300, 1800, 3800, 5150, 7000, 8000];
        basePlatform.map(xCord => platforms.create(xCord, 900, "platform").setOrigin(0, 0).refreshBody());

        // part1
        platforms.create(500, 800, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        platforms.create(800, 600, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(1400, 500, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        platforms.create(1500, 800, "back").setScale(0.3).setOrigin(0, 0).refreshBody();

        // part2
        platforms.create(2000, 600, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();

        movingPlatforms = mvPlatforms.create(3200, 900, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();
        movingPlatformDict[3200] = movingPlatforms;

        // part3
        platforms.create(3800, 700, "platform").setScale(0.7).setOrigin(0, 0).refreshBody();

        // part4
        movingPlatforms = mvPlatforms.create(4900, 700, "platform").setScale(0.1).setOrigin(0, 0).refreshBody();
        movingPlatformDict[4900] = movingPlatforms;
        platforms.create(5200, 500, "platform").setScale(0.5).setOrigin(0, 0).refreshBody();
        platforms.create(5800, 300, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(6300, 300, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();

        // part5
        movingPlatforms = mvPlatforms.create(6350, 800, "platform").setScale(0.4).setOrigin(0, 0).refreshBody();
        movingPlatformDict[6350] = movingPlatforms;

        // ingredients
        // enemies.create(250, 900, "fish").setOrigin(0, 1).refreshBody();
        this.makeIngredient(z, 300, 850, 'fish');
        enemies.create(900, 600, "octopus").setOrigin(0, 1).refreshBody();
        this.makeMoveEnemy(i, 600, 700, 3000, 'fork');
        this.makeMoveEnemy(i, 500, 700, 3000, 'fork');

        enemies.create(1400, 500, "beef").setOrigin(0, 1).refreshBody();
        this.makeMoveEnemy(i, 1480, 400, 1000, 'knife');
        // enemies.create(1490, 800, "octopus").setOrigin(0, 1).refreshBody();
        this.makeIngredient(z, 1490, 700, 'octopus');

        enemies.create(2000, 900, "octopus").setOrigin(0, 1).refreshBody();
        // enemies.create(2100, 600, "beef").setOrigin(0, 1).refreshBody();
        this.makeIngredient(z, 2100, 550, 'beef');
        enemies.create(2400, 900, "fish").setOrigin(0, 1).refreshBody();
        this.makeMoveEnemy(i, 2200, 800, 3000, 'fork'); // add more variety of moving enemies

        enemies.create(4000, 700, "beef").setOrigin(0, 1).refreshBody();
        enemies.create(4300, 700, "octopus").setOrigin(0, 1).refreshBody();
        this.makeMoveEnemy(i, 4250, 600, 3000, 'fork');
        // enemies.create(4400, 900, "beef").setOrigin(0, 1).refreshBody();
        this.makeIngredient(z, 4400, 820, 'beef');

        this.makeMoveEnemy(i, 5400, 450, 4000, 'fork');
        var xCord = 5200;
        while(xCord < 6000){
            var randomI = ["octopus", "beef", "fish"];
            var randomE = ['fork', 'knife'];
            // if(Math.random() < 0.5) enemies.create(xCord, 700, randomI[Math.floor(Math.random() * 3)]).setOrigin(0, 1).refreshBody();
            this.makeIngredient(z, xCord+Math.floor(Math.random() * 80), Math.floor(Math.random() * 80)+810, randomI[Math.floor(Math.random() * 3)]);
            xCord += (Math.floor(Math.random() * 100)+50);
            this.makeMoveEnemy(i, xCord, 600, Math.floor(Math.random() * 1000)+Math.floor(Math.random() * 1000)+3000, randomE[Math.floor(Math.random() * 2)]);
        }

        // enemies.create(8500, 700, "beef").setOrigin(0, 1).refreshBody();
        this.makeIngredient(z, 7300, 850, 'beef');
        this.makeIngredient(z, 7800, 800, 'octopus');
        enemies.create(8200, 900, "beef").setOrigin(0, 1).refreshBody();
        this.makeIngredient(z, 8500, 750, 'fish');
        this.makeIngredient(z, 9000, 850, 'octopus');
        this.makeMoveEnemy(i, 7000, 700, 3000, 'knife');
        this.makeMoveEnemy(i, 7200, 700, 5000, 'fork');
        this.makeMoveEnemy(i, 7500, 700, 9000, 'knife');
        this.makeMoveEnemy(i, 9000, 700, 8000, 'fork');


        // make boss
        this.anims.create({
            key: 'bossLeft',
            frames: this.anims.generateFrameNumbers('tofu', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'bossIdleRight',
            frames: [ { key: 'tofu', frame: 7 } ],
            frameRate: 8
        });
        this.anims.create({
            key: 'bossIdleLeft',
            frames: [ { key: 'tofu', frame: 5 } ],
            frameRate: 8
        });
        this.anims.create({
            key: 'bossRight',
            frames: this.anims.generateFrameNumbers('tofu', { start: 7, end: 12 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'bossIdleAttack',
            frames: this.anims.generateFrameNumbers('tofu', { start: 13, end: 17 }),
            frameRate: 4,
            repeat: -1
        });
        //boss = this.physics.add.sprite(Phaser.Math.Between(bornL, bornR), 200, 'tofu');
        boss = this.physics.add.sprite(10400, 200, 'tofu');
        bossSpeed = Phaser.Math.GetSpeed(600, 3);
        //boss.setScale(2);
        speed = bossSpeed;
        // boss movement

        //Boss HP bar
        bgBar = this.add.graphics().setScrollFactor(0).setVisible(false);
        bgBar.fillStyle(0x000000, 1);
        bgBar.fillRect(0,0,610,60);
        bgBar.x = 495;
        bgBar.y = 45;
        bossBar = this.add.graphics().setScrollFactor(0).setVisible(false);
        bossBar.fillStyle(0xFF0000, 1);
        bossBar.fillRect(0,0,600,50);
        bossBar.x = 500;
        bossBar.y = 50;
        bossHpText = this.add.text(750, 50, 'TOFU',
            {fontSize: '50px', fill: '#FFFFFF',}).setScrollFactor(0).setVisible(false);
        bossSpecial2 = true;

        this.setValue(bossBar,boss2HP);
        // music

        nukes = this.physics.add.group({});

        // player - objects interaction logics
        player.anims.play('idle_right');

        this.createHeart();

        // colliders
        playerCollider = this.physics.add.collider(player, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);
        enemyCollider = this.physics.add.collider(enemies, platforms);

        // overlaps
        bulletPlatformOverlap = this.physics.add.overlap(platforms, bullets, this.bulletDestroy, null, this);
        bulletBossOverlap = this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);
        playerBossOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        bulletEnemOverlap = this.physics.add.overlap(enemies, bullets, this.enemyHurt, null, this);
        playerEnemOverlap = this.physics.add.overlap(player, enemies, this.takeDmg, null, this);
        playerNukesOverlap = this.physics.add.overlap(player, nukes, this.takeDmg, null, this);

        //music
        //main_music.removeAll();
        this.start_music('lvl2music');
    }
    update(time, delta){
        if(bossHP == 0) winLevel2 = true;
        super.update(time, delta);

        if(boss.body.velocity.x > 0)
        {
          boss_facing_left = false;
          boss_facing_right = true;
          boss.anims.play('bossRight', true);
        }
        if(boss.body.velocity.x == 0)
        {
          if(boss.x = 10400)
          {
            boss.anims.play('bossIdleAttack',true);
          }
          else if(boss_facing_right == true)
          {
            boss.anims.play('bossIdleLeft');
          }
          else if(boss_facing_left == true)
          {
            boss.anims.play('bossIdleRight');
          }
        }
        if(boss.body.velocity.x < 0)
        {
          boss_facing_left = true;
          boss_facing_right = false;
          boss.anims.play('bossLeft', true);
        }

        if(player.x > 9000 && isBossMusicOn == false && bossHP != 0 && hp > 0)
        {
            bossBar.setVisible(true);
            bgBar.setVisible(true);
            bossHpText.setVisible(true);
            isMusicOn = false;
            this.tweens.add({
                targets:  main_music,
                volume:   0,
                duration: 5000
            });
            isBossMusicOn = true;
            boss_music = this.sound.add('boss_music',{
                loop: true,
                delay: 0,
                volume: 0
           });
           this.tweens.add({
               targets:  boss_music,
               volume:   1,
               duration: 5000
           });
           boss_music.play();
        }

        //Boss Charge
        if(player.x > 9000 && bossHP != 0 && hp >0)
        {
            if(bossSpecial2 == true && bossHP < 20)
            {
              let clearColor = this.time.addEvent({ delay: 2000, callback: function(){this.time.addEvent({
                    delay: 400,                // ms
                    callback: this.tintCharge,
                    callbackScope: this,
                    repeat: 5
                })}, callbackScope: this});
                bossSpecial2 = false;
                let chargeAttack = this.time.addEvent({ delay: 4500, callback: this.charge, callbackScope: this});
            }
            //Regular Projectile
            else if(can_shoot_2 == true && boss.body.velocity.x == 0){
              can_shoot_2 = false;
              let shootAttack = this.time.addEvent({ delay: Phaser.Math.Between(2000, 3500), callback: this.tofuBullet, callbackScope: this});
            }
        }
    }
    setValue(bar, percent){
      this.tweens.add({
          targets:  bar,
          scaleX:   percent/boss2HP,
          duration: 500
      });
    }
    tintCharge(){
      boss.setTint(0x990000);
      let clearColor = this.time.addEvent({ delay: 250, callback: function(){boss.clearTint()}, callbackScope: this});
    }
    charge(){
      this.tweens.timeline({
          targets: boss.body.velocity,
          tweens: [
          {x:-700, duration:2000, ease:'Stepped'},
          //{x:0, duration:500, ease:'Stepped'},
          {x:700, duration:2000, ease:'Stepped'},
          {x:0, duration:Phaser.Math.Between(1000, 3000), ease:'Stepped'},
      ]});
      let changeSpecial = this.time.addEvent({ delay: chargeCooldown, callback: function(){bossSpecial2 = true}, callbackScope: this});
    }
    tofuBullet(){
      if(boss.body.velocity.x == 0)
      {
        var bossplayerangle = Phaser.Math.Angle.Between(boss.x, boss.y, player.x, player.y)

        let tofu_bullet = nukes.create(boss.x, boss.y, 'tofu_nuke');
        tofu_bullet.body.allowGravity = false;
      	tofu_bullet.setVelocityX(900*Math.cos(bossplayerangle));
        tofu_bullet.setVelocityY(900*Math.sin(bossplayerangle));
      }
      can_shoot_2 = true;
    }
}


class EndStory extends CommonScene {
    preload(){
        super.preload();

        this.load.spritesheet('introbg3', 'assets/background/bg-sheet-3.png', {frameWidth : 1470, frameHeight : 1000});
        // load bg and platform
        this.load.image('level3bg', 'assets/background/level1bg.png');
        this.load.image('background', 'assets/background/bg.png');
        this.load.image('platform', 'assets/ground/ground.png');
        this.load.image('big_platform', 'assets/ground/ground2.png');
        // load ingredients
        this.load.image('fish', 'assets/ingredients/fish.png');
        this.load.image('octopus', 'assets/ingredients/octopus.png');
        this.load.image('beef', 'assets/ingredients/beef.png');
        this.load.image('mushroom', 'assets/ingredients/mushroom.png');
        this.load.image('garlic', 'assets/ingredients/garlic.png');
        this.load.image('tofu_nuke', 'assets/boss_asset/tofu_bullet.png');
        // load boss
        this.load.spritesheet('final', 'assets/boss_asset/finalboss.png', {frameWidth : 232, frameHeight : 242});

        // load music
        this.load.audio('main_music', 'assets/music/main_music.wav')
        this.load.audio('lvl3music', 'assets/music/lvl3music.wav')
        this.load.audio('boss_music', 'assets/music/boss.wav') //Boss Music
        // we can initiate the variables for the specific boss info here
        // based on the level design
        hp = setPlayerHP;
        bossHP = finalBossHP;
        bornL = 10200;
        bornR = 10300;
        lastIndex = 9000;
        pSpeed = platformSpeed;
        // for testing purposes
        // horizontalSpeed = testSpeed;
        // playBornX = 8000;
        // bossHP = 2;
    }
    create(){
        // using level 2 features for now
        // background
        this.add.image(0, 0, 'level3bg').setOrigin(0, 0);
        this.anims.create({
            key: 'boil3',
            frames: this.anims.generateFrameNumbers('introbg3', { start: 0, end: 6 }),
            frameRate: 2,
            //duration: 10000,
            repeat: -1
        });
        this.add.sprite(0,0,'introbg3').setOrigin(0, 0).setScale(1.1).anims.play('boil3').setScrollFactor(0, 0);
        // boss bg
        this.add.image(9000, 0, 'background').setOrigin(0, 0);

        super.create();

        nukes = this.physics.add.group({});

        // level specific platforms
        //this.makeMoveEnemy(i, 0, 850, 5000, 'knife');

        madeFish1 = false;

        platforms.create(500, 750, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        this.makeMoveEnemy(i, 500, 750, 200, 'knife');
        platforms.create(700, 550, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(900, 350, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(1100, 150, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        this.makeMoveEnemy(i, 1100, 150, 100, 'fork');
        platforms.create(1300, -50, "back").setScale(0.3).setOrigin(0, 0).refreshBody();

        platforms.create(1200, 750, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        madeOcto1 = false;
        platforms.create(1400, 650, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(1600, 550, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(1800, 450, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(2200, 350, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(2400, 450, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        this.makeIngredient(z, 2400, 150, 'beef');
        platforms.create(2600, 350, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(2800, 250, "back").setScale(0.3).setOrigin(0, 0).refreshBody();

        platforms.create(3200, 800, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        madeFish2 = false;
        platforms.create(3400, 800, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        this.makeMoveEnemy(i, 3400, 800, 200, 'fork');
        platforms.create(3600, 800, "back").setScale(0.3).setOrigin(0, 0).refreshBody();

        madeMP1 = false;
        madeEnemyFalls1 = false;

        platforms.create(4800, 800, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(5000, 800, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        this.makeIngredient(z, 5000, 150, 'beef');
        platforms.create(5300, 800, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        this.makeIngredient(z, 5300, 350, 'fish');
        platforms.create(5700, 800, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        //this.makeIngredient(z, 5700, 400, 'octopus');
        platforms.create(6100, 800, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        this.makeIngredient(z, 6100, 50, 'octopus');
        platforms.create(6500, 850, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        //this.makeIngredient(z, 6500, 450, 'fish');
        platforms.create(6800, 700, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        this.makeIngredient(z, 6800, 0, 'beef');
        platforms.create(7100, 600, "back").setScale(0.3).setOrigin(0, 0).refreshBody();
        this.makeIngredient(z, 7100, 0, 'fish');

        platforms.create(7400, 400, "back").setScale(0.3).setOrigin(0, 0).refreshBody();

        platforms.create(8000, 900, "platform").setOrigin(0, 0).refreshBody();

        madeOcto2 = false;

        //platforms in boss room
        platforms.create(9300, 700, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        movingPlatforms = mvPlatforms.create(9500, 550, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        movingPlatformDict[9500] = movingPlatforms;
        platforms.create(10200, 700, "platform").setScale(0.2).setOrigin(1, 0).refreshBody();

        // make boss
        this.anims.create({
            key: 'bossIdle',
            frames: [ { key: 'final', frame: 0 } ],
            frameRate: 8
        });
        this.anims.create({
            key: 'stab',
            frames: this.anims.generateFrameNumbers('final', { start: 1, end: 4 }),
            frameRate: 8
        });
        this.anims.create({
            key: 'stabRelease',
            frames: this.anims.generateFrameNumbers('final', { start: 5, end: 6 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'shoot_ready',
            frames: this.anims.generateFrameNumbers('final', { start: 7, end: 8 }),
            frameRate: 8
        });
        this.anims.create({
            key: 'shoot',
            frames: this.anims.generateFrameNumbers('final', { start: 9, end: 10 }),
            frameRate: 8
        });

        //boss = this.physics.add.sprite(Phaser.Math.Between(bornL, bornR), 200, 'tofu');
        boss = this.physics.add.sprite(10000, 400, 'final').setOrigin(0,);
        bossSpeed = Phaser.Math.GetSpeed(600, 3);
        speed = bossSpeed;
        boss.body.setAllowGravity(false);
        boss.body.height = 150;
        boss.body.width = 150;
        boss.body.offset.x = 50;

        //Boss HP bar
        bgBar = this.add.graphics().setScrollFactor(0).setVisible(false);
        bgBar.fillStyle(0x000000, 1);
        bgBar.fillRect(0,0,610,60);
        bgBar.x = 495;
        bgBar.y = 45;
        bossBar = this.add.graphics().setScrollFactor(0).setVisible(false);
        bossBar.fillStyle(0xFF0000, 1);
        bossBar.fillRect(0,0,600,50);
        bossBar.x = 500;
        bossBar.y = 50;
        bossHpText = this.add.text(750, 50, 'HUMAN',
            {fontSize: '50px', fill: '#FFFFFF',}).setScrollFactor(0).setVisible(false);

        this.setValue(bossBar,finalBossHP);

        // reset boss variables
        madeBack = false;
        can_shoot_3 = true;
        canStab = true;

        // player - objects interaction logics
        player.anims.play('idle_right');

        this.createHeart();

        // colliders
        playerCollider = this.physics.add.collider(player, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);
        enemyCollider = this.physics.add.collider(enemies, platforms);

        // overlaps
        bulletPlatformOverlap = this.physics.add.overlap(platforms, bullets, this.bulletDestroy, null, this);
        bulletBossOverlap = this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);
        playerBossOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        bulletEnemOverlap = this.physics.add.overlap(enemies, bullets, this.enemyHurt, null, this);
        playerEnemOverlap = this.physics.add.overlap(player, enemies, this.takeDmg, null, this);
        playerNukesOverlap = this.physics.add.overlap(player, nukes, this.takeDmg, null, this);
        platformNukesOverlap = this.physics.add.overlap(nukes, platforms, this.nukes_disappear, null, this);

        //music
        //main_music.removeAll();
        this.start_music('lvl3music');

    }
    update(time, delta){
        if(bossHP == 0) winEndStory = true;
        super.update(time, delta);
        // boss attacks will attach player to boss
        // the boss can toss player to random places
        // shake screens?
        if (bossHP <= 0){
            stabAttack.destroy();
            // bossbullet.destroy();
            boss.body.setAllowGravity(true);
        }
        // for making ingredients appear
        if(player.x == 300 && !madeFish1){
            this.makeIngredient(z, 400, 200, 'fish');
            madeFish1 = true;
        }else if(player.x == 1250 && !madeOcto1){
            this.makeIngredient(z, 1300, 200, 'octopus');
            madeOcto1 = true;
        }else if(player.x == 3100 && !madeFish2){
            this.makeIngredient(z, 3200, 0, 'octopus');
            madeFish2 = true;
        }else if(player.x == 3600 && !madeMP1){
            movingPlatforms = mvPlatforms.create(4000, 700, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();
            movingPlatformDict[4000] = movingPlatforms;
            madeMP1 = true;
        }else if(player.x == 3800 && !madeEnemyFalls1){
            this.makeIngredient(z, 3800, 200, 'octopus');
            this.makeIngredient(z, 3900, 0, 'fish');
            //this.makeIngredient(z, 4000, -200, 'beef');
            this.makeIngredient(z, 4100, -400, 'fish');
            this.makeIngredient(z, 4200, -800, 'octopus');
            this.makeIngredient(z, 4300, -1200, 'beef');
            madeEnemyFalls1 = true;
        }else if(player.x == 8300 && !madeOcto2){
            this.makeIngredient(z, 8500, 500, 'octopus');
            madeOcto2 = true;
        }

        // place back wall
        if(player.x == 9100 && !madeBack){
            platforms.create(9000, 0, "back").setOrigin(1, 0).refreshBody();
            madeBack = true;
        }
        //boss music
        if(player.x > 9000 && isBossMusicOn == false && bossHP != 0 && hp > 0)
        {
            bossBar.setVisible(true);
            bgBar.setVisible(true);
            bossHpText.setVisible(true);
            isMusicOn = false;
            this.tweens.add({
                targets:  main_music,
                volume:   0,
                duration: 5000
            });
            isBossMusicOn = true;
            boss_music = this.sound.add('boss_music',{
                loop: true,
                delay: 0,
                volume: 0
           });
           this.tweens.add({
               targets:  boss_music,
               volume:   1,
               duration: 5000
           });
           boss_music.play();
        }

        //boss movement
        /*this.tweens.add({
            targets:  boss,
            x:   player.x,
            duration: 500
        });*/
        if(player.x > 9000 && bossHP != 0 && hp >0){
            if(can_shoot_3 == true && canStab != false){
                can_shoot_3 = false;
                boss.anims.play('shoot_ready', true);
                let shootAttack = this.time.addEvent({ delay: 2000, callback: this.shootBullet, callbackScope: this});
            }else if(canStab == true && 0 < bossHP  && bossHP < 30){
                canStab = false;
                boss.anims.play('stab');
                stabAttack = this.time.addEvent({ delay: 4500, callback: this.stab, callbackScope: this});
            }
        }
        //nukes.getChildren().map(nuke => nuke.rotation += Math.floor(Math.random() * 5)*0.01);
    }
    setValue(bar, percent){
        this.tweens.add({
            targets:  bar,
            scaleX:   percent/finalBossHP,
            duration: 500
        });
    }
    shootBullet(){
        var bossplayerangle = Phaser.Math.Angle.Between(boss.x+100, boss.y+200, player.x, player.y)
        var ingres = ['fish', 'octopus', 'beef', 'mushroom', 'garlic', 'tofu_nuke'];
        /*let spawnBullet = this.time.addEvent({ delay: 500, callback: function(){
          }, callbackScope: this});*/
        let bossbullet = nukes.create(boss.x+100, boss.y+200, ingres[Math.floor(Math.random() * 6)]);
        bossbullet.body.allowGravity = false;
        bossbullet.setVelocityX(0);
        bossbullet.setVelocityY(0);
        let moveBullet = this.time.addEvent({ delay: 2000, callback: function(){
            boss.anims.play('shoot', true);
            var bossplayerangle = Phaser.Math.Angle.Between(boss.x+100, boss.y+200, player.x, player.y)
            this.tweens.add({
                targets:  bossbullet.body.velocity,
                x: 500*Math.cos(bossplayerangle),
                duration: 200
            });
            this.tweens.add({
                targets:  bossbullet.body.velocity,
                y: 500*Math.sin(bossplayerangle),
                duration: 200
            });
            this.tweens.add({
                targets:  bossbullet,
                rotation: Math.random() * (70 - 30) + 30,
                duration: 10000
            });
          }, callbackScope: this});
        can_shoot_3 = true;
    }
    nukes_disappear(n){
        if(n.velocity != 0){
            //n.destroy();
        }
      }
    stab(){
        boss.body.height = 190;
        boss.body.width = 50;
        boss.body.offset.x = 80;
        boss.body.offset.y = 55;
        this.tweens.add({
            targets:  boss,
            x:   player.x-120,
            duration: 350
        });
        this.tweens.add({
            targets:  boss,
            y:   player.y-600,
            duration: 350
        });
        let stab = this.time.addEvent({ delay: 700, callback: function(){
            this.tweens.add({
                targets:  boss,
                y: 700,
                //y:   player.y-200,
                duration: 400
            });
        }, callbackScope: this});
        let camerasShake = this.time.addEvent({delay:1100, callback: function(){
          this.cameras.main.shake(200, 0.02);
        }, callbackScope: this});
        let reset = this.time.addEvent({ delay: 1600, callback: function(){
            this.tweens.add({
                targets:  boss,
                y: 400,
                duration: 400
            });
        }, callbackScope: this});
        let resize = this.time.addEvent({ delay: 2200, callback: function(){
            boss.body.height = 150;
            boss.body.width = 150;
            boss.body.offset.x = 50;
            boss.body.offset.y = 0;
        }, callbackScope: this});
        canStab = true;
    }
}


class GameMenu extends Phaser.Scene {
    preload(){
        this.load.image('background', 'assets/background/bg.png');
        this.load.image('lock', 'assets/lock.png');
        this.load.image('title', 'assets/title.png');
        this.load.audio('click_sfx', 'assets/sfx/button.mp3');
        this.load.audio('blip', 'assets/sfx/blip.mp3');
        this.load.image('level1but', 'assets/menu/level1.png');
        this.load.image('level2but', 'assets/menu/level2.png');
        this.load.image('level3but', 'assets/menu/finallevel.png');
        this.load.image('easybut', 'assets/menu/easy.png');
        this.load.image('medbut', 'assets/menu/medium.png');
        this.load.image('hardbut', 'assets/menu/hard.png');
        this.load.image('easybutp', 'assets/menu/easyp.png');
        this.load.image('medbutp', 'assets/menu/mediump.png');
        this.load.image('hardbutp', 'assets/menu/hardp.png');
        this.load.image('difficultybg', 'assets/menu/difficulty.png');
    }
    create(){
        this.add.image(0, 0, 'title').setOrigin(0, 0);
        this.scene.remove('Tutorial');
        /*clickButton1 = this.add.text(500, 600, 'Start the Level1!',
            {fontSize: '50px', fill: '#888'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked1());*/
        var difBG = this.add.image(1250, 145, 'difficultybg').setOrigin(0.5,0.5)
        clickButton1 = this.add.image(750, 600, 'level1but').setOrigin(0.5,0.5).
          setInteractive().on('pointerdown',
          ()=>this.onClicked1());;
        /*clickButton2 = this.add.text(500, 750, 'Start the Level2!',
            {fontSize: '50px', fill: '#888'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked2());*/
        clickButton2 = this.add.image(750, 700, 'level2but').setOrigin(0.5,0.5).
          setInteractive().on('pointerdown',
          ()=>this.onClicked2());;
        /*clickButtonEnd = this.add.text(650, 700, 'THE END',
            {fontSize: '40px', fill: '#888'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked3());*/
        clickButtonEnd = this.add.image(750, 800, 'level3but').setOrigin(0.5,0.5).
          setInteractive().on('pointerdown',
          ()=>this.onClicked3());;
         lock2 = this.physics.add.staticImage(470, 700, 'lock');
        //  lock2 = this.physics.add.staticImage(470, 800, 'lock');

         // maybe have pic/text for these
         /*diffulculty1 = this.add.text(1250, 100, 'EASY',
             {fontSize: '23px', fill: '#888'}).
             setInteractive().on('pointerdown',
             ()=>this.onClickedDifficulty(0));*/
         diffulculty1 = this.add.image(1250, 100, 'easybut').setOrigin(0.5,0.5).
           setInteractive().on('pointerdown',
           ()=>this.onClickedDifficulty(0));
         if(setPlayerHP == 5)
         {
           diffulculty1.setTexture('easybutp');
         }
         /*diffulculty2 = this.add.text(1250, 200, 'MEDIUM',
             {fontSize: '23px', fill: '#888'}).
             setInteractive().on('pointerdown',
             ()=>this.onClickedDifficulty(1));*/
         diffulculty2 = this.add.image(1250, 160, 'medbut').setOrigin(0.5,0.5).
           setInteractive().on('pointerdown',
           ()=>this.onClickedDifficulty(1));
         if(setPlayerHP == 3)
         {
           diffulculty2.setTexture('medbutp');
         }
         /*diffulculty3 = this.add.text(1250, 300, 'HARD',
             {fontSize: '23px', fill: '#888'}).
             setInteractive().on('pointerdown',
             ()=>this.onClickedDifficulty(2));*/
         diffulculty3 = this.add.image(1250, 220, 'hardbut').setOrigin(0.5,0.5).
           setInteractive().on('pointerdown',
           ()=>this.onClickedDifficulty(2));
         if(setPlayerHP == 1)
         {
           diffulculty3.setTexture('hardbutp');
         }
         diffulcultyList = [diffulculty1, diffulculty2, diffulculty3];

         //Clear Boss music
         this.tweens.add({
             targets:  boss_music,
             volume:   0,
             duration: 2000
         });

         this.cameras.main.fadeIn(800, 0, 0, 0);
    }
    update(){
        if(!winLevel1){
           clickButton2.disableInteractive();
        }else{
           clickButton2.setInteractive();
           lock2.destroy();
        }

        // temp
        // winLevel2 = true;
        clickButtonEnd.visible = true;

        if(!winLevel2){
            clickButtonEnd.disableInteractive();
            clickButtonEnd.visible = false;
        }else{
            clickButtonEnd.setInteractive();
            clickButton1.visible = false;
            clickButton2.visible = false;
            clickButtonEnd.visible = true;
        }
    }
    onClicked1(){
        this.scene.remove('Level1');
        this.sound.play('click_sfx');
        clickButton1.setTint(0x990000);
        scene1 = this.scene.add('Level1', Level1, true);
        clickButton1.disableInteractive();
        clickButton2.disableInteractive();
        clickButtonEnd.disableInteractive();
        //this.scene.start('Level1');
    }
    onClicked2(){
        this.scene.remove('Level2');
        this.sound.play('click_sfx');
        clickButton2.setTint(0x990000);
        scene2 = this.scene.add('Level2', Level2, true);
        clickButton1.disableInteractive();
        clickButton2.disableInteractive();
        clickButtonEnd.disableInteractive();
        // clickButton2.setInteractive().off();
        //this.scene.start('Level2');
    }
    onClicked3(){
        this.scene.remove('EndStory');
        this.sound.play('click_sfx');
        clickButtonEnd.setTint(0x990000);
        scene2 = this.scene.add('EndStory', EndStory, true);
        clickButton1.disableInteractive();
        clickButton2.disableInteractive();
        clickButtonEnd.disableInteractive();
        // clickButton2.setInteractive().off();
    }
    onClickedDifficulty(index){
        var tempHPvar = [5, 3, 1];
        var difList = ['easybut','medbut','hardbut']
        this.sound.play('blip', {volume: 0.3});
        setPlayerHP = tempHPvar[index];
        diffulcultyList[index].setTexture(difList[index]+'p');
        for(var i = 0; i < 3; i++){
            if(i != index){
                diffulcultyList[i].setTexture(difList[i]);
            }
        }
    }
}

class MainMenu extends Phaser.Scene {
    preload(){
        this.load.image('background', 'assets/background/bg.png');
        this.load.image('title', 'assets/title.png');
        this.load.audio('main_music', 'assets/music/main_music.wav')
        this.load.image('start', 'assets/menu/start.png')
        this.load.audio('click_sfx', 'assets/sfx/button.mp3');
    }
    create(){
        // this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(0, 0, 'title').setOrigin(0, 0);

        //isMusicOn
        this.enable_music();
        /*clickButtonBegin = this.add.text(400, 600, 'Begin the Game with Tutorial',
            {fontSize: '50px', fill: '#888'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked());*/
        clickButtonBegin = this.add.image(750, 650, 'start').setOrigin(0.5,0.5).
          setInteractive().on('pointerdown',
          ()=>this.onClicked());
        // clickInstruction = this.add.text(400, 600, 'Learn How to Play',
        //     {fontSize: '50px', fill: '#888'}).
        //     setInteractive().on('pointerdown',
        //     ()=>this.instruction());
    }
    // debugSKIP(){
    //     this.scene.add('GameMenu', GameMenu, true);
    //     // mainButton.disableInteractive();
    //     this.scene.remove('MainMenu');
    //     this.registry.destroy();
    //     this.events.off();
    // }
    update(){

    }
    onClicked(){
        this.scene.remove('Tutorial');
        this.sound.play('click_sfx');
        clickButtonBegin.setTint(0x990000);
        // this.scene.remove('Instruction');
        tutorialScene = this.scene.add('Tutorial', Tutorial, true);
        // clickInstruction.disableInteractive();
        clickButtonBegin.disableInteractive();
    }
    // instruction(){
    //     this.scene.remove('Instruction');
    //     this.scene.remove('Tutorial');
    //     this.scene.add('Instruction', Instruction, true);
    //     clickInstruction.disableInteractive();
    //     clickButtonBegin.disableInteractive();
    // }
    enable_music(){
      if(isMusicOn == false)
      {
        main_music = this.sound.add('main_music',{
             loop: true,
             delay: 0,
             volume: 0
        });
        this.tweens.add({
            targets:  main_music,
            volume:   1,
            duration: 2000
        });
        main_music.play();
      }
      isMusicOn = true;
    }
}

class Tutorial extends CommonScene{
    preload(){
        super.preload();

        this.load.image('boss', 'assets/boss_asset/leekdummy.png');
        this.load.image('leek_nuke', 'assets/boss_asset/leek_bullet.png')
        // load bg and platform
        this.load.image('level2bg', 'assets/background/level1bg.png');
        this.load.image('background', 'assets/background/bg.png');
        this.load.image('platform', 'assets/ground/ground.png');
        this.load.image('big_platform', 'assets/ground/ground2.png');
        // load ingredients
        this.load.image('octopus', 'assets/ingredients/octopus.png');
        this.load.image('mushroom', 'assets/ingredients/mushroom.png');
        // tutorial
        this.load.image('controls', 'assets/intro/controls.png')
        this.load.image('intro', 'assets/intro/intro.png')
        this.load.image('directions', 'assets/intro/directions.png')
        this.load.image('hp_dir', 'assets/intro/hp_dir.png')

        this.load.image('startscore', 'assets/menu/startscore.png');

        this.load.image('dialogue1', 'assets/dialogue/dialogue1.png');
        this.load.image('dialogue2', 'assets/dialogue/dialogue2.png');
        this.load.image('dialogue3', 'assets/dialogue/dialogue3.png');
        this.load.image('dialogue4', 'assets/dialogue/dialogue4.png');
        this.load.image('dialogue5', 'assets/dialogue/dialogue5.png');
        this.load.image('dialogue6', 'assets/dialogue/dialogue6.png');
        this.load.image('dialogue7', 'assets/dialogue/dialogue7.png');
        this.load.image('dialogue8', 'assets/dialogue/dialogue8.png');


        this.load.audio('dialoguesfx', 'assets/sfx/dialogue.mp3');
        // we can initiate the variables for the specific boss info here
        // based on the level design
        hp = 5;
        bossHP = 5;
        bornL = 3800;
        bornR = 4200;
        bossLeftBound = bornL - 350;
        bossRightBound = bornR + 350;
        lastIndex = 50;
        pSpeed = platformSpeed;
        // for testing purposes
        // horizontalSpeed = testSpeed;
        playBornX = 50;
        playBornY = 800
    }
    create(){
        //music


        // background
        this.add.image(0, 0, 'level2bg').setOrigin(0, 0);

        // boss bg
        this.add.image(2500, 0, 'background').setOrigin(0, 0);

        super.create();

        this.createHeart();


        /*this.add.text(1000, 200, 'Use Arrow keys to move and space to shoot',
            {fontSize: '30px', fill: '#232',});
        this.add.image(1000, 250, 'controls').setOrigin(0, 0).setScale(0.6);
        this.add.image(2230, 150, 'directions').setOrigin(0, 0).setScale(0.80);
        this.add.image(1750, 0, 'hp_dir').setOrigin(0, 0).setScale(0.7);*/


        // base platforms
        platforms.create(730, 300, "back").setOrigin(0, 0).refreshBody();
        var basePlatform = [300, 1300, 2300, 3300, 4300];
        basePlatform.map(xCord => platforms.create(xCord, 900, "platform").setOrigin(0, 0).refreshBody());
        platforms.create(5000, -500, "back").setScale(4).setOrigin(0, 0).refreshBody();

        // tutorial platforms
        //platforms.create(3200, 800, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        //platforms.create(3350, 650, "platform").setScale(0.17).setOrigin(0, 0).refreshBody();
        var mptur = mvPlatforms.create(100, 700, "platform").setScale(0.1).setOrigin(0, 0).refreshBody();
        movingPlatformDict[300] = mptur;
        platforms.create(400, 500, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        platforms.create(300, 300, "platform").setScale(0.17).setOrigin(0, 0).refreshBody();
        //platforms.create(4200, 400, "platform").setScale(0.17).setOrigin(0, 0).refreshBody();
        platforms.create(3500, 0, "back").setOrigin(0, 0).refreshBody();
        platforms.create(3500, 600, "back").setOrigin(0, 0).refreshBody();
        platforms.create(3500, 800, "back").setOrigin(0, 0).refreshBody();

        // static ingredients
        enemies.create(dialogue4x+600, 800, "octopus").setOrigin(0, 1).refreshBody();
        //enemyTutorialText = this.add.text(3630, 710, 'This is a small ingredients enemy', { fontSize: '18px', fill: tutorialTextColor });
        this.makeIngredient(z, dialogue6x+600, 500, 'mushroom');
        //enemyTutorialText = this.add.text(3990, 430, 'This is another ingredients enemy', { fontSize: '18px', fill: tutorialTextColor });

        // make entities
        boss = this.physics.add.image(3100, 200, 'boss').setOrigin(0, 1);
        boss.body.width = 115;
        //bossSpeed = Phaser.Math.GetSpeed(600, 3);
        boss.setScale(0.3);
        //speed = bossSpeed;
        //bossTutorialText = this.add.text(boss.x, boss.y, 'This is a boss', { fontSize: '18px', fill: tutorialTextColor });

        // music

        nukes = this.physics.add.group({});

        // player - objects interaction logics
        player.anims.play('idle_right');

        // colliders
        playerCollider = this.physics.add.collider(player, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);
        enemyCollider = this.physics.add.collider(enemies, platforms);

        // overlaps
        bulletPlatformOverlap = this.physics.add.overlap(platforms, bullets, this.bulletDestroy, null, this);
        bulletBossOverlap = this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);
        playerBossOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        bulletEnemOverlap = this.physics.add.overlap(enemies, bullets, this.enemyHurt, null, this);
        playerEnemOverlap = this.physics.add.overlap(player, enemies, this.takeDmg, null, this);
        playerNukesOverlap = this.physics.add.overlap(player, nukes, this.takeDmg, null, this);

        this.cameras.main.fadeIn(600, 0, 0, 0);
        this.cameras.main.setBounds(0, 0, 3500, 1000);
        this.cameras.main.startFollow(player);
        enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        bgBar = this.add.graphics().setScrollFactor(0).setVisible(false);
        bgBar.fillStyle(0x000000, 1);
        bgBar.fillRect(0,0,610,60);
        bgBar.x = 495;
        bgBar.y = 45;
        bossBar = this.add.graphics().setScrollFactor(0).setVisible(false);
        bossBar.fillStyle(0xFF0000, 1);
        bossBar.fillRect(0,0,600,50);
        bossBar.x = 500;
        bossBar.y = 50;
        bossHpText = this.add.text(725, 50, 'DUMMY',
            {fontSize: '50px', fill: '#FFFFFF',}).setScrollFactor(0).setVisible(false);
        this.setValue(bossBar,5);
    }
    update(time, delta){
        super.update(time, delta);
        if(player.x > 2500 && bossHP != 0 && hp > 0)
        {
          bossBar.setVisible(true);
          bgBar.setVisible(true);
          bossHpText.setVisible(true);
        }
        /*bossTutorialText.x = boss.x;
        bossTutorialText.y = boss.y-200;

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
        }*/
        //Dialogue
        if(player.x >= dialogue1x && player.x <= dialogue1x+10 && stop1 == true)
        {
            stop1 = this.textDialogue('dialogue1',stop1);
          // var dialogue1 = this.add.text(70, 120, 'In the tutorials, press ENTER to goto the next tutorial!',
          //   {fontSize: '40px', fill: tutorialTextColor})
        }
        if(player.x >= dialogue2x && player.x <= dialogue2x+10 && stop1 == false && stop2 == true)
        {
            stop2 = this.textDialogue('dialogue2', stop2);
        }
        if(player.x >= dialogue3x && player.x <= dialogue3x+10 && stop3 == true)
        {
             stop3 = this.textDialogue('dialogue3', stop3);
        }
        if(player.x >= dialogue4x && player.x <= dialogue4x+10 && stop4 == true)
        {
             stop4 = this.textDialogue('dialogue4', stop4);
        }
        if(player.x >= dialogue5x && player.x <= dialogue5x+10 && stop4 == false && stop5 == true)
        {
             stop5 = this.textDialogue('dialogue5', stop5);
        }
        if(player.x >= dialogue6x && player.x <= dialogue6x+10 && stop6 == true)
        {
             stop6 = this.textDialogue('dialogue6', stop6);
        }
        if(player.x >= dialogue7x && player.x <= dialogue7x+10 && stop7 == true)
        {
             stop7 = this.textDialogue('dialogue7', stop7);
        }
        if(player.x >= dialogue8x && player.x <= dialogue8x+10 && stop7 == false && stop8 == true)
        {
             stop8 = this.textDialogue('dialogue8', stop8);
        }
    }
    // tutorial is always invulnerable
    textDialogue(text_name, stopper)
    {
        if(control == true)
        {
            this.sound.play('dialoguesfx');
            control = false;
            player.setVelocityX(0);
            player.anims.play('idle_right');
            dialogue = this.add.image(750, 200, text_name).setOrigin(0.5, 0.5).setAlpha(0).setScrollFactor(0);
            this.tweens.add({
                targets: dialogue,
                alpha: {from:  0, to: 0.9},
                ease: 'linear',
                duration: 300,
            });
        }
        //if(cursors.space.isDown == true)
        if(Phaser.Input.Keyboard.JustDown(enter))
        {
            stopper = false;
            this.tweens.add({
                targets: dialogue,
                alpha: {from:  0.9, to: 0},
                ease: 'linear',
                duration: 300,
            });
            control = true;
        }
        return stopper;
    }
    setValue(bar, percent){
      this.tweens.add({
          targets:  bar,
          scaleX:   percent/5,
          duration: 500
      });
    }
    takeDmg(player){
        if(invul == false){
            hurt_sound.play();
            player.setTint(0xB5F2F2);
            invul = true;
            //hurtText = this.add.text(player.x, player.y-50, 'hurted', { fontSize: '18px', fill: tutorialTextColor });
            vulTimer = this.time.addEvent({ delay: invulDuration+2000, callback: this.blinking, callbackScope: this});
            hp = 4;
            var heart = hearts.getChildren();
            hearts.killAndHide(heart[hp]);
            heart[hp].body.enable = false;
        }
    }
    blinking(){
        player.clearTint();
        invul = false;
        hp = 5;
    }
    enemyHurt(enemy, bullet){
      bullet.destroy();
      if(Math.round(Math.random()) == 0 || enemyHPcount >= 2){
          enemy.destroy();
          // score += Math.floor(Math.random() * 20); // making hotpot needs luck, so the score is also by luck
          score += 10;
          enemyHPcount = 0;
      }else{
          enemyHPcount += 1
      }
    }
    summary(text, add){
        super.summary(text, add);
        mainButton.destroy();
        mainButton = this.add.image(750,775,'startscore').setScale(0.7).
          setInteractive().on('pointerdown',
          ()=>this.backToMenu()).setScrollFactor(0).setOrigin(0.5, 0.5);
        /*mainButton = this.add.text(750, 770, 'Back to Menu',
            {fontSize: '40px', fill: '#F5ED00'}).
            setInteractive().on('pointerdown',
            ()=>this.backToMenu()).setScrollFactor(0).setOrigin(0.5, 0);
        mainButton.setFont('21px');
        mainButton.setText("Start the Real Adventure");*/
    }
    backToMenu(){
        // this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.sound.play('click_sfx');
        this.scene.add('GameMenu', GameMenu, true);
        mainButton.disableInteractive();
        this.scene.remove('MainMenu');
        this.registry.destroy();
        this.events.off();
        // enable_music();
    }
}

// add literal instructions in this section !!!!
// add some text, pictures, and background stories
// class Instruction extends Phaser.Scene {
//     preload(){
//         this.load.image('InstructionBG', 'assets/background/level1bg.png');
//         this.load.spritesheet('pork', 'assets/player/pork.png', {frameWidth : 100, frameHeight : 78});
//         this.load.image('platform', 'assets/ground/ground.png');
//         this.load.image('back', 'assets/ground/back.png');
//         this.load.image('rice', 'assets/player/rice.png')
        // this.load.image('controls', 'assets/intro/controls.png')
        // this.load.image('intro', 'assets/intro/intro.png')
//     }
//     create(){
//         this.add.image(0, 0, 'InstructionBG').setOrigin(0, 0);
//         platforms = this.physics.add.staticGroup();
//
//         //block
//         platforms.create(0, 0, "back").setOrigin(1, 0).refreshBody();
//         platforms.create(2000, 0, "back").setOrigin(0, 0).refreshBody();
//
//         // stable platforms
//         platforms.create(-700, 900, "platform").setOrigin(0, 0).refreshBody();
//         platforms.create(0, 900, "platform").setOrigin(0, 0).refreshBody();
//         for(var i = 500; i <= 2000; i+=500){
//             platforms.create(i, 900, "platform").setOrigin(0, 0).refreshBody();
//         }
//
//         player = this.physics.add.sprite(500, 800, 'pork');
//         player.setBounce(0);
//         player.setCollideWorldBounds(false);
//         player.body.width = 60;
//         player.body.offset.x = 20;
//
//         // weapons
//         bullets = this.physics.add.group({
//             allowGravity: false
//         });
//
        // this.add.image(90, 175, 'intro').setOrigin(0, 0).setScale(0.80);
        // this.add.text(1000, 200, 'Use Arrow keys to move and space to shoot',
        //     {fontSize: '30px', fill: '#232',});
        // this.add.image(1000, 250, 'controls').setOrigin(0, 0).setScale(0.6);
//
//         clickStart = this.add.text(300, 850, 'Ready to Start Game Tutorial',
//             {fontSize: '30px', fill: '#888'}).
//             setInteractive().on('pointerdown',
//             ()=>this.onClicked());
//
//         this.cameras.main.setBounds(0, 0, 2000, 1000);
//         this.cameras.main.startFollow(player);
//
//         // animations
//          this.anims.create({
//              key: 'left',
//              frames: this.anims.generateFrameNumbers('pork', { start: 0, end: 5 }),
//              frameRate: 10,
//              repeat: -1
//          });
//          this.anims.create({
//              key: 'turn',
//              frames: [ { key: 'pork', frame: 6 } ],
//              frameRate: 20
//          });
//          this.anims.create({
//              key: 'right',
//              frames: this.anims.generateFrameNumbers('pork', { start: 7, end: 12 }),
//              frameRate: 10,
//              repeat: -1
//          });
//          this.anims.create({
//              key: 'gun_right',
//              frames: this.anims.generateFrameNumbers('pork', { start: 13, end: 14 }),
//              frameRate: 20
//          });
//          this.anims.create({
//              key: 'gun_left',
//              frames: this.anims.generateFrameNumbers('pork', { start: 15, end: 16 }),
//              frameRate: 20
//          });
//          this.anims.create({
//              key: 'idle_left',
//              frames: [ { key: 'pork', frame: 15 } ],
//              frameRate: 10
//          });
//          this.anims.create({
//              key: 'idle_right',
//              frames: [ { key: 'pork', frame: 13 } ],
//              frameRate: 10
//          });
//          this.anims.create({
//              key: 'gun_move_right',
//              frames: this.anims.generateFrameNumbers('pork', { start: 17, end: 22 }),
//              frameRate: 10,
//              repeat: -1
//          });
//          this.anims.create({
//              key: 'gun_move_left',
//              frames: this.anims.generateFrameNumbers('pork', { start: 23, end: 28 }),
//              frameRate: 10,
//              repeat: -1
//          });
//
//          playerCollider = this.physics.add.collider(player, platforms);
//          this.cameras.main.fadeIn(800, 0, 0, 0);
//     }
//     update(time, delta){
//         clickStart.x = player.x - 200;
//         clickStart.y = player.y + 50;
//         cursors = this.input.keyboard.createCursorKeys();
//         keyZ = this.input.keyboard.addKey("z");
//         if (cursors.space.isDown && can_shoot == true){
//             can_shoot = false;
//             if(facing_left == true){
//             var b = bullets.create(player.x-20, player.y+5, 'rice');
//             if(cursors.left.isDown){
//                 player.anims.play('gun_move_left', true);
//             }
//             else{
//                 player.anims.play('gun_left');
//             }
//             b.setVelocityX(-1*gunVelocity);
//             }
//             else{
//             var b = bullets.create(player.x+20, player.y+5, 'rice');
//             if(cursors.right.isDown){
//                 player.anims.play('gun_move_right', true);
//             }
//             else{
//                 player.anims.play('gun_right');
//             }
//             b.setVelocityX(gunVelocity);
//             }
//             if(player.body.onFloor()){
//             player.setVelocityX(0);
//             }
//             timedEvent = this.time.delayedCall(gunSpeed, this.set_shoot, [], this);
//             bullet_gone = this.time.delayedCall(bulletTime, this.bullet_dissapear, [b], this);
//         }else if (cursors.left.isDown){
//             player.setVelocityX(-1*horizontalSpeed);
//             if(cursors.space.isDown == false){
//             player.anims.play('left', true);
//             }
//             facing_left = true;
//         }else if (cursors.right.isDown){
//             player.setVelocityX(horizontalSpeed);
//             if(cursors.space.isDown == false){
//             player.anims.play('right', true);
//             }
//             facing_left = false;
//         }else{
//             player.setVelocityX(0);
//             if(player.anims.getCurrentKey() === 'left' || player.anims.getCurrentKey() === 'right'){
//             if(facing_left == true){
//                 player.anims.play('idle_left');
//             }
//             else{
//                 player.anims.play('idle_right');
//             }
//             }
//         }
//         if (cursors.up.isDown && player.body.onFloor()){
//             player.setVelocityY(-1*verticalJump);
//         }
//     }
//     onClicked(){
//         this.scene.setVisible('MainMenu', true);
//         clickInstruction.setInteractive();
//         clickButtonBegin.setInteractive();
//         clickStart.disableInteractive();
//         this.scene.setVisible(false);
//     }
//     bullet_dissapear(b){
//       b.destroy();
//     }
//     set_shoot(){
//         can_shoot = true;
//     }
// }


var config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 1000,
    backgroundColor: "#5D0505",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
          default: 'arcade',
          arcade: {
              gravity: {y:800},
              //debug: true
              debug: false
          }
      },
    scene: [MainMenu], // starting with tutorial
    // scene: [GameMenu] // starting with real game
  };


var game = new Phaser.Game(config);
