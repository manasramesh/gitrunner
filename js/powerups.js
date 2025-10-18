// Power-up System
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 32;
        this.height = 32;
        this.collected = false;
        this.bobOffset = 0;
        this.bobSpeed = 3;
        
        // Type-specific properties
        this.colors = {
            'shield': '#00F5FF',
            'magnet': '#FFD700',
            'slowmo': '#B565FF',
            'multiplier': '#FF006E'
        };
        
        this.icons = {
            'shield': '⚡',
            'magnet': '🧲',
            'slowmo': '⏰',
            'multiplier': '✨'
        };
        
        this.durations = {
            'shield': 5,
            'magnet': 8,
            'slowmo': 5,
            'multiplier': 10
        };
    }

    update(deltaTime, scrollSpeed) {
        // Move with world scroll
        this.x -= scrollSpeed * deltaTime;
        
        // Bobbing animation
        this.bobOffset += this.bobSpeed * deltaTime;
    }

    render(ctx) {
        const bobY = this.y + Math.sin(this.bobOffset) * 10;
        
        // Glow effect
        ctx.save();
        ctx.shadowColor = this.colors[this.type];
        ctx.shadowBlur = 20;
        
        // Draw powerup background
        ctx.fillStyle = this.colors[this.type];
        ctx.globalAlpha = 0.3;
        ctx.fillRect(this.x, bobY, this.width, this.height);
        
        // Draw icon
        ctx.globalAlpha = 1;
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icons[this.type], this.x + this.width / 2, bobY + this.height / 2);
        
        ctx.restore();
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    checkCollision(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}

class PowerUpManager {
    constructor() {
        this.powerups = [];
        this.activePowerups = new Map();
        this.spawnTimer = 0;
        this.spawnInterval = 5; // Spawn every 5-8 seconds
        this.minSpawnDistance = 300;
        this.lastSpawnX = 0;
    }

    update(deltaTime, scrollSpeed, worldDistance) {
        // Update spawn timer
        this.spawnTimer += deltaTime;
        
        // Spawn new power-ups
        if (this.spawnTimer >= this.spawnInterval && worldDistance - this.lastSpawnX > this.minSpawnDistance) {
            this.spawnPowerUp(worldDistance);
            this.spawnTimer = 0;
            this.spawnInterval = 5 + Math.random() * 3; // Random interval 5-8 seconds
        }
        
        // Update existing power-ups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            powerup.update(deltaTime, scrollSpeed);
            
            if (powerup.isOffScreen() || powerup.collected) {
                this.powerups.splice(i, 1);
            }
        }
        
        // Update active powerup timers
        for (const [type, data] of this.activePowerups.entries()) {
            data.timeLeft -= deltaTime;
            if (data.timeLeft <= 0) {
                this.activePowerups.delete(type);
            }
        }
    }

    spawnPowerUp(worldDistance) {
        const types = ['shield', 'magnet', 'slowmo', 'multiplier'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const x = worldDistance + 800; // Spawn ahead of player
        const y = 250 + Math.random() * 100; // Random height
        
        const powerup = new PowerUp(x, y, type);
        this.powerups.push(powerup);
        this.lastSpawnX = worldDistance;
    }

    checkCollisions(player) {
        for (const powerup of this.powerups) {
            if (!powerup.collected && powerup.checkCollision(player)) {
                this.activatePowerUp(powerup.type);
                powerup.collected = true;
                return powerup;
            }
        }
        return null;
    }

    activatePowerUp(type) {
        const powerup = new PowerUp(0, 0, type);
        this.activePowerups.set(type, {
            timeLeft: powerup.durations[type],
            maxTime: powerup.durations[type]
        });
    }

    grantRandomPowerUp() {
        const types = ['shield', 'magnet', 'slowmo', 'multiplier'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.activatePowerUp(type);
        return type;
    }

    isActive(type) {
        return this.activePowerups.has(type);
    }

    getActiveTimeLeft(type) {
        const data = this.activePowerups.get(type);
        return data ? data.timeLeft : 0;
    }

    getActivePowerupInfo() {
        if (this.activePowerups.size === 0) return null;
        
        // Return the most recent active powerup
        const entries = Array.from(this.activePowerups.entries());
        const [type, data] = entries[entries.length - 1];
        
        const powerup = new PowerUp(0, 0, type);
        return {
            type,
            icon: powerup.icons[type],
            timeLeft: Math.ceil(data.timeLeft),
            color: powerup.colors[type]
        };
    }

    render(ctx) {
        for (const powerup of this.powerups) {
            if (!powerup.collected) {
                powerup.render(ctx);
            }
        }
    }

    reset() {
        this.powerups = [];
        this.activePowerups.clear();
        this.spawnTimer = 0;
        this.lastSpawnX = 0;
    }
}

