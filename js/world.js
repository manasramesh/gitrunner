// World generation and obstacles
class Obstacle {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // 'spike', 'barrier', 'gap'
        this.passed = false;
    }

    update(deltaTime, scrollSpeed) {
        this.x -= scrollSpeed * deltaTime;
    }

    render(ctx) {
        ctx.save();
        
        if (this.type === 'spike') {
            // GitHub themed: Merge Conflict Warnings
            ctx.fillStyle = '#FF006E';
            ctx.shadowColor = '#FF006E';
            ctx.shadowBlur = 15;
            
            // Draw larger, more visible spikes
            const spikeCount = Math.floor(this.width / 20);
            for (let i = 0; i < spikeCount; i++) {
                const spikeX = this.x + i * 20;
                const spikeTop = this.y;
                const spikeBottom = this.y + this.height;
                
                // Draw spike triangle
                ctx.beginPath();
                ctx.moveTo(spikeX, spikeBottom);
                ctx.lineTo(spikeX + 10, spikeTop);
                ctx.lineTo(spikeX + 20, spikeBottom);
                ctx.closePath();
                ctx.fill();
                
                // Warning symbol with background
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(spikeX + 10, spikeTop + this.height / 2, 6, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#FFD700';
                ctx.shadowBlur = 0;
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('!', spikeX + 10, spikeTop + this.height / 2);
                
                ctx.fillStyle = '#FF006E';
                ctx.shadowBlur = 15;
            }
            
            // Bottom line
            ctx.strokeStyle = '#CC0058';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.stroke();
            
        } else if (this.type === 'barrier') {
            // GitHub themed: Pull Request / Code Block
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
            gradient.addColorStop(0, '#B565FF');
            gradient.addColorStop(1, '#7B2CBF');
            
            ctx.fillStyle = gradient;
            ctx.shadowColor = '#B565FF';
            ctx.shadowBlur = 15;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Border
            ctx.strokeStyle = '#00F5FF';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            
            // Code lines decoration
            ctx.fillStyle = 'rgba(0, 245, 255, 0.3)';
            for (let i = 0; i < this.height; i += 12) {
                ctx.fillRect(this.x + 4, this.y + i, this.width - 8, 2);
            }
            
            // PR label
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#000000';
            ctx.fillRect(this.x + this.width / 2 - 15, this.y + this.height / 2 - 10, 30, 20);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('PR', this.x + this.width / 2, this.y + this.height / 2);
            
            // Git merge arrows
            ctx.strokeStyle = '#00F5FF';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#00F5FF';
            
            const arrowY = this.y + this.height - 12;
            ctx.beginPath();
            ctx.moveTo(this.x + 6, arrowY);
            ctx.lineTo(this.x + this.width - 6, arrowY);
            ctx.stroke();
            
            // Arrow head
            ctx.beginPath();
            ctx.moveTo(this.x + this.width - 12, arrowY - 4);
            ctx.lineTo(this.x + this.width - 6, arrowY);
            ctx.lineTo(this.x + this.width - 12, arrowY + 4);
            ctx.stroke();
            
        } else if (this.type === 'gap') {
            // Draw gap (visual indicator)
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Warning stripes
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 10]);
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.setLineDash([]);
        }
        
        ctx.restore();
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    checkCollision(player, hasShield) {
        if (hasShield) return false;
        
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.collected = false;
        this.rotation = 0;
        this.bobOffset = 0;
    }

    update(deltaTime, scrollSpeed) {
        this.x -= scrollSpeed * deltaTime;
        this.rotation += 5 * deltaTime;
        this.bobOffset += 3 * deltaTime;
    }

    render(ctx) {
        if (this.collected) return;
        
        const bobY = this.y + Math.sin(this.bobOffset) * 5;
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, bobY + this.height / 2);
        ctx.rotate(this.rotation);
        
        // Draw coin
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner circle
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    checkCollision(player, magnetRadius = 0) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(centerX - playerCenterX, 2) + 
            Math.pow(centerY - playerCenterY, 2)
        );
        
        return distance < (this.width / 2 + player.width / 2 + magnetRadius);
    }
}

class World {
    constructor(canvas) {
        this.canvas = canvas;
        this.obstacles = [];
        this.coins = [];
        this.distance = 0;
        this.scrollSpeed = 150; // Pixels per second - Slower, more comfortable start
        this.baseSpeed = 150;
        this.speedIncrease = 5; // Gradual increase per checkpoint
        this.maxSpeed = 400; // Speed cap for playability
        this.lastObstacleX = 0;
        this.minObstacleDistance = 325; // Based on reaction time formula
        this.maxObstacleDistance = 585;
        
        // Biome system
        this.biomes = ['cyber', 'forest', 'void'];
        this.currentBiome = 0;
        this.nextBiomeDistance = 2500;
        
        // Background layers for parallax
        this.bgLayers = [
            { offset: 0, speed: 0.2, color: '#1a1a2e' },
            { offset: 0, speed: 0.5, color: '#16213e' },
            { offset: 0, speed: 1.0, color: '#0f3460' }
        ];
    }

    update(deltaTime, checkpoints) {
        // Increase speed based on checkpoints with cap
        this.scrollSpeed = Math.min(this.maxSpeed, this.baseSpeed + (checkpoints * this.speedIncrease));
        
        // Update distance
        this.distance += this.scrollSpeed * deltaTime;
        
        // Update background parallax
        for (const layer of this.bgLayers) {
            layer.offset -= this.scrollSpeed * layer.speed * deltaTime;
            if (layer.offset < -this.canvas.width) {
                layer.offset = 0;
            }
        }
        
        // Change biome
        if (this.distance >= this.nextBiomeDistance) {
            this.currentBiome = (this.currentBiome + 1) % this.biomes.length;
            this.nextBiomeDistance += 2500;
        }
        
        // Spawn obstacles
        this.spawnObstacles();
        
        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.update(deltaTime, this.scrollSpeed);
            
            if (obstacle.isOffScreen()) {
                this.obstacles.splice(i, 1);
            }
        }
        
        // Update coins
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            coin.update(deltaTime, this.scrollSpeed);
            
