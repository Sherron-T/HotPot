var score = 0;
var ground;
var swords;
var diamond;
var player;
var cursor;
var scoreText;
var gameOver = false;

class Scene extends Phaser.Scene {
    preload(){
        this.load.image('background', 'assets/background.jpg');
        this.load.image('sword', 'assets/sword.png');
        this.load.image('diamond', 'assets/diamond.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('warrior', 'assets/warriors.png', {frameWidth : 80, frameHeight : 85});
    }
    create(){
        this.add.image(400, 300, 'background');
        ground = this.physics.add.staticGroup();
        ground.create(400, 600, 'ground').setScale(2).refreshBody();

        swords = this.physics.add.group();
        swords.create(300, 0, 'sword');
        swords.create(500, 0, 'sword');

        diamond = this.physics.add.group();
        diamond.create(Phaser.Math.Between(400, 800), 0, 'diamond')

        // add player
        player = this.physics.add.sprite(200, 450, 'warrior');
        player.setBounce(0.3);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'l',
            frames: this.anims.generateFrameNumbers('warrior', {swordt: 0, end: 1}),
            frameRate: 10,
            repear: -1
        });
        this.anims.create({
            key: 'r',
            frames: this.anims.generateFrameNumbers('warrior', {swordt: 3, end: 4}),
            frameRate: 10,
            repear: -1
        });
        this.anims.create({
            key: 'front',
            frames: [{key: 'warrior', frame: 2}],
            frameRate: 20
        })

        cursor = this.input.keyboard.createCursorKeys();

        scoreText = this.add.text(20, 20, 'score: '+score, {fontSize: '36px', fill: '#0f0'});
    }
    update(){
        if(cursor.left.isDown){
            player.setVelocityX(-150);
            player.anims.play('l', true);
        }else if(cursor.right.isDown){
            player.setVelocityX(150);
            player.anims.play('r', true);
        }else{
            player.setVelocityX(0);
            player.anims.play('front');
        }
        if(cursor.up.isDown && player.body.touching.down){
            player.setVelocityY(-350);
        }
    }
    collectswords(player, sword){
        sword.disableBody(true, true);
        score += 10
        scoreText.setText('score: '+score);
    }
    findDiamond(player, diamond){
        diamond.disableBody(true, true);
        score += 100
        scoreText.setText('score: '+score);
    }
}

class MainMenu extends Scene {
    create(){
        super.create();
        this.physics.add.collider(ground, player);
        this.physics.add.collider(ground, swords);
        this.physics.add.collider(ground, diamond);
        this.physics.add.overlap(player, swords, this.collectswords, null, this);
        this.physics.add.overlap(player, diamond, this.findDiamond, null, this);

        const clickButton = this.add.text(300, 200, 'Start the Game!',
                                            {fontSize: '50px', fill: '#888'}).
                                            setInteractive().on('pointerdown',
                                            ()=>this.onClicked());
    }
    onClicked(){
        this.scene.add('GameScene', GameScene, true);
        this.scene.start('GameScene');
    }
}

class GameScene extends Scene{
    create(){
        super.create();
        ground.create(500, 400, 'ground');
        ground.create(750, 300, 'ground');
        this.physics.add.collider(ground, player);
        this.physics.add.collider(ground, swords);
        this.physics.add.collider(ground, diamond);
        this.physics.add.overlap(player, swords, this.collectswords, null, this);
        this.physics.add.overlap(player, diamond, this.findDiamond, null, this);
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {default: 'arcade', arcade: {gravity: {y: 300}, debug: false}},
    scene: [MainMenu]
};

var game = new Phaser.Game(config);
