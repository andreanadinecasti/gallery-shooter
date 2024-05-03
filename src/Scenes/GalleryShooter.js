class Shooter extends Phaser.Scene {
    constructor() {
        super('sceneName');
        this.my = {sprite: {}}; 

        this.alienX = 400;
        this.alienY = 700;

        this.emitMode = false;
    }

    preload() {
        // Assets from Kenny Assets pack "Platformer Art Extended Enemies"
        // https://kenney.nl/assets/platformer-art-extended-enemies
        this.load.setPath("./assets/");

        this.load.image("alien", "alienPink_walk2.png");
        this.load.image("slime", "slimeBlock.png");
    }

    create() {
        let my = this.my;

        my.sprite.slime = this.add.sprite(this.alienX, this.alienY, "slime");
        my.sprite.slime.visible = false;
        my.sprite.slime.setScale(.4);

        //my.sprite.slime = this.add.sprite(this.alienX, this.alienY, "slime");
        //my.sprite.slime.visible = false;
        //my.sprite.slime.setScale(.4);

        my.sprite.alien = this.add.sprite(this.alienX, this.alienY, "alien");

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    
    update() {
        let my = this.my;

        if (this.aKey.isDown) {
            my.sprite.alien.flipX = true;

            if (my.sprite.alien.x >= 40) {
                my.sprite.alien.x -= 5;
            } 
        }

        if (this.dKey.isDown) {
            my.sprite.alien.flipX = false;

            if (my.sprite.alien.x <= 760) {
                my.sprite.alien.x += 5;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.emitMode = true;
        }

        if (this.emitMode === true) {
            my.sprite.slime.visible = true;
            my.sprite.slime.y -= 25;
            if (my.sprite.slime.y == 0) {
                this.emitMode = false;
            }
        }

        if (this.emitMode === false) {
            my.sprite.slime.visible = false;
            my.sprite.slime.y = my.sprite.alien.y;
            my.sprite.slime.x = my.sprite.alien.x;
        }
    }
}

