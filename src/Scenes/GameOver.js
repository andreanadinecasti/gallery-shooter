class GameOver extends Phaser.Scene {
    constructor() {
        super({key: 'GameOver'});
        this.my = {background: {}};
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("background", "background.png");
    }

    create() {
        let my = this.my;

        my.background = this.add.image(400,360, "background");
        // Display game over text & restart text
        this.add.text(400, 300, 'Game Over', { fontSize: '60px', fill: '#FFA6C2', fontFamily: 'fantasy'}).setOrigin(0.5);
        this.add.text(400, 400, 'Press "R" to Restart', { fontSize: '40px', fill: '#FFA6C2', fontFamily: 'fantasy'}).setOrigin(0.5);
        this.add.text(400, 450, 'Press "S" to go to Start Screen', { fontSize: '40px', fill: '#FFA6C2', fontFamily: 'fantasy'}).setOrigin(0.5);
    }
    
    update() {
        let keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        let keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        //this.currhighscore = this.scene.get('sceneName').highscore;

        if(keyR.isDown) {
            this.scene.start('sceneName');
        }
        if(keyS.isDown) {
            this.scene.start('Start');
        }
    }
}