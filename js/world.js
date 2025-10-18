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
            // Draw spikes
            ctx.fillStyle = '#FF006E';
            ctx.shadowColor = '#FF006E';
            ctx.shadowBlur = 10;
            
            // Draw triangular spikes
            const spikeCount = Math.floor(this.width / 16);
            for (let i = 0; i < spikeCount; i++) {
                ctx.beginPath();
                ctx.moveTo(this.x + i * 16, this.y + this.height);
                ctx.lineTo(this.x + i * 16 + 8, this.y);
                ctx.lineTo(this.x + i * 16 + 16, this.y + this.height);
                ctx.closePath();
                ctx.fill();
            }
        } else if (this.type === 'barrier') {
            // Draw barrier
            ctx.fillStyle = '#B565FF';
            ctx.shadowColor = '#B565FF';
            ctx.shadowBlur = 10;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Add stripes
            ctx.fillStyle = '#7B2CBF';
            for (let i = 0; i < this.height; i += 8) {
                ctx.fillRect(this.x, this.y + i, this.width, 4);
            }
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
        this.scrollSpeed = 300; // Pixels per second
        this.baseSpeed = 300;
        this.lastObstacleX = 0;
        this.minObstacleDistance = 200;
        this.maxObstacleDistance = 400;
        
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
        // Increase speed based on checkpoints
        this.scrollSpeed = this.baseSpeed + (checkpoints * 10);
        
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
        if (this.distance - this.lastObstacleX < this.minObstacleDistance) {
            return;
        }
        
        const x = this.canvas.width + 50;
        const difficulty = Math.floor(this.distance / 2000);
        
        // Spawn pattern based on difficulty
        if (difficulty === 0) {
            // Easy: single obstacles
            this.spawnSingleObstacle(x);
        } else if (difficulty === 1) {
            // Medium: pairs
            if (Math.random() < 0.6) {
                this.spawnSingleObstacle(x);
            } else {
                this.spawnPair(x);
            }
        } else {
            // Hard: complex patterns
            const rand = Math.random();
            if (rand < 0.4) {
                this.spawnSingleObstacle(x);
            } else if (rand < 0.7) {
                this.spawnPair(x);
            } else {
                this.spawnComplexPattern(x);
            }
        }
        
        // Spawn coins
        this.spawnCoins(x);
        
        this.lastObstacleX = this.distance;
    }

    spawnSingleObstacle(x) {
        const types = ['spike', 'barrier'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (type === 'spike') {
            const obstacle = new Obstacle(x, 432 - 16, 48, 16, 'spike');
            this.obstacles.push(obstacle);
        } else {
            const height = 48 + Math.floor(Math.random() * 2) * 32;
            const obstacle = new Obstacle(x, 432 - height, 32, height, 'barrier');
            this.obstacles.push(obstacle);
        }
    }

    spawnPair(x) {
        // Ground spike + high barrier
        const spike = new Obstacle(x, 432 - 16, 48, 16, 'spike');
        const barrier = new Obstacle(x + 100, 432 - 80, 32, 80, 'barrier');
        this.obstacles.push(spike, barrier);
    }

    spawnComplexPattern(x) {
        // Create challenging patterns
        const pattern = Math.floor(Math.random() * 3);
        
        if (pattern === 0) {
            // Triple spike pattern
            for (let i = 0; i < 3; i++) {
                const spike = new Obstacle(x + i * 60, 432 - 16, 32, 16, 'spike');
                this.obstacles.push(spike);
            }
        } else if (pattern === 1) {
            // High-low barriers
            const high = new Obstacle(x, 432 - 96, 32, 96, 'barrier');
            const low = new Obstacle(x + 80, 432 - 48, 32, 48, 'barrier');
            this.obstacles.push(high, low);
        } else {
            // Mixed pattern
            const spike = new Obstacle(x, 432 - 16, 48, 16, 'spike');
            const barrier = new Obstacle(x + 120, 432 - 64, 32, 64, 'barrier');
            this.obstacles.push(spike, barrier);
        }
    }

    spawnCoins(x) {
        // Spawn coin patterns
        const coinCount = 3 + Math.floor(Math.random() * 3);
        const pattern = Math.random();
        
        if (pattern < 0.5) {
            // Line pattern
            for (let i = 0; i < coinCount; i++) {
                const coin = new Coin(x + i * 40, 300);
                this.coins.push(coin);
            }
        } else {
            // Arc pattern
            for (let i = 0; i < coinCount; i++) {
                const angle = (i / (coinCount - 1)) * Math.PI;
                const coin = new Coin(
                    x + i * 40,
                    300 - Math.sin(angle) * 60
                );
                this.coins.push(coin);
            }
        }
    }

    renderBackground(ctx) {
        // Get biome colors
        const biomeColors = {
            'cyber': ['#1a1a2e', '#16213e', '#0f3460'],
            'forest': ['#0d3b2e', '#1a5f4a', '#2d8a6a'],
            'void': ['#2e1a1a', '#4a1f1f', '#6b2d2d']
        };
        
        const colors = biomeColors[this.biomes[this.currentBiome]];
        
        // Draw parallax layers
        for (let i = 0; i < this.bgLayers.length; i++) {
            const layer = this.bgLayers[i];
            ctx.fillStyle = colors[i];
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Add stars/particles
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let j = 0; j < 20; j++) {
                const x = (layer.offset + j * 40) % this.canvas.width;
                const y = (j * 37) % this.canvas.height;
                ctx.fillRect(x, y, 2, 2);
            }
        }
        
        // Draw ground
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 432, this.canvas.width, this.canvas.height - 432);
        
        // Ground line
        ctx.strokeStyle = '#00F5FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 432);
        ctx.lineTo(this.canvas.width, 432);
        ctx.stroke();
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
        this.scrollSpeed = this.baseSpeed;
        this.lastObstacleX = 0;
        this.currentBiome = 0;
        this.nextBiomeDistance = 2500;
        for (const layer of this.bgLayers) {
            layer.offset = 0;
        }
    }
}

