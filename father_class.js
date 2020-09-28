
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


class CommonScene extends Phaser.Scene{
    preload(){
        // common for all levels 
        this.load.image('platform', 'assets/ground2.png');
        this.load.image('background', 'assets/bg.png');
        this.load.image('heart', 'assets/heart.png')
        this.load.spritesheet('pork', 'assets/pork.png', {frameWidth : 100, frameHeight : 78});
        this.load.image('weapon', 'assets/weapon.png');
        this.load.audio('boss_music', 'assets/boss.wav')
        this.load.audio('gun_sound', 'assets/gun_sound.wav')
        this.load.image('rice', 'assets/rice.png')
        this.load.image('rice2', 'assets/rice2.png')
    }
    create(){
        // common background 
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // music settings 
        var music = this.sound.add('boss_music',{
            loop: true,
            delay: 0,
            volume: 0.2
          });
        music.play();
        gun_sound = this.sound.add('gun_sound');
        
        // variable for all platforms 100x1000
        var platforms = this.physics.add.staticGroup();

        boss = this.physics.add.image(Phaser.Math.Between(500, 800), 200, 'boss').setOrigin(0);
        bossSpeed = Phaser.Math.GetSpeed(600, 3);
        speed = bossSpeed;

        // create main char
        player = this.physics.add.sprite(0, 0, 'pork');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.width = 60;
        player.body.offset.x = 20;

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

}

class Level1 extends CommonScene{
    preload(){
        super.preload();
        this.load.image('boss', 'assets/leek.png');
        this.load.image('leek_nuke', 'assets/leek_bullet.png')
        // we can initiate the variables for the specific boss info here 
        // based on the level design 
        hp = 3; 
    }
    create(){
        super.create();
        // level specified platforms 
        platforms.create(997, 800, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(0, 800, "platform").setOrigin(0, 0).refreshBody();
        
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

class Level2 extends CommonScene{
    preload(){
        super.preload();
        this.load.image('boss', 'assets/tofu.png');
        this.load.image('tofu_nuke', 'assets/tofu_bullet.png')
    }
}