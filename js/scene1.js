import {CST} from "./CST.js";

var player;
var cursors;
var enemy;

function kill (player, enemy){
    enemy.disableBody(true, true);
    console.log(this.score);
    this.score += 10;
    scoreText.setText('score: ' + this.score);
}
var scoreText;


export var Scene1 = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function Scene1 ()
    {
        Phaser.Scene.call(this, { key: CST.SCENES.SCENE1, active: true });
    },

    init: function(){
      this.score = 0;
    },

    preload: function (){
        this.load.image('bg', "img/bg/brain.jpeg");
        this.load.image("floor170", "img/floor/170grey.png");
        this.load.image("main", "img/main/main.png");
        this.load.image("enemy", "img/enemy/enemy.png");
    },

    create: function (){
        this.bg = this.add.image(300, 315, 'bg');

        var platforms = this.physics.add.staticGroup();
        platforms.create(120, 320, "floor170").setScale(1.7).refreshBody();
        platforms.create(450, 280, "floor170");
        platforms.create(300, 200, "floor170").setScale(1.5).refreshBody();
        platforms.create(150, 120, "floor170");

        player = this.physics.add.sprite(100, 280, 'main');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.physics.add.collider(player, platforms);

        enemy = this.physics.add.group({
          key: 'enemy',
          repeat: 11,
          setXY: { x: 12, y: 0, stepX: 70 }
        });
        enemy.children.iterate(function (child) {
          child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.physics.add.collider(enemy, platforms);
        this.physics.add.overlap(player, enemy, kill, null, this);

        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    },

    update: function(){
      cursors = this.input.keyboard.createCursorKeys();

      if (cursors.left.isDown){
          player.setVelocityX(-160);

      }else if (cursors.right.isDown){
          player.setVelocityX(160);

      }else{
          player.setVelocityX(0);
      }

      if (cursors.up.isDown && player.body.touching.down)
      {
          player.setVelocityY(-300);
      }

      if(this.score >= 80){
        this.scene.start(CST.SCENES.SCENE2,{"score": this.score});
      }
    }
});
