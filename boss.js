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
var cursors;
var keyZ;
var boss;
var hearts;
var endText;
var bossText;
var playerCollider;
var bossCollider;
var bullets;
var timedEvent;
var vulTimer;
var invul = false;
var facing_left = false;
var can_shoot = true;
var playerBoosOverlap;
var playerNukesOverlap;
var bossStop = false;
var speed;
var bossSpeed;
var bossSpecial = true;
var nukes;
var gun_sound;
// Math.round(Math.random())

//MODIFIABLE VARIABLES
var hp = 3;
var bossHP = 50;
var invulDuration = 3000;
var gunSpeed = 300;
var gunVelocity = 400;
var horizontalSpeed = 160;
var verticalJump = 300;
var bossStopDuration = 800;


class Leek extends Phaser.Scene {
    preload(){
        this.load.image('platform', 'assets/ground2.png');
        this.load.image('background', 'assets/bg.png');
        this.load.image('boss', 'assets/leek.png');
        this.load.spritesheet('pork', 'assets/pork.png', {frameWidth : 100, frameHeight : 78});
        this.load.image('weapon', 'assets/weapon.png');
        this.load.audio('boss_music', 'assets/boss.wav')
        this.load.audio('gun_sound', 'assets/gun_sound.wav')
        this.load.image('heart', 'assets/heart.png')
        this.load.image('rice', 'assets/rice.png')
        this.load.image('rice2', 'assets/rice2.png')
        this.load.image('leek_nuke', 'assets/leek_bullet.png')
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
        gun_sound = this.sound.add('gun_sound');
        // variable for all platforms 100x1000
        var platforms = this.physics.add.staticGroup();

        platforms.create(997, 800, "platform").setOrigin(0, 0).refreshBody();
        platforms.create(0, 800, "platform").setOrigin(0, 0).refreshBody();

        // create the boss object
        // var boss = this.physics.add.sprite(Phaser.Math.Between(500, 800), 0, 'boss');
        // boss.setBounce(0.4);
        // boss.setCollideWorldBounds(true);
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
        // this.add.weapon(10, 'rice');
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
        nukes = this.physics.add.group({
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


        // make player collide with platforms
        player.anims.play('idle_right');
        playerCollider = this.physics.add.collider(player, platforms);
        bossCollider = this.physics.add.collider(boss, platforms);
        this.physics.add.overlap(boss, bullets, this.bossHurt, null, this);

        playerBoosOverlap = this.physics.add.overlap(player, boss, this.takeDmg, null, this);
        playerNukesOverlap = this.physics.add.overlap(player, nukes, this.takeDmg, null, this);

        bossText = this.add.text(1200, 40, 'Boss HP: ' + bossHP, { fontSize: '32px', fill: '#4314B0' });

        // clearInterval(timeInter) when the boss dies <---- !!!

        // this.physics.moveTo(boss, 500, 0, 150);
        // boss.setVelocityX(10);
        // var timeInter = setInterval(this.bossMovement.bind(null, boss, bossSpeed), 5000);

    }
    update(time, delta){
        cursors = this.input.keyboard.createCursorKeys();
        keyZ = this.input.keyboard.addKey("z");
        boss.x += speed * delta;
        if(boss.x >= 1000 && !bossStop){
            // setInterval(this.dummy, 5000);
            //console.log("large")
            speed = 0;
            bossStop = true;
            this.time.addEvent({ delay: bossStopDuration, callback: this.moveStop, callbackScope: this});
        }
        if(boss.x <= 100 && !bossStop){
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
            this.physics.world.removeCollider(playerBoosOverlap);
            this.physics.world.removeCollider(playerNukesOverlap);
            boss.setCollideWorldBounds(false);
            endText = this.add.text(600, 500, "YOU WIN", { fontSize: '60px', fill: '#C45827' });
            return;
        }
    }
    dummy(){
        //console.log("Waiting");
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
        //console.log("here")
        bossSpeed = -bossSpeed;
        speed = bossSpeed;
        bossStop = false;
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
