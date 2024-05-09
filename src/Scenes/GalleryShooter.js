class Shooter extends Phaser.Scene {
    constructor() {
        super('sceneName');
        this.my = { background: {}, sprite: {}, bullets: [], bee_enemies: [], beesProjectiles: [], bluebee_enemies: [], bluebeesProjectiles: [] }; // Initialize arrays
        this.bunnyX = 400;
        this.bunnyY = 690;
        this.emitMode = false;
        this.score = 0;
        this.lives = 5; // Initialize lives
        this.highscore = 0; // Highscore
        this.currentWave = 0; // Initialize current wave
        this.bCount = 1;
        this.waves = [
            { beeCount: this.bCount } // Define initial wave (Level 1)
        ];
    }

    preload() {
        // Load assets
        this.load.setPath("./assets/");
        this.load.image("bunny", "bunny.png");
        this.load.image("bullet", "bunny_bullet.png");
        this.load.image("bee", "b.png");
        this.load.image("bluebee", "blueb.png");
        this.load.image("shoot", "bee_shooter.png");
        this.load.image("blueshoot", "blue_bullet.png");
        this.load.image("background", "background.png");

        //this.load.audio(laser, path);
        this.load.audio('laser', 'laserSmall_000.ogg');
        this.load.audio('background_music', 'lil-pipa-riff-36218.mp3');
        this.load.audio('buzz', 'sound-effect-bees-buzzing-153375.mp3');
        this.load.audio('hurt', 'ouch.wav');
        this.load.audio('game_over', 'gameOver.wav');

    }

    create() {
        let my = this.my;

        this.sound.play('background_music', {
            loop: true,
            rate: 1.25
        });

        my.background = this.add.image(400,360, "background");

        // Create bunny sprite
        my.sprite.bunny = this.add.sprite(this.bunnyX, this.bunnyY, "bunny");
        my.sprite.bunny.setScale(6);

        // Create keyboard keys
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        // Initialize path
        this.points = [
            -100, 100, 2, 71, 113, 69, 113, 185, 219, 192, 235, 77, 379, 69, 377, 182, 504, 192, 518, 68, 646, 63, 660, 181, 779, 185, 
        ];
        this.curve = new Phaser.Curves.Spline(this.points);

        this.points2 = [
            -100, 100, 12, 29, 229, 56, 327, 164, 352, 294, 259, 328, 133, 297, 144, 208, 253, 119, 373, 73, 484, 47, 604, 36, 659, 109, 703, 206, 637, 288, 546, 310, 478, 232, 496, 155, 583, 114, 704, 53, 838, 48, 939, 51, 993, 57 
        ];
        this.curve2 = new Phaser.Curves.Spline(this.points2);
        //this.initializePath();

        // Create bee_enemies
        //this.createBees();
        //this.createBlueBees();

        // Create text for displaying score
        this.scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '35px', fill: '#ECBB12', fontFamily: 'fantasy'});

        // Create text for displaying lives
        this.livesText = this.add.text(670, 16, 'Lives: 5', { fontSize: '35px', fill: '#ECBB12', fontFamily: 'fantasy'});

        // Create text for wave
        this.waveText = this.add.text(340, 16, 'Wave 0', { fontSize: '50px', fill: '#4AB9DA', fontFamily: 'fantasy'});

        // Create text for highscore
        this.highscoreText = this.add.text(290, 70, 'Highscore: 0', { fontSize: '35px', fill: '#4AB9DA', fontFamily: 'fantasy'});

        this.startWave(); // Start the first wave
    }

    startWave() {
        this.highscoreText.setText('Highscore: ' + this.highscore);

        let waveData = this.waves[this.currentWave];
        if (waveData) {
            this.waveText.setText('Wave ' + this.bCount);
            this.bCount++;
            this.waves.push({beeCount: this.bCount});
            this.createBees(waveData.beeCount);

            if (((this.currentWave+1) % 3 == 0)) {
                let bluebeeCount = (waveData.beeCount)/3;
                this.createBlueBees(bluebeeCount);
            }
        } 
    }

    createBees(count) {
        this.sound.play('buzz', {
            volume: 0.5 
         });
        let my = this.my;
    
        // Create multiple bee_enemies
        for (let i = 0; i < count; i++) {
            // Randomize starting position for each bees
            // let startX = Phaser.Math.Between(0, 100);
            let startX = -50;
            let startY = Phaser.Math.Between(100, 400);
    
            // Create bees sprite
            let bees = this.add.follower(this.curve, startX, startY, "bee");
            bees.setScale(5);
            bees.visible = true;
            my.bee_enemies.push(bees);
    
            // Set up movement along the path
            let speed = Phaser.Math.Between(3000, 6000); // Randomize speed
            bees.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: speed,
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: true,
                rotateToPath: false,
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
        
        // console.log(this.my.bee_enemies.length);
        if (this.my.bee_enemies.length === 0) {
            // All bees in the current wave are destroyed, start the next wave
            this.currentWave++;
            this.startWave();
        }
    }
    
    createBlueBees(count) {
        let my = this.my;
    
        // Create multiple bee_enemies
        for (let i = 0; i < count; i++) {
            // Randomize starting position for each bees
            // let startX = Phaser.Math.Between(0, 100);
            let startX = -50;
            let startY = Phaser.Math.Between(100, 400);
    
            // Create bees sprite
            let bees = this.add.follower(this.curve2, startX, startY, "bluebee");
            bees.setScale(6);
            bees.visible = true;
            my.bluebee_enemies.push(bees);
    
            // Set up movement along the path
            let speed = Phaser.Math.Between(6000, 8000); // Randomize speed
            bees.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: speed,
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: true,
                rotateToPath: false,
                rotationOffset: -90
            });

        // Schedule bees projectiles to emit every 1 second
        let delay_time = Phaser.Math.Between(1000, 2000);
        let projectileTimer = this.time.addEvent({
            delay: delay_time, // Emit every 1 seconds
            callback: () => {
                this.emitBlueBeesProjectile(bees);
            },
            loop: true
        });

        // Store reference to the timer event
        bees.projectileTimer = projectileTimer;
        }
    }

    destroyBlueBees(bees) {
        let my = this.my;
    
        // Cancel the timer event associated with this bees
        if (bees.projectileTimer) {
            bees.projectileTimer.destroy();
        }
    
        // Remove the bees from the bee_enemies array
        my.bluebee_enemies.splice(my.bluebee_enemies.indexOf(bees), 1);
    
        // Destroy the bees sprite
        bees.destroy();
    }

    update() {
        let my = this.my;
        
        // update cool down:
        this.coolDown--;

        // Update bee_enemies
        my.bee_enemies.forEach(bees => {
            if (!bees.active) return;
            // Update bees movement or behavior here
        });

        my.bluebee_enemies.forEach(bees => {
            if (!bees.active) return;
            // Update bees movement or behavior here
        });

        // Move bunny left
        if (this.aKey.isDown && my.sprite.bunny.x >= 40) {
            my.sprite.bunny.flipX = true;
            my.sprite.bunny.x -= 5;
        }

        // Move bunny right
        if (this.dKey.isDown && my.sprite.bunny.x <= 760) {
            my.sprite.bunny.flipX = false;
            my.sprite.bunny.x += 5;
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
                        bullet.visible = false;
                        bullet.destroy();
                        my.bullets.splice(my.bullets.indexOf(bullet), 1);
                        this.destroyBees(bees); // Destroy the bees
                        this.score += 25; // Increase score
                        this.scoreText.setText('Score: ' + this.score); // Update score text
                    }
                });

                my.bluebee_enemies.forEach(bees => {
                    if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), bees.getBounds())) {
                        bullet.visible = false;
                        bullet.destroy();
                        my.bullets.splice(my.bullets.indexOf(bullet), 1);
                        this.destroyBlueBees(bees); // Destroy the bees
                        this.score += 100; // Increase score
                        this.scoreText.setText('Score: ' + this.score); // Update score text
                    }
                });
            }
        });

        // Check for collision with bees projectiles
        my.beesProjectiles.forEach(projectile => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(my.sprite.bunny.getBounds(), projectile.getBounds())) {
                this.sound.play('hurt', {
                    rate: 1.5,
                }); // Play hurt sound
                projectile.visible = false;
                projectile.destroy();
                my.beesProjectiles.splice(my.beesProjectiles.indexOf(projectile), 1);
                this.lives--; // Decrease lives
                this.livesText.setText('Lives: ' + this.lives); // Update lives text
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        });

        my.bluebeesProjectiles.forEach(projectile => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(my.sprite.bunny.getBounds(), projectile.getBounds())) {
                this.sound.play('hurt', {
                    rate: 1.5,
                }); // Play hurt sound
                projectile.visible = false;
                projectile.destroy();
                my.bluebeesProjectiles.splice(my.bluebeesProjectiles.indexOf(projectile), 1);
                this.gameOver();
            }
        });

        // Update bees projectiles
        my.beesProjectiles.forEach(projectile => {
            // Slowly float towards the bunny
            let pathX = Phaser.Math.Between(0, 800);
            let pathY = 850;
            let angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, pathX, pathY);
            //let velocityX = Math.cos(angle) * 4;
            let velX = Phaser.Math.Between(5, 10);
            let velocityY = Math.sin(angle) * velX;
            //projectile.x += velocityX;
            projectile.y += velocityY;

            if (projectile.y >= 700) {
                projectile.destroy();
                my.beesProjectiles.splice(my.beesProjectiles.indexOf(projectile), 1);
            }
        });

        my.bluebeesProjectiles.forEach(projectile => {
            // Slowly float towards the bunny
            let pathX = Phaser.Math.Between(0, 800);
            let pathY = 850;
            let angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, pathX, pathY);
            let velocityY = Math.sin(angle) * 8;
            //projectile.x += velocityX;
            projectile.y += velocityY;

            if (projectile.y >= 700) {
                projectile.destroy();
                my.bluebeesProjectiles.splice(my.bluebeesProjectiles.indexOf(projectile), 1);
            }
        });
    }

    emitBullet() {
        let my = this.my;
        this.sound.play('laser', {
            volume: 0.5 
         });
        let bullet = this.add.sprite(my.sprite.bunny.x, my.sprite.bunny.y, "bullet");
        bullet.setScale(1.5);
        my.bullets.push(bullet);
    }

    emitBeesProjectile(bees) {
        let my = this.my;
        let projectile = this.add.sprite(bees.x, bees.y, "shoot");
        projectile.setScale(3);
        projectile.flipY = true;
        my.beesProjectiles.push(projectile);
    }

    emitBlueBeesProjectile(bees) {
        let my = this.my;
        let projectile = this.add.sprite(bees.x, bees.y, "blueshoot");
        projectile.setScale(4);
        my.bluebeesProjectiles.push(projectile);
    }

    gameOver() {
        let my = this.my;
        this.sound.stopByKey('background_music');
        this.sound.stopByKey('buzz');

        this.sound.play('game_over'); // end game music

        // Reset all vars
        my.bullets = [];
        my.bee_enemies = [];
        my.beesProjectiles = [];
        my.bluebee_enemies = [];
        my.bluebeesProjectiles = [];

        if (this.highscore < this.score){
            this.highscore = this.score;
        }

        //console.log(this.highscore);

        this.lives = 5;
        this.currentWave = 0;
        this.bCount = 1
        this.score = 0;

        this.waves = [
            { beeCount: this.bCount } // Define initial wave (Level 1)
        ];

        this.scene.start('GameOver'); 
    }
}
