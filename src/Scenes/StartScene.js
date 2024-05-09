class Start extends Phaser.Scene {
    constructor() {
        super({key: 'Start'});
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
        this.add.text(380, 300, 'Killer Buns', { fontSize: '60px', fill: '#ECBB12', fontFamily: 'fantasy'}).setOrigin(0.5);
        this.add.text(380, 400, 'Press "S" to Start', { fontSize: '40px', fill: '#ECBB12', fontFamily: 'fantasy'}).setOrigin(0.5);
    }
    
    update() {
        let keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        //this.currhighscore = this.scene.get('sceneName').highscore;

        if(keyS.isDown) {
            this.scene.start('sceneName');
        }
    }
}