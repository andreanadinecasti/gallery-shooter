class GameOver extends Phaser.Scene {
    constructor() {
        super({key: 'GameOver'});
        //this.currhighscore = 0;
    }

    create() {
        // Display game over text & restart text
        this.add.text(400, 300, 'Game Over', { fontSize: '60px', fill: 'Red', fontFamily: 'Brush Script MT'}).setOrigin(0.5);
        this.add.text(400, 400, 'Press "R" to Restart', { fontSize: '40px', fill: 'Red', fontFamily: 'Brush Script MT'}).setOrigin(0.5);
    }
    
    update() {
        let keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //this.currhighscore = this.scene.get('sceneName').highscore;

        if(keyR.isDown) {
            this.scene.start('sceneName');
        }
    }
}