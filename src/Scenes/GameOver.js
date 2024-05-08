class GameOver extends Phaser.Scene {
    constructor() {
        super({key: 'GameOver'});
    }

    create() {
        // Display game over text
        this.add.text(400, 300, 'Game Over', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        /*
        // Add a restart button
        const restartButton = this.add.text(400, 400, 'Restart', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        restartButton.setInteractive();

        // Handle restart button click
        restartButton.on('pointerdown', () => {
            this.scene.start('sceneName'); // Replace 'sceneName' with the key of your main scene
        });
        */
    }
}