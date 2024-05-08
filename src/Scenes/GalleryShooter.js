class Shooter extends Phaser.Scene {
    constructor() {
        super('sceneName');
        this.my = { sprite: {}, bullets: [], bee_enemies: [], beesProjectiles: [] }; // Initialize arrays
        this.alienX = 400;
        this.alienY = 700;
        this.emitMode = false;
        this.score = 0;
        this.lives = 5; // Initialize lives

        this.currentWave = 0; // Initialize current wave
        this.waves = [
            { beeCount: 10 }, // Define initial wave (Level 1)
            { beeCount: 15 }, // Define second wave (Level 1)
            { beeCount: 20 }, // Define third wave (Level 1)
            // Define additional waves as needed
        ];
    }

    preload() {
        // Load assets
        this.load.setPath("./assets/");
        this.load.image("alien", "alienPink_walk2.png");
        this.load.image("slime", "slimeBlock.png");
        this.load.image("bee", "bee.png");
        this.load.image("spinner", "spinner_spin.png");
    }

    create() {
        let my = this.my;
        // Create alien sprite
        my.sprite.alien = this.add.sprite(this.alienX, this.alienY, "alien");

        // Create keyboard keys
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        // Initialize path
        this.points = [
            27, 193, 137, 117, 284, 170, 425, 140, 541, 178, 657, 132, 784, 171, 870, 130, 950, 150
        ];
        this.curve = new Phaser.Curves.Spline(this.points);
        //this.initializePath();

        // Create bee_enemies
        this.createBees();

        // Create text for displaying score
        this.scoreText = this.add.text(600, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        // Create text for displaying lives
        this.livesText = this.add.text(16, 16, 'Lives: 5', { fontSize: '32px', fill: '#fff' });

        this.startWave(); // Start the first wave
    }

    startWave() {
        let waveData = this.waves[this.currentWave];
        if (waveData) {
            this.createBees(waveData.beeCount);
        } else {
            // All waves completed, game over or victory condition
        }
    }

    createBees(count) {
        let my = this.my;
    
        // Create multiple bee_enemies
        for (let i = 0; i < count; i++) {
            // Randomize starting position for each bees
            // let startX = Phaser.Math.Between(0, 100);
            let startX = -50;
            let startY = Phaser.Math.Between(100, 400);
    
            // Create bees sprite
            let bees = this.add.follower(this.curve, startX, startY, "bee");
            bees.visible = true;
            my.bee_enemies.push(bees);
    
            // Set up movement along the path
            let speed = Phaser.Math.Between(2000, 4000); // Randomize speed
            bees.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: speed,
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: true,
                rotateToPath: true,
                rotationOffset: -90
            });

        // Schedule bees projectiles to emit every 1 second
        let delay_time = Phaser.Math.Between(1000, 3000);
        let projectileTimer = this.time.addEvent({
            delay: delay_time, // Emit every 1 seconds
            callback: () => {
                this.emitBeesProjectile(bees);
            },
            loop: true
        });

        // Store reference to the timer event
        bees.projectileTimer = projectileTimer;
        }
    }

    destroyBees(bees) {
        let my = this.my;
    
        // Cancel the timer event associated with this bees
        if (bees.projectileTimer) {
            bees.projectileTimer.destroy();
        }
    
        // Remove the bees from the bee_enemies array
        my.bee_enemies.splice(my.bee_enemies.indexOf(bees), 1);
    
        // Destroy the bees sprite
        bees.destroy();

        if (this.my.bee_enemies.length === 0) {
            // All bees in the current wave are destroyed, start the next wave
            this.currentWave++;
            this.startWave();
        }
    }
    

    update() {
        let my = this.my;

        // Update bee_enemies
        my.bee_enemies.forEach(bees => {
            if (!bees.active) return;
            // Update bees movement or behavior here
        });

        // Move alien left
        if (this.aKey.isDown && my.sprite.alien.x >= 40) {
            my.sprite.alien.flipX = true;
            my.sprite.alien.x -= 5;
        }

        // Move alien right
        if (this.dKey.isDown && my.sprite.alien.x <= 760) {
            my.sprite.alien.flipX = false;
            my.sprite.alien.x += 5;
        }

        // Shoot bullets
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.emitBullet();
        }

        // Update bullets
        my.bullets.forEach(bullet => {
            bullet.y -= 25 ; // Adjust bullet speed as needed
            if (bullet.y <= 0) {
                bullet.destroy();
                my.bullets.splice(my.bullets.indexOf(bullet), 1);
            } else {
                // Check for collision with bee_enemies
                my.bee_enemies.forEach(bees => {
                    if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), bees.getBounds())) {
                        bullet.destroy();
                        my.bullets.splice(my.bullets.indexOf(bullet), 1);
                        this.destroyBees(bees); // Destroy the bees
                        this.score += 25; // Increase score
                        this.scoreText.setText('Score: ' + this.score); // Update score text
                    }
                });
            }
        });

        // Check for collision with bees projectiles
        my.beesProjectiles.forEach(projectile => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(my.sprite.alien.getBounds(), projectile.getBounds())) {
                projectile.destroy();
                my.beesProjectiles.splice(my.beesProjectiles.indexOf(projectile), 1);
                this.lives--; // Decrease lives
                this.livesText.setText('Lives: ' + this.lives); // Update lives text
                if (this.lives <= 0) {
                    this.scene.start('GameOver');
                }
            }
        });

        // Update bees projectiles
        my.beesProjectiles.forEach(projectile => {
            // Slowly float towards the alien
            let pathX = Phaser.Math.Between(0, 800);
            let pathY = 850;
            let angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, pathX, pathY);
            //let velocityX = Math.cos(angle) * 4;
            let velX = Phaser.Math.Between(4, 8);
            let velocityY = Math.sin(angle) * velX;
            //projectile.x += velocityX;
            projectile.y += velocityY;

            if (projectile.y >= 800) {
                projectile.destroy();
                my.beesProjectiles.splice(my.beesProjectiles.indexOf(projectile), 1);
            }
        });
    }

    emitBullet() {
        let my = this.my;
        let bullet = this.add.sprite(my.sprite.alien.x, my.sprite.alien.y, "slime");
        bullet.setScale(0.4);
        my.bullets.push(bullet);
    }

    emitBeesProjectile(bees) {
        let my = this.my;
        let projectile = this.add.sprite(bees.x, bees.y, "spinner");
        projectile.setScale(0.4);
        my.beesProjectiles.push(projectile);
    }
}
