class Shooter extends Phaser.Scene {
    constructor() {
        super('sceneName');
        this.my = { sprite: {}, bullets: [], enemies: [], enemyProjectiles: [] }; // Initialize arrays
        this.alienX = 400;
        this.alienY = 700;
        this.emitMode = false;
        this.score = 0;
        this.lives = 5; // Initialize lives
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
            27, 193, 137, 117, 284, 170, 425, 140, 541, 178, 657, 132, 784, 171
        ];
        this.curve = new Phaser.Curves.Spline(this.points);
        //this.initializePath();

        // Create enemies
        this.createEnemies();

        // Create text for displaying score
        this.scoreText = this.add.text(600, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        // Create text for displaying lives
        this.livesText = this.add.text(16, 16, 'Lives: 5', { fontSize: '32px', fill: '#fff' });
    }

    createEnemies() {
        let my = this.my;
    
        // Create multiple enemies
        for (let i = 0; i < 5; i++) {
            // Randomize starting position for each enemy
            let startX = Phaser.Math.Between(0, 100);
            let startY = Phaser.Math.Between(100, 400);
    
            // Create enemy sprite
            let enemy = this.add.follower(this.curve, startX, startY, "bee");
            enemy.visible = true;
            my.enemies.push(enemy);
    
            // Set up movement along the path
            let speed = Phaser.Math.Between(2000, 4000); // Randomize speed
            enemy.startFollow({
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

        // Schedule enemy projectiles to emit every 3 seconds
        let projectileTimer = this.time.addEvent({
            delay: 3000, // Emit every 3 seconds
            callback: () => {
                this.emitEnemyProjectile(enemy);
            },
            loop: true
        });

        // Store reference to the timer event
        enemy.projectileTimer = projectileTimer;
        }
    }

    destroyEnemy(enemy) {
        let my = this.my;
    
        // Cancel the timer event associated with this enemy
        if (enemy.projectileTimer) {
            enemy.projectileTimer.destroy();
        }
    
        // Remove the enemy from the enemies array
        my.enemies.splice(my.enemies.indexOf(enemy), 1);
    
        // Destroy the enemy sprite
        enemy.destroy();
    }
    

    update() {
        let my = this.my;

        // Update enemies
        my.enemies.forEach(enemy => {
            if (!enemy.active) return;
            // Update enemy movement or behavior here
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
                // Check for collision with enemies
                my.enemies.forEach(enemy => {
                    if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), enemy.getBounds())) {
                        bullet.destroy();
                        my.bullets.splice(my.bullets.indexOf(bullet), 1);
                        this.destroyEnemy(enemy); // Destroy the enemy
                        this.score += 25; // Increase score
                        this.scoreText.setText('Score: ' + this.score); // Update score text
                    }
                });
            }
        });

        // Check for collision with enemy projectiles
        my.enemyProjectiles.forEach(projectile => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(my.sprite.alien.getBounds(), projectile.getBounds())) {
                projectile.destroy();
                my.enemyProjectiles.splice(my.enemyProjectiles.indexOf(projectile), 1);
                this.lives--; // Decrease lives
                this.livesText.setText('Lives: ' + this.lives); // Update lives text
                if (this.lives <= 0) {
                    this.scene.start('GameOver');
                }
            }
        });

        // Update enemy projectiles
        my.enemyProjectiles.forEach(projectile => {
            // Slowly float towards the alien
            let pathX = Phaser.Math.Between(0, 800);
            let pathY = 850;
            let angle = Phaser.Math.Angle.Between(projectile.x, projectile.y, pathX, pathY);
            let velocityX = Math.cos(angle) * 4;
            let velocityY = Math.sin(angle) * 4;
            projectile.x += velocityX;
            projectile.y += velocityY;

            if (projectile.y >= 800) {
                projectile.destroy();
                my.enemyProjectiles.splice(my.enemyProjectiles.indexOf(projectile), 1);
            }
        });
    }

    emitBullet() {
        let my = this.my;
        let bullet = this.add.sprite(my.sprite.alien.x, my.sprite.alien.y, "slime");
        bullet.setScale(0.4);
        my.bullets.push(bullet);
    }

    emitEnemyProjectile(enemy) {
        let my = this.my;
        let projectile = this.add.sprite(enemy.x, enemy.y, "spinner");
        projectile.setScale(0.4);
        my.enemyProjectiles.push(projectile);
    }
}
