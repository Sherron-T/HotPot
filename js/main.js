// scene variables
var platforms;
var movingPlatforms;

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

// gun variables
var bullets;
var gun_sound;

// small enemy variables
var enemies;
var forks = [];
var i = 0;

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
var bulletBossOverlap;
var bulletEnemOverlap;
var playerEnemOverlap;
var platformSpeed = Phaser.Math.GetSpeed(400, 3);
var pSpeed;
var movingPlatformDict = {};
// Math.round(Math.random())

//MODIFIABLE VARIABLES
// player variables
var hp = 3;
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
const boss1HP = 3;
const boss2HP = 3;
var bossHP = 3;
var bossLow = 1;
var bossStopDuration = 800;
var bossLeftBound = 9100;
var bossRightBound = 10000;
var bossScore = 233;
var bornL = 9500;
var bornR = 9550;

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

// tutorial
var tutorialTextColor = "#034680";
var clickButtonBegin;
var clickInstruction;
var hurtText;
var bossTutorialText;
var enemyTutorialText;

// instruction
var clickStart;

// temp



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

        // moving platforms
        // movingPlatforms = this.physics.add.image();

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
    enemyHurt(enemy, bullet){
        //bullet.disableBody(true, true);
        bullet.destroy();
        if(Math.round(Math.random()) == 0) enemy.destroy();
        score += Math.floor(Math.random() * 20); // making hotpot needs luck, so the score is also by luck
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
        this.scene.start('GameMenu');
        mainButton.disableInteractive();
        clickButton1.setInteractive();
        clickButton2.setInteractive();
        this.registry.destroy();
        this.events.off();
        console.log("back")
    }
    makeMoveEnemy(i, xPos, yPos, duration, enemyName){
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers(enemyName, { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        forks[i] = this.physics.add.sprite(xPos, yPos, enemyName).setOrigin(0, 1).refreshBody();
        enemies.add(forks[i]);
        //var fork1Collider = this.physics.add.collider(fork1, platforms);
        //enemies.create(600, 800, "fork").setOrigin(0, 1).refreshBody();
        forks[i].anims.play('walk');
        this.tweens.timeline({
            targets: forks[i].body.velocity,
            loop: -1,
            tweens: [
            { x:60, duration: duration, ease: 'Stepped' },
            //{ x:    0, y:    0, duration: 1000, ease: 'Stepped' },
            { x:-60, duration: duration, ease: 'Stepped' },
        ]});
        i += 1;
    }
    bullet_dissapear(b){
      b.destroy();
    }
    restart(){
        score = 0;
        hp = 3;
        movingPlatformDict = {};
        forks = [];
        i = 0;
        if(boss) boss.destroy();
        if(hearts) hearts.destroy();
        if(platforms) platforms.destroy();
        if(player) player.destroy();
        if(endText) endText.setVisible(false);
        if(summary) summary.setVisible(false);
        console.log("restart");
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
        this.load.spritesheet('introbg', 'assets/bg-sheet-small.png', {frameWidth : 1470, frameHeight : 1000});
        this.load.spritesheet('fork', 'assets/fork.png', {frameWidth : 50, frameHeight : 80});
        // we can initiate the variables for the specific boss info here
        // based on the level design
        hp = 1000;
        bossHP = boss1HP;
        bornL = 9500;
        bornR = 9600;
        bossLeftBound = bornL - 200;
        bossRightBound = bornR + 300;
        lastIndex = 9000;
        pSpeed = platformSpeed;
    }
    create(){
        // background
        this.add.image(0, 0, 'level1bg').setOrigin(0, 0);
        // boss bg
        this.add.image(9000, 0, 'background').setOrigin(0, 0);
        this.anims.create({
            key: 'boil',
            frames: this.anims.generateFrameNumbers('introbg', { start: 0, end: 6 }),
            frameRate: 2,
            repeat: -1
        });
        this.add.sprite(0,0,'introbg').setOrigin(0, 0).anims.play('boil');
        this.add.sprite(1470,0,'introbg').setOrigin(0, 0).anims.play('boil');
        super.create();

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('fork', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // first 2 platforms
        platforms.create(500, 800, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        var mp1 = platforms.create(300, 900, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        movingPlatformDict[300] = mp1;

        this.makeMoveEnemy(i, 100, 900, 2500, 'fork');
        
        this.makeMoveEnemy(i, 500, 800, 2500, 'fork');

        // little cave place
        platforms.create(1100, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(1100, 750, "platform").setScale(0.5).setOrigin(0, 0).refreshBody();
        platforms.create(900, 0, "back").setScale(0.8).setOrigin(0, 0).refreshBody();
        platforms.create(900, 900, "back").setScale(0.8).setOrigin(0, 0).refreshBody();
        platforms.create(1700, 0, "back").setScale(0.8).setOrigin(0, 0).refreshBody();
        platforms.create(900, 550, "platform").setOrigin(0, 0).refreshBody();

        this.makeMoveEnemy(i, 1100, 750, 7000, 'fork');
        this.makeMoveEnemy(i, 1200, 900, 6500, 'fork');
        this.makeMoveEnemy(i, 1200, 900, 10000, 'fork');
        this.makeMoveEnemy(i, 1300, 900, 8000, 'fork');
        this.makeMoveEnemy(i, 1600, 900, 7500, 'fork');

        // stairs
        platforms.create(2100, 800, "back").setOrigin(0, 0).refreshBody();
        platforms.create(2200, 700, "back").setOrigin(0, 0).refreshBody();
        platforms.create(2300, 600, "back").setOrigin(0, 0).refreshBody();
        platforms.create(2400, 500, "back").setOrigin(0, 0).refreshBody();

        this.makeMoveEnemy(i, 2100, 800, 1000, 'fork');
        this.makeMoveEnemy(i, 2300, 600, 500, 'fork');

        // floating platforms
        platforms.create(2900, 400, "platform").setScale(0.5).setOrigin(0, 0).refreshBody();
        platforms.create(3500, 450, "platform").setScale(0.5).setOrigin(0, 0).refreshBody();
        platforms.create(4200, 350, "platform").setScale(0.5).setOrigin(0, 0).refreshBody();

        this.makeMoveEnemy(i, 2900, 400, 8000, 'fork');
        this.makeMoveEnemy(i, 2900, 400, 6000, 'fork');
        this.makeMoveEnemy(i, 3000, 400, 4000, 'fork');

        this.makeMoveEnemy(i, 3500, 450, 4000, 'fork');
        this.makeMoveEnemy(i, 3500, 450, 5000, 'fork');
        this.makeMoveEnemy(i, 3700, 450, 4500, 'fork');

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

        this.makeMoveEnemy(i, 6500, 900, 14000, 'fork');
        this.makeMoveEnemy(i, 75000, 900, 10000, 'fork');
        this.makeMoveEnemy(i, 95000, 900, 5000, 'fork');

        this.makeMoveEnemy(i, 6600, 700, 4000, 'fork');
        this.makeMoveEnemy(i, 7000, 550, 3900, 'fork');
        this.makeMoveEnemy(i, 7400, 700, 4000, 'fork');
        this.makeMoveEnemy(i, 7400, 400, 2000, 'fork');
        this.makeMoveEnemy(i, 7400, 400, 4000, 'fork');
        this.makeMoveEnemy(i, 7500, 400, 1000, 'fork');

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

        // colliders
        playerCollider = this.physics.add.collider(player, platforms);
        enemyCollider = this.physics.add.collider(enemies, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);

        // overlaps
        bulletBossOverlap = this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);
        playerBossOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        bulletEnemOverlap = this.physics.add.overlap(enemies, bullets, this.enemyHurt, null, this);
        playerEnemOverlap = this.physics.add.overlap(player, enemies, this.takeDmg, null, this);
        playerNukesOverlap = this.physics.add.overlap(player, nukes, this.takeDmg, null, this);

        // bossText.setScrollFactor(0, 0)
    }
    update(time, delta){
        super.update(time, delta);

        if(bossHP == 0) winLevel1 = true;

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

        // moving platforms
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
    }
}

class Level2 extends CommonScene{
    preload(){
        super.preload();

        this.load.spritesheet('boss', 'assets/tofu.png', {frameWidth : 100, frameHeight : 78});
        this.load.image('leek_nuke', 'assets/leek_bullet.png')
        // load bg and platform
        this.load.image('level2bg', 'assets/level1bg.png');
        this.load.image('background', 'assets/bg.png');
        this.load.image('platform', 'assets/ground.png');
        this.load.image('big_platform', 'assets/ground2.png');
        // load ingredients
        this.load.image('fish', 'assets/ingredients/fish.png');
        this.load.image('octopus', 'assets/ingredients/octopus.png');
        this.load.image('beef', 'assets/ingredients/beef.png');
        this.load.spritesheet('fork', 'assets/fork.png', {frameWidth : 50, frameHeight : 80});
        // we can initiate the variables for the specific boss info here
        // based on the level design
        hp = 300;
        bossHP = boss2HP;
        bornL = 9500;
        bornR = 9600;
        bossLeftBound = bornL - 200;
        bossRightBound = bornR + 300;
        lastIndex = 9000;
        pSpeed = platformSpeed;
        // for testing purposes
        // horizontalSpeed = testSpeed;
        playBornX = 8000;
    }
    create(){
        // background
        this.add.image(0, 0, 'level2bg').setOrigin(0, 0);

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

        movingPlatforms = platforms.create(3200, 900, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();
        movingPlatformDict[3200] = movingPlatforms;

        // part3
        platforms.create(3800, 700, "platform").setScale(0.7).setOrigin(0, 0).refreshBody();

        // part4
        movingPlatforms = platforms.create(4900, 700, "platform").setScale(0.1).setOrigin(0, 0).refreshBody();
        movingPlatformDict[4900] = movingPlatforms;
        platforms.create(5200, 500, "platform").setScale(0.5).setOrigin(0, 0).refreshBody();
        platforms.create(5800, 300, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(6300, 300, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();

        // part5
        movingPlatforms = platforms.create(6350, 800, "platform").setScale(0.4).setOrigin(0, 0).refreshBody();
        movingPlatformDict[6350] = movingPlatforms;

        // static ingredients
        enemies.create(250, 900, "fish").setOrigin(0, 1).refreshBody();
        enemies.create(900, 600, "octopus").setOrigin(0, 1).refreshBody();
        this.makeMoveEnemy(i, 600, 700, 3000, 'fork');
        this.makeMoveEnemy(i, 500, 700, 3000, 'fork');

        enemies.create(1400, 500, "beef").setOrigin(0, 1).refreshBody();
        enemies.create(1490, 800, "octopus").setOrigin(0, 1).refreshBody();

        enemies.create(2000, 900, "octopus").setOrigin(0, 1).refreshBody();
        enemies.create(2100, 600, "beef").setOrigin(0, 1).refreshBody();
        enemies.create(2400, 900, "fish").setOrigin(0, 1).refreshBody();
        this.makeMoveEnemy(i, 2200, 800, 3000, 'fork'); // add more variety of moving enemies

        enemies.create(4000, 700, "beef").setOrigin(0, 1).refreshBody();
        enemies.create(4300, 700, "octopus").setOrigin(0, 1).refreshBody();
        this.makeMoveEnemy(i, 4250, 600, 3000, 'fork');
        enemies.create(4400, 900, "beef").setOrigin(0, 1).refreshBody();

        this.makeMoveEnemy(i, 5400, 450, 4000, 'fork');
        var xCord = 5300;
        while(xCord < 6000){
            var randomE = ["octopus", "beef", "fish"];
            enemies.create(xCord, 700, randomE[Math.floor(Math.random() * 3)]).setOrigin(0, 1).refreshBody();
            xCord += (Math.floor(Math.random() * 100)+50);
            this.makeMoveEnemy(i, xCord, 600, Math.floor(Math.random() * 1000)+Math.floor(Math.random() * 1000)+3000, 'fork');
        }

        // moving ingredients --> !!!! need to add a moving ingredients function


        // make entities
        this.anims.create({
            key: 'bossMove',
            frames: this.anims.generateFrameNumbers('boss', { start: 0, end: 12 }),
            frameRate: 5,
            repeat: -1
        });
        boss = this.physics.add.sprite(Phaser.Math.Between(bornL, bornR), 200, 'boss');
        boss.anims.play('bossMove');
        bossSpeed = Phaser.Math.GetSpeed(600, 3);
        boss.setScale(2);
        speed = bossSpeed;

        // music

        nukes = this.physics.add.group({});

        // player - objects interaction logics
        player.anims.play('idle_right');

        // colliders
        playerCollider = this.physics.add.collider(player, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);
        enemyCollider = this.physics.add.collider(enemies, platforms);
        // this.physics.add.collider(player, movingPlatforms);

        // overlaps
        bulletBossOverlap = this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);
        playerBossOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        bulletEnemOverlap = this.physics.add.overlap(enemies, bullets, this.enemyHurt, null, this);
        playerEnemOverlap = this.physics.add.overlap(player, enemies, this.takeDmg, null, this);
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
    }
}


class GameMenu extends Phaser.Scene {
    preload(){
        this.load.image('background', 'assets/bg.png');
        this.load.image('lock', 'assets/lock.png');
        this.load.image('title', 'assets/title.png');
    }
    create(){
        this.add.image(0, 0, 'title').setOrigin(0, 0);
        this.scene.remove('Tutorial');
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
        console.log("clicked level1");
        // clickButton2.setInteractive();
        //this.scene.start('Level1');
    }
    onClicked2(){
        this.scene.remove('Level2');
        scene2 = this.scene.add('Level2', Level2, true);
        clickButton1.disableInteractive();
        clickButton2.disableInteractive();
        console.log("clicked level2");
        //this.scene.start('Level2');
    }
}

class MainMenu extends Phaser.Scene {
    preload(){
        this.load.image('background', 'assets/bg.png');
        this.load.image('title', 'assets/title.png');
    }
    create(){
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(0, 0, 'title').setOrigin(0, 0);
        clickButtonBegin = this.add.text(400, 750, 'Begin the Game with Tutorial',
            {fontSize: '50px', fill: '#888'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked());
        clickInstruction = this.add.text(400, 600, 'Learn How to Play',
            {fontSize: '50px', fill: '#888'}).
            setInteractive().on('pointerdown',
            ()=>this.instruction());
    }
    update(){

    }
    onClicked(){
        this.scene.remove('Tutorial');
        this.scene.remove('Instruction');
        this.scene.add('Tutorial', Tutorial, true);
        clickInstruction.disableInteractive();
        clickButtonBegin.disableInteractive();
        console.log("clicked begin");
    }
    instruction(){
        this.scene.remove('Instruction');
        this.scene.remove('Tutorial');
        this.scene.add('Instruction', Instruction, true);
        clickInstruction.disableInteractive();
        clickButtonBegin.disableInteractive();
        console.log("clicked instruction");
    }
}

class Tutorial extends CommonScene{
    preload(){
        super.preload();

        this.load.image('boss', 'assets/leek.png');
        this.load.image('leek_nuke', 'assets/leek_bullet.png')
        // load bg and platform
        this.load.image('level2bg', 'assets/level1bg.png');
        this.load.image('background', 'assets/bg.png');
        this.load.image('platform', 'assets/ground.png');
        this.load.image('big_platform', 'assets/ground2.png');
        // load ingredients
        this.load.image('octopus', 'assets/ingredients/octopus.png');
        this.load.image('directions', 'assets/intro/directions.png')
        this.load.image('hp_dir', 'assets/intro/hp_dir.png')

        // we can initiate the variables for the specific boss info here
        // based on the level design
        hp = 5;
        bossHP = 3;
        bornL = 400;
        bornR = 800;
        bossLeftBound = bornL - 200;
        bossRightBound = bornR + 200;
        lastIndex = 50;

        // for testing purposes
        // horizontalSpeed = testSpeed;
    }
    create(){
        // background
        this.add.image(0, 0, 'level2bg').setOrigin(0, 0);

        // boss bg
        this.add.image(9000, 0, 'background').setOrigin(0, 0);

        super.create();

        this.add.image(60, 150, 'directions').setOrigin(0, 0).setScale(0.80);
        this.add.image(250, 0, 'hp_dir').setOrigin(0, 0).setScale(0.7);
        // level specified platforms
        platforms.create(300, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(800, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(500, 800, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        platforms.create(800, 600, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();
        platforms.create(1400, 500, "platform").setScale(0.2).setOrigin(0, 0).refreshBody();
        platforms.create(1500, 100, "back").setScale(2).setOrigin(0, 0).refreshBody();

        platforms.create(1800, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(2000, 600, "platform").setScale(0.3).setOrigin(0, 0).refreshBody();

        // static ingredients
        enemies.create(600, 800, "octopus").setOrigin(0, 1).refreshBody();
        enemyTutorialText = this.add.text(500, 710, 'This is a small ingredients enemy', { fontSize: '18px', fill: tutorialTextColor });

        // make entities
        boss = this.physics.add.image(Phaser.Math.Between(bornL, bornR), 200, 'boss').setOrigin(0, 1);
        boss.body.width = 115;
        bossSpeed = Phaser.Math.GetSpeed(600, 3);
        boss.setScale(0.3);
        speed = bossSpeed;
        bossTutorialText = this.add.text(boss.x, boss.y, 'This is a boss', { fontSize: '18px', fill: tutorialTextColor });

        // music

        nukes = this.physics.add.group({});

        // player - objects interaction logics
        player.anims.play('idle_right');

        // colliders
        playerCollider = this.physics.add.collider(player, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);
        enemyCollider = this.physics.add.collider(enemies, platforms);

        // overlaps
        bulletBossOverlap = this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);
        playerBossOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        bulletEnemOverlap = this.physics.add.overlap(enemies, bullets, this.enemyHurt, null, this);
        playerEnemOverlap = this.physics.add.overlap(player, enemies, this.takeDmg, null, this);
        playerNukesOverlap = this.physics.add.overlap(player, nukes, this.takeDmg, null, this);

        this.cameras.main.setBounds(0, 0, 1500, 1000);
        this.cameras.main.startFollow(player);
    }
    update(time, delta){
        super.update(time, delta);

        bossTutorialText.x = boss.x;
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
        }
    }
    // tutorial is always invulnerable
    takeDmg(player){
        if(invul == false)
        {
          player.setTint(0xB5F2F2);
          invul = true;
          hurtText = this.add.text(player.x, player.y-50, 'hurted', { fontSize: '18px', fill: tutorialTextColor });
          vulTimer = this.time.addEvent({ delay: invulDuration+2000, callback: this.blinking, callbackScope: this});
          hp = 4;
          var heart = hearts.getChildren();
          hearts.killAndHide(heart[hp]);
          heart[hp].body.enable = false;
        }
    }
    blinking(){
        player.clearTint();
        hurtText.destroy();
        invul = false;
        hp = 5;
    }
    enemyHurt(enemy, bullet){
        bullet.destroy();
        if(Math.round(Math.random()) == 0){
            enemy.destroy();
            enemyTutorialText.setText("You defeated the small enemy!")
        }
        score += Math.floor(Math.random() * 20); // making hotpot needs luck, so the score is also by luck
    }
    summary(text, add){
        super.summary(text, add);
        mainButton.setFont('21px');
        mainButton.setText("Start the Real Adventure");
    }
    backToMenu(){
        this.scene.add('GameMenu', GameMenu, true);
        mainButton.disableInteractive();
        this.scene.remove('MainMenu');
        this.registry.destroy();
        this.events.off();
        console.log("back")
    }
}

// add literal instructions in this section !!!!
// add some text, pictures, and background stories
class Instruction extends Phaser.Scene {
    preload(){
        this.load.image('InstructionBG', 'assets/level1bg.png');
        this.load.spritesheet('pork', 'assets/pork.png', {frameWidth : 100, frameHeight : 78});
        this.load.image('platform', 'assets/ground.png');
        this.load.image('back', 'assets/back.png');
        this.load.image('rice', 'assets/rice.png')
        this.load.image('controls', 'assets/intro/controls.png')
        this.load.image('intro', 'assets/intro/intro.png')
    }
    create(){
        this.add.image(0, 0, 'InstructionBG').setOrigin(0, 0);
        platforms = this.physics.add.staticGroup();

        //block
        platforms.create(0, 0, "back").setOrigin(1, 0).refreshBody();
        platforms.create(2000, 0, "back").setOrigin(0, 0).refreshBody();

        // stable platforms
        platforms.create(-700, 900, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(0, 900, "platform").setOrigin(0, 0).refreshBody();
        for(var i = 500; i <= 2000; i+=500){
            platforms.create(i, 900, "platform").setOrigin(0, 0).refreshBody();
        }

        player = this.physics.add.sprite(500, 800, 'pork');
        player.setBounce(0);
        player.setCollideWorldBounds(false);
        player.body.width = 60;
        player.body.offset.x = 20;

        // weapons
        bullets = this.physics.add.group({
            allowGravity: false
        });

        this.add.image(90, 175, 'intro').setOrigin(0, 0).setScale(0.80);
        this.add.text(1000, 200, 'Use Arrow keys to move and space to shoot',
            {fontSize: '30px', fill: '#232',});
        this.add.image(1000, 250, 'controls').setOrigin(0, 0).setScale(0.6);

        clickStart = this.add.text(300, 850, 'Ready to Start Game Tutorial',
            {fontSize: '30px', fill: '#888'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked());

        this.cameras.main.setBounds(0, 0, 2000, 1000);
        this.cameras.main.startFollow(player);

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

         playerCollider = this.physics.add.collider(player, platforms);
    }
    update(time, delta){
        clickStart.x = player.x - 200;
        clickStart.y = player.y + 50;
        cursors = this.input.keyboard.createCursorKeys();
        keyZ = this.input.keyboard.addKey("z");
        if (cursors.space.isDown && can_shoot == true){
            can_shoot = false;
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
    onClicked(){
        this.scene.setVisible('MainMenu', true);
        clickInstruction.setInteractive();
        clickButtonBegin.setInteractive();
        clickStart.disableInteractive();
        this.scene.setVisible(false);
        console.log("back to MainMenu");
    }
    bullet_dissapear(b){
      b.destroy();
    }
    set_shoot(){
        can_shoot = true;
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
              gravity: { y: 800 },
              debug: true
          }
      },
    //scene: [MainMenu] // starting with tutorial
    scene: [GameMenu] // starting with real game
  };


var game = new Phaser.Game(config);
