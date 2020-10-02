class MainMenu extends Phaser.Scene {
    preload(){
        this.load.image('background', 'assets/bg.jpg');
    }
    create(){
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        const clickButton = this.add.text(300, 100, 'Start the Level1!',
            {fontSize: '50px', fill: '#222'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked1());
        const clickButton = this.add.text(300, 300, 'Start the Level2!',
            {fontSize: '50px', fill: '#222'}).
            setInteractive().on('pointerdown',
            ()=>this.onClicked2());
    }
    onClicked2(){
        this.scene.add('Level1', Level1, true);
        this.scene.start('GameScene');
    }
    onClicked2(){
        this.scene.add('Level2', Level2, true);
        this.scene.start('GameScene');
    }
}

var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    backgroundColor: "#5D0505",
    physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 500 },
              debug: false
          }
      },
    scene: [MainMenu]
  };


var game = new Phaser.Game(config);