// Particle System for visual effects
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.pool = []; // Object pooling for performance
        this.maxParticles = 500;
    }

    createParticle(x, y, vx, vy, color, life, size = 3, gravity = 0) {
        let particle;
        if (this.pool.length > 0) {
            particle = this.pool.pop();
            particle.x = x;
            particle.y = y;
            particle.vx = vx;
            particle.vy = vy;
            particle.color = color;
            particle.life = life;
            particle.maxLife = life;
            particle.size = size;
            particle.gravity = gravity;
            particle.alpha = 1;
        } else {
            particle = {
                x, y, vx, vy, color, life, maxLife: life, size, gravity, alpha: 1
            };
        }
        
        if (this.particles.length < this.maxParticles) {
            this.particles.push(particle);
        }
        
        return particle;
    }

    // Jump particles
    emitJumpParticles(x, y) {
        const colors = ['#00F5FF', '#B565FF', '#FF006E'];
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI;
            const speed = Math.random() * 100 + 50;
            this.createParticle(
                x,
                y,
                Math.cos(angle) * speed,
                -Math.sin(angle) * speed,
                colors[Math.floor(Math.random() * colors.length)],
                0.5,
                Math.random() * 4 + 2,
                500
            );
        }
    }

    // Dash particles
    emitDashParticles(x, y) {
        const colors = ['#FFD700', '#FF006E', '#00F5FF'];
        for (let i = 0; i < 15; i++) {
            const angle = Math.PI + (Math.random() - 0.5) * Math.PI / 2;
            const speed = Math.random() * 200 + 100;
            this.createParticle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                colors[Math.floor(Math.random() * colors.length)],
                0.8,
                Math.random() * 6 + 3,
                0
            );
        }
    }

    // Collision/death particles
    emitExplosionParticles(x, y) {
        const colors = ['#FF006E', '#FFD700', '#FF4500'];
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 150 + 100;
            this.createParticle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                colors[Math.floor(Math.random() * colors.length)],
                1.0,
                Math.random() * 5 + 3,
                300
            );
        }
    }

    // Coin collect particles
    emitCoinParticles(x, y) {
        const colors = ['#FFD700', '#FFA500'];
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 100 + 50;
            this.createParticle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                colors[Math.floor(Math.random() * colors.length)],
                0.6,
                Math.random() * 3 + 2,
                200
            );
        }
    }

    // Power-up collect particles
    emitPowerupParticles(x, y, color) {
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 120 + 80;
            this.createParticle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                color,
                0.8,
                Math.random() * 4 + 2,
                150
            );
        }
    }

    // Trail particles for running
    emitTrailParticle(x, y) {
        this.createParticle(
            x,
            y,
            -50 + (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            '#00F5FF',
            0.3,
            2,
            0
        );
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            
            // Apply gravity
            if (p.gravity) {
                p.vy += p.gravity * deltaTime;
            }
            
            // Update life
            p.life -= deltaTime;
            p.alpha = p.life / p.maxLife;
            
            // Remove dead particles
            if (p.life <= 0) {
                this.pool.push(p);
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            ctx.restore();
        }
    }

    clear() {
        this.particles.length = 0;
    }
}

// Screen shake effect
class ScreenShake {
    constructor() {
        this.intensity = 0;
        this.duration = 0;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    shake(intensity = 5, duration = 0.2) {
        this.intensity = intensity;
        this.duration = duration;
    }

    update(deltaTime) {
        if (this.duration > 0) {
            this.duration -= deltaTime;
            this.offsetX = (Math.random() - 0.5) * this.intensity * 2;
            this.offsetY = (Math.random() - 0.5) * this.intensity * 2;
        } else {
            this.offsetX = 0;
            this.offsetY = 0;
        }
    }

    apply(ctx) {
        ctx.translate(this.offsetX, this.offsetY);
    }
}

