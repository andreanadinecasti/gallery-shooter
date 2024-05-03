class Movement extends Phaser.Scene {
    constructor() {
        super('sceneName');
        this.my = {sprite: {}}; 
    }

    preload() {
        // Assets from Kenny Assets pack "Platformer Art Extended Enemies"
        // https://kenney.nl/assets/platformer-art-extended-enemies
        this.load.setPath("./assets/");
    }

    create() {
        let my = this.my;
    }
    
    update() {
        let my = this.my;
    }
}

