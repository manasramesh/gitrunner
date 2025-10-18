// Game Engine - Core game loop and state management
class GameEngine {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('game-canvas');
        this.bgCanvas = document.getElementById('background-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.bgCtx = this.bgCanvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Game systems
        this.particles = new ParticleSystem();
        this.screenShake = new ScreenShake();
        this.audio = new AudioSystem();
        this.gitChallenge = new GitChallengeSystem();
        this.powerupManager = new PowerUpManager();
        this.world = new World(this.canvas);
        this.player = new Player(100, 400);
        this.ui = new UIManager(this.gitChallenge);
        
        // Game state
        this.state = 'MENU'; // MENU, PLAYING, CHECKPOINT, PAUSED, GAME_OVER
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('gitRunnerHighScore')) || 0;
        this.lives = 3;
        this.checkpoints = 0;
        this.nextCheckpoint = 500;
        this.checkpointInterval = 1000;
        this.coins = 0;
        this.combo = 0;
        this.maxCombo = 5;
        
        // Challenge state
        this.challengeTimer = 15;
        this.challengeMaxTime = 15;
        this.currentChallenge = null;
        
        // Input handling
        this.keys = {};
        this.setupInput();
        
        // Timing
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.fpsTimer = 0;
        
        // Achievement tracking
        this.achievementTracker = {
            firstCheckpoint: false,
            first1000: false,
            first5000: false,
            perfectStreak: 0
        };
    }

    resizeCanvas() {
        const maxWidth = 800;
        const maxHeight = 600;
        const scale = Math.min(
            (window.innerWidth - 40) / maxWidth,
            (window.innerHeight - 100) / maxHeight,
            1
        );
        
        this.canvas.width = maxWidth;
        this.canvas.height = maxHeight;
        this.bgCanvas.width = maxWidth;
        this.bgCanvas.height = maxHeight;
        
        this.canvas.style.width = `${maxWidth * scale}px`;
        this.canvas.style.height = `${maxHeight * scale}px`;
        this.bgCanvas.style.width = `${maxWidth * scale}px`;
        this.bgCanvas.style.height = `${maxHeight * scale}px`;
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Prevent default for game controls
            if (['Space', 'ArrowUp', 'ArrowDown', 'KeyW', 'KeyS'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mobile touch controls
        let touchStartY = 0;
        let touchStartTime = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            
            // Detect double tap for dash
            if (this.lastTapTime && Date.now() - this.lastTapTime < 300) {
                this.keys['Space'] = true;
                this.player.dash();
                this.audio.playDash();
                this.particles.emitDashParticles(this.player.x, this.player.y + this.player.height / 2);
            }
            this.lastTapTime = Date.now();
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchEndY = e.changedTouches[0].clientY;
            const touchDuration = Date.now() - touchStartTime;
            const deltaY = touchEndY - touchStartY;
            
            if (touchDuration < 200) {
                if (Math.abs(deltaY) < 30) {
                    // Tap = jump
                    this.keys['Space'] = true;
                    setTimeout(() => this.keys['Space'] = false, 100);
                } else if (deltaY < -30) {
                    // Swipe up = jump
                    this.keys['Space'] = true;
                    setTimeout(() => this.keys['Space'] = false, 100);
                } else if (deltaY > 30) {
                    // Swipe down = slide
                    this.keys['ArrowDown'] = true;
                    setTimeout(() => this.keys['ArrowDown'] = false, 200);
                }
            }
        });
    }

    startGame() {
        this.audio.resume();
        this.resetGame();
        this.state = 'PLAYING';
        this.ui.hideMenu();
        this.ui.hideGameOver();
        this.ui.hidePause();
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.checkpoints = 0;
        this.nextCheckpoint = 500;
        this.coins = 0;
        this.combo = 0;
        this.player.reset(100, 400);
        this.world.reset();
        this.powerupManager.reset();
        this.particles.clear();
        this.gitChallenge.reset();
        this.achievementTracker.perfectStreak = 0;
        
        this.ui.updateScore(this.score);
        this.ui.updateHighScore(this.highScore);
        this.ui.updateLives(this.lives);
        this.ui.updateNextCheckpoint(this.nextCheckpoint);
    }

    pause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.ui.showPause();
        }
    }

    resume() {
        if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.ui.hidePause();
            this.lastTime = performance.now();
        }
    }

    restart() {
        this.startGame();
    }

    quitToMenu() {
        this.state = 'MENU';
        this.ui.hideGameOver();
        this.ui.hidePause();
        this.ui.hideChallenge();
        this.ui.showMenu();
    }

    gameLoop(currentTime) {
        if (this.state === 'MENU' || this.state === 'GAME_OVER') {
            return;
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
        
        // Calculate delta time
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;
        
        // Update FPS counter
        this.frameCount++;
        this.fpsTimer += deltaTime;
        if (this.fpsTimer >= 1) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
        }
        
        // Update based on state
        if (this.state === 'PLAYING') {
            this.updatePlaying(deltaTime);
        } else if (this.state === 'CHECKPOINT') {
            this.updateCheckpoint(deltaTime);
        } else if (this.state === 'PAUSED') {
            return; // Don't update game when paused
        }
        
        // Render
        this.render();
    }

    updatePlaying(deltaTime) {
        // Handle input
        this.player.handleInput(this.keys, performance.now() / 1000);
        
        // Check for jump/dash actions (for particles and sound)
        if (this.keys['Space'] && !this.keys.jumpPressed) {
            if (this.player.jump()) {
                this.audio.playJump();
                this.particles.emitJumpParticles(this.player.x, this.player.y + this.player.height);
            }
        }
        
        // Update game systems
        this.player.update(deltaTime);
        this.world.update(deltaTime, this.checkpoints);
        this.powerupManager.update(deltaTime, this.world.scrollSpeed, this.world.distance);
        this.particles.update(deltaTime);
        this.screenShake.update(deltaTime);
        
        // Trail particles
        this.player.trailTimer += deltaTime;
        if (this.player.trailTimer >= this.player.trailInterval && this.player.isGrounded) {
            this.particles.emitTrailParticle(this.player.x, this.player.y + this.player.height);
            this.player.trailTimer = 0;
        }
        
        // Update score
        const scoreMultiplier = this.powerupManager.isActive('multiplier') ? 2 : 1;
        this.score += (this.world.scrollSpeed / 10) * deltaTime * scoreMultiplier;
        this.ui.updateScore(this.score);
        
        // Check for checkpoint
        if (this.score >= this.nextCheckpoint) {
            this.reachCheckpoint();
        }
        
        // Check powerup collisions
        const hasShield = this.powerupManager.isActive('shield');
        const collectedPowerup = this.powerupManager.checkCollisions(this.player);
        if (collectedPowerup) {
            this.audio.playPowerup();
            this.particles.emitPowerupParticles(
                collectedPowerup.x + collectedPowerup.width / 2,
                collectedPowerup.y + collectedPowerup.height / 2,
                collectedPowerup.colors[collectedPowerup.type]
            );
        }
        
        // Check coin collisions
        const magnetRadius = this.powerupManager.isActive('magnet') ? 150 : 0;
        const collectedCoins = this.world.checkCoinCollisions(this.player, magnetRadius);
        if (collectedCoins.length > 0) {
            collectedCoins.forEach(coin => {
                this.audio.playCoin();
                this.particles.emitCoinParticles(coin.x, coin.y);
                this.score += 10 * scoreMultiplier;
                this.coins++;
            });
        }
        
        // Check obstacle collisions
        const collision = this.world.checkCollisions(this.player, hasShield);
        if (collision) {
            this.handleCollision();
        }
        
        // Update UI
        this.ui.updatePowerupIndicator(this.powerupManager.getActivePowerupInfo());
        
        // Check achievements
        this.checkAchievements();
    }

    updateCheckpoint(deltaTime) {
        this.challengeTimer -= deltaTime;
        this.ui.updateTimer(this.challengeTimer);
        
        // Play timer tick sound when < 5 seconds
        if (this.challengeTimer <= 5 && Math.floor(this.challengeTimer) !== Math.floor(this.challengeTimer + deltaTime)) {
            this.audio.playTimerTick();
        }
        
        // Timeout
        if (this.challengeTimer <= 0) {
            this.audio.playWrong();
            this.loseLife();
            this.ui.showFeedback(false, "Time's up! -1 Life");
            
            setTimeout(() => {
                this.resumeFromCheckpoint();
            }, 1500);
        }
    }

    reachCheckpoint() {
        this.checkpoints++;
        this.nextCheckpoint += this.checkpointInterval;
        this.audio.playCheckpoint();
        
        // Show git challenge
        this.state = 'CHECKPOINT';
        this.currentChallenge = this.gitChallenge.getNextChallenge(this.checkpoints);
        this.challengeTimer = this.challengeMaxTime;
        this.ui.showChallenge(this.currentChallenge, this.checkpoints);
        this.ui.updateNextCheckpoint(this.nextCheckpoint);
        
        // Track achievement
        if (!this.achievementTracker.firstCheckpoint) {
            this.achievementTracker.firstCheckpoint = true;
            this.ui.showAchievement('First Checkpoint!');
        }
    }

    submitCommand() {
        const input = document.getElementById('command-input').value;
        const isCorrect = this.gitChallenge.validateAnswer(input);
        
        if (isCorrect) {
            this.audio.playCorrect();
            this.score += this.currentChallenge.points;
            this.achievementTracker.perfectStreak++;
            
            // Grant random powerup
            const powerupType = this.powerupManager.grantRandomPowerUp();
            const powerup = new PowerUp(0, 0, powerupType);
            
            this.ui.showFeedback(true, `Perfect! +${this.currentChallenge.points} points + ${powerup.icons[powerupType]} Power-up!`);
            
            // Check for perfect streak achievement
            if (this.achievementTracker.perfectStreak === 5) {
                setTimeout(() => {
                    this.ui.showAchievement('Git Wizard! 5 in a row!');
                }, 1600);
            }
            
            setTimeout(() => {
                this.resumeFromCheckpoint();
            }, 1500);
        } else {
            this.audio.playWrong();
            this.loseLife();
            this.achievementTracker.perfectStreak = 0;
            this.ui.showFeedback(false, 'Incorrect! -1 Life');
            
            setTimeout(() => {
                this.resumeFromCheckpoint();
            }, 1500);
        }
    }

    loseLife() {
        this.lives--;
        this.ui.updateLives(this.lives);
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    handleCollision() {
        this.audio.playCollision();
        this.screenShake.shake(10, 0.3);
        this.particles.emitExplosionParticles(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2
        );
        
        this.loseLife();
        
        if (this.lives > 0) {
            // Brief invincibility and reset position
            this.powerupManager.activatePowerUp('shield');
            this.player.reset(100, 400);
        }
    }

    resumeFromCheckpoint() {
        this.ui.hideChallenge();
        this.state = 'PLAYING';
        this.lastTime = performance.now();
    }

    gameOver() {
        this.state = 'GAME_OVER';
        
        // Update high score
        const isNewRecord = this.score > this.highScore;
        if (isNewRecord) {
            this.highScore = this.score;
            localStorage.setItem('gitRunnerHighScore', Math.floor(this.highScore));
            this.ui.updateHighScore(this.highScore);
        }
        
        // Show game over screen
        const stats = this.gitChallenge.getStats();
        this.ui.showGameOver({
            score: this.score,
            checkpoints: this.checkpoints,
            coins: this.coins,
            challengesCorrect: stats.correct,
            challengesTotal: stats.total
        }, isNewRecord);
    }

    checkAchievements() {
        if (!this.achievementTracker.first1000 && this.score >= 1000) {
            this.achievementTracker.first1000 = true;
            this.ui.showAchievement('First 1000 points!');
        }
        
        if (!this.achievementTracker.first5000 && this.score >= 5000) {
            this.achievementTracker.first5000 = true;
            this.ui.showAchievement('Legendary! 5000 points!');
        }
    }

    render() {
        // Render background (separate canvas for performance)
        this.world.renderBackground(this.bgCtx);
        
        // Clear main canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply screen shake
        this.ctx.save();
        this.screenShake.apply(this.ctx);
        
        // Render game objects
        this.world.render(this.ctx);
        this.powerupManager.render(this.ctx);
        this.player.render(this.ctx, this.powerupManager.isActive('shield'));
        this.particles.render(this.ctx);
        
        this.ctx.restore();
        
        // Debug: FPS counter (optional)
        // this.ctx.fillStyle = '#fff';
        // this.ctx.font = '12px monospace';
        // this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
    }
}