            if (coin.isOffScreen() || coin.collected) {
                this.coins.splice(i, 1);
            }
        }
    }

    spawnObstacles() {
        // Dynamic spacing based on current speed (reaction time formula)
        const currentMinDistance = Math.max(325, this.scrollSpeed * 1.5 + 100);
        
        if (this.distance - this.lastObstacleX < currentMinDistance) {
            return;
        }
        
        const x = this.canvas.width + 50;
        
        // Spawn pattern based on difficulty
        const difficulty = this.getDifficultyLevel();
        
        if (difficulty === 0) {
            // Easy: single obstacles only
            this.spawnSingleObstacle(x, difficulty);
        } else if (difficulty === 1) {
            // Medium: mostly single, some pairs
            if (Math.random() < 0.7) {
                this.spawnSingleObstacle(x, difficulty);
            } else {
                this.spawnPair(x, difficulty);
            }
        } else if (difficulty === 2) {
            // Hard: mixed patterns
            const rand = Math.random();
            if (rand < 0.5) {
                this.spawnSingleObstacle(x, difficulty);
            } else if (rand < 0.8) {
                this.spawnPair(x, difficulty);
            } else {
                this.spawnComplexPattern(x, difficulty);
            }
        } else {
            // Expert: all patterns
            const rand = Math.random();
            if (rand < 0.3) {
                this.spawnSingleObstacle(x, difficulty);
            } else if (rand < 0.6) {
                this.spawnPair(x, difficulty);
            } else {
                this.spawnComplexPattern(x, difficulty);
            }
        }
        
        // Spawn coins
        this.spawnCoins(x);
        
        this.lastObstacleX = this.distance;
    }
    
    getDifficultyLevel() {
        // Based on checkpoints, not distance
        const checkpoints = Math.floor(this.distance / 1000);
        
        if (checkpoints <= 3) return 0; // Level 1: Easy
        if (checkpoints <= 7) return 1; // Level 2: Medium
        if (checkpoints <= 12) return 2; // Level 3: Hard
        return 3; // Level 4: Expert
    }

    spawnSingleObstacle(x, difficulty) {
        const types = ['spike', 'barrier'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        // Progressive sizing based on difficulty (all jumpable with 120px max jump)
        let spikeHeight, barrierHeightMin, barrierHeightMax;
        
        if (difficulty === 0) {
            // Level 1: Easy (checkpoints 0-3)
            spikeHeight = 16;
            barrierHeightMin = 32;
            barrierHeightMax = 48;
        } else if (difficulty === 1) {
            // Level 2: Medium (checkpoints 4-7)
            spikeHeight = 20;
            barrierHeightMin = 48;
            barrierHeightMax = 64;
        } else if (difficulty === 2) {
            // Level 3: Hard (checkpoints 8-12)
            spikeHeight = 24;
            barrierHeightMin = 64;
            barrierHeightMax = 80;
        } else {
            // Level 4: Expert (checkpoints 13+)
            spikeHeight = 28;
            barrierHeightMin = 80;
            barrierHeightMax = 100;
        }
        
        if (type === 'spike') {
            const obstacle = new Obstacle(x, this.canvas.height - spikeHeight, 48, spikeHeight, 'spike');
            this.obstacles.push(obstacle);
        } else {
            const height = barrierHeightMin + Math.floor(Math.random() * (barrierHeightMax - barrierHeightMin + 1));
            const obstacle = new Obstacle(x, this.canvas.height - height, 32, height, 'barrier');
            this.obstacles.push(obstacle);
        }
    }

    spawnPair(x, difficulty) {
        // Ground spike + barrier with progressive sizing
        let spikeHeight, barrierHeight;
        
        if (difficulty === 0) {
            spikeHeight = 16;
            barrierHeight = 40;
        } else if (difficulty === 1) {
            spikeHeight = 20;
            barrierHeight = 56;
        } else if (difficulty === 2) {
            spikeHeight = 24;
            barrierHeight = 72;
        } else {
            spikeHeight = 28;
            barrierHeight = 90;
        }
        
        const spike = new Obstacle(x, this.canvas.height - spikeHeight, 48, spikeHeight, 'spike');
        const barrier = new Obstacle(x + 150, this.canvas.height - barrierHeight, 32, barrierHeight, 'barrier');
        this.obstacles.push(spike, barrier);
    }

    spawnComplexPattern(x, difficulty) {
        // Create challenging patterns with progressive sizing
        const pattern = Math.floor(Math.random() * 3);
        
        let spikeHeight, highBarrier, lowBarrier;
        
        if (difficulty === 0 || difficulty === 1) {
            spikeHeight = 16;
            highBarrier = 56;
            lowBarrier = 40;
        } else if (difficulty === 2) {
            spikeHeight = 24;
            highBarrier = 76;
            lowBarrier = 52;
        } else {
            spikeHeight = 28;
            highBarrier = 96;
            lowBarrier = 64;
        }
        
        if (pattern === 0) {
            // Triple spike pattern
            for (let i = 0; i < 3; i++) {
                const spike = new Obstacle(x + i * 70, this.canvas.height - spikeHeight, 32, spikeHeight, 'spike');
                this.obstacles.push(spike);
            }
        } else if (pattern === 1) {
            // High-low barriers
            const high = new Obstacle(x, this.canvas.height - highBarrier, 32, highBarrier, 'barrier');
            const low = new Obstacle(x + 100, this.canvas.height - lowBarrier, 32, lowBarrier, 'barrier');
            this.obstacles.push(high, low);
        } else {
            // Mixed pattern
            const spike = new Obstacle(x, this.canvas.height - spikeHeight, 48, spikeHeight, 'spike');
            const barrier = new Obstacle(x + 140, this.canvas.height - lowBarrier + 12, 32, lowBarrier, 'barrier');
            this.obstacles.push(spike, barrier);
        }
    }

    spawnCoins(x) {
        // Spawn coin patterns at reachable heights
        const coinCount = 3 + Math.floor(Math.random() * 3);
        const pattern = Math.random();
        const baseY = 450; // Reachable height (ground at 568, player can jump ~120px up)
        
        if (pattern < 0.5) {
            // Line pattern
            for (let i = 0; i < coinCount; i++) {
                const coin = new Coin(x + i * 40, baseY);
                this.coins.push(coin);
            }
        } else {
            // Arc pattern (jump-friendly)
            for (let i = 0; i < coinCount; i++) {
                const angle = (i / (coinCount - 1)) * Math.PI;
                const coin = new Coin(
                    x + i * 40,
                    baseY - Math.sin(angle) * 80 // Arc up to 80px
                );
                this.coins.push(coin);
            }
        }
    }

    renderBackground(ctx) {
        // GitHub themed biome colors (dark mode inspired)
        const biomeColors = {
            'cyber': ['#0d1117', '#161b22', '#21262d'],      // GitHub dark
            'forest': ['#0a3d2e', '#0d4a39', '#106548'],     // Green (commits)
            'void': ['#1a1625', '#2d1b3d', '#3d2755']        // Purple (branches)
        };
        
        const colors = biomeColors[this.biomes[this.currentBiome]];
        
        // Draw parallax layers
        for (let i = 0; i < this.bgLayers.length; i++) {
            const layer = this.bgLayers[i];
            ctx.fillStyle = colors[i];
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Add GitHub-style code dots/stars (representing commits)
            ctx.fillStyle = 'rgba(0, 245, 255, 0.3)';
            for (let j = 0; j < 20; j++) {
                const x = (layer.offset + j * 40) % this.canvas.width;
                const y = (j * 37) % (this.canvas.height - 100);
                
                // Draw as small circles (commit dots)
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Occasional git branch line
                if (j % 5 === 0) {
                    ctx.strokeStyle = 'rgba(181, 101, 255, 0.2)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + 30, y - 15);
                    ctx.stroke();
                }
            }
        }
        
        // Draw ground (code terminal style)
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, this.canvas.height - 32, this.canvas.width, 32);
        
        // Ground line (terminal prompt style)
        ctx.strokeStyle = '#00F5FF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height - 32);
        ctx.lineTo(this.canvas.width, this.canvas.height - 32);
        ctx.stroke();
        
        // Add terminal prompt symbols
        ctx.fillStyle = '#00F5FF';
        ctx.font = 'bold 12px monospace';
        for (let i = 0; i < this.canvas.width; i += 100) {
            ctx.fillText('$', i + 10, this.canvas.height - 10);
        }
    }

    render(ctx) {
        // Render obstacles
        for (const obstacle of this.obstacles) {
            obstacle.render(ctx);
        }
        
        // Render coins
        for (const coin of this.coins) {
            coin.render(ctx);
        }
    }

    checkCollisions(player, hasShield) {
        // Check obstacle collisions
        for (const obstacle of this.obstacles) {
            if (obstacle.checkCollision(player, hasShield)) {
                return { type: 'obstacle', object: obstacle };
            }
        }
        
        return null;
    }

    checkCoinCollisions(player, magnetRadius = 0) {
        const collected = [];
        
        for (const coin of this.coins) {
            if (!coin.collected && coin.checkCollision(player, magnetRadius)) {
                coin.collected = true;
                collected.push(coin);
            }
        }
        
        return collected;
    }

    reset() {
        this.obstacles = [];
        this.coins = [];
        this.distance = 0;
        this.scrollSpeed = 150; // Reset to comfortable start speed
        this.lastObstacleX = 0;
        this.currentBiome = 0;
        this.nextBiomeDistance = 2500;
        for (const layer of this.bgLayers) {
            layer.offset = 0;
        }
    }
}

