// Player class with physics and controls
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityY = 0;
        this.velocityX = 0;
        
        // Physics constants - Optimized for playability
        // Max jump height: 120px (can clear 100px obstacles with safety margin)
        this.gravity = 960;
        this.jumpForce = -480;
        this.groundY = y; // Dynamic based on canvas height
        this.isGrounded = false;
        this.canDoubleJump = false;
        
        // States
        this.state = 'running'; // running, jumping, sliding, dashing
        this.isSliding = false;
        this.isDashing = false;
        this.dashCooldown = 0;
        this.dashDuration = 0;
        this.dashSpeed = 600;
        
        // Animation
        this.frame = 0;
        this.frameTimer = 0;
        this.frameInterval = 0.1;
        
        // Trail effect
        this.trailTimer = 0;
        this.trailInterval = 0.05;
        
        // Double-tap detection
        this.lastJumpTime = 0;
        this.doubleTapWindow = 0.3;
    }

    handleInput(keys, currentTime) {
        // Jump
        if (keys['Space'] || keys['ArrowUp'] || keys['KeyW']) {
            if (!keys.jumpPressed) {
                keys.jumpPressed = true;
                
                // Check for double-tap dash
                if (currentTime - this.lastJumpTime < this.doubleTapWindow && this.dashCooldown <= 0) {
                    this.dash();
                } else {
                    this.jump();
                }
                
                this.lastJumpTime = currentTime;
            }
        } else {
            keys.jumpPressed = false;
        }
        
        // Slide
        if (keys['ArrowDown'] || keys['KeyS']) {
            if (this.isGrounded) {
                this.slide();
            }
        } else {
            if (this.isSliding) {
                this.isSliding = false;
                this.height = 32;
            }
        }
    }

    jump() {
        if (this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
            this.canDoubleJump = true;
            this.state = 'jumping';
            return true;
        } else if (this.canDoubleJump) {
            this.velocityY = this.jumpForce;
            this.canDoubleJump = false;
            return true;
        }
        return false;
    }

    slide() {
        if (!this.isSliding) {
            this.isSliding = true;
            this.height = 16;
            this.state = 'sliding';
        }
    }

    dash() {
        if (!this.isDashing && this.dashCooldown <= 0) {
            this.isDashing = true;
            this.dashDuration = 0.2;
            this.dashCooldown = 1.0;
            this.velocityX = this.dashSpeed;
            this.state = 'dashing';
            return true;
        }
        return false;
    }

    update(deltaTime) {
        // Update dash
        if (this.isDashing) {
            this.dashDuration -= deltaTime;
            if (this.dashDuration <= 0) {
                this.isDashing = false;
                this.velocityX = 0;
            }
        }
        
        if (this.dashCooldown > 0) {
            this.dashCooldown -= deltaTime;
        }
        
        // Apply gravity
        if (!this.isGrounded) {
            this.velocityY += this.gravity * deltaTime;
        }
        
        // Update position
        this.y += this.velocityY * deltaTime;
        
        // Dash movement
        if (this.isDashing) {
            this.x += this.velocityX * deltaTime;
            // Clamp to screen
            if (this.x > 400) this.x = 400;
        } else {
            // Return to normal position
            if (this.x > 100) {
                this.x -= 200 * deltaTime;
                if (this.x < 100) this.x = 100;
            }
        }
        
        // Ground collision
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isGrounded = true;
            this.canDoubleJump = false;
            if (this.state !== 'sliding' && !this.isDashing) {
                this.state = 'running';
            }
        } else {
            this.isGrounded = false;
        }
        
        // Update animation
        this.frameTimer += deltaTime;
        if (this.frameTimer >= this.frameInterval) {
            this.frame = (this.frame + 1) % 4;
            this.frameTimer = 0;
        }
    }

    render(ctx, hasShield) {
        // Shield effect
        if (hasShield) {
            ctx.save();
            ctx.strokeStyle = '#00F5FF';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 12, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        ctx.save();
        
        // GitHub Octocat-style character
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // State-based colors
        let primaryColor = '#00F5FF';
        let secondaryColor = '#0088cc';
        if (this.state === 'jumping') {
            primaryColor = '#B565FF';
            secondaryColor = '#7B2CBF';
        }
        if (this.state === 'sliding') {
            primaryColor = '#FF006E';
            secondaryColor = '#CC0058';
        }
        if (this.state === 'dashing') {
            primaryColor = '#FFD700';
            secondaryColor = '#FFA500';
        }
        
        // Draw Octocat-inspired character
        ctx.fillStyle = primaryColor;
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 15;
        
        // Main body (rounded)
        ctx.beginPath();
        ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
        ctx.fill();
        
        // Cat ears (tentacles)
        ctx.fillStyle = secondaryColor;
        ctx.shadowBlur = 10;
        
        // Left ear
        ctx.beginPath();
        ctx.arc(centerX - 10, centerY - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Right ear
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes (GitHub style)
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 0;
        
        // Left eye
        ctx.beginPath();
        ctx.arc(centerX - 5, centerY - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Right eye
        ctx.beginPath();
        ctx.arc(centerX + 5, centerY - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX - 5, centerY - 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 5, centerY - 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Smile
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 2, 6, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
        
        // Git logo on body
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('git', centerX, centerY + 10);
        
        // Outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    reset(x, y) {
        this.x = x;
        this.y = y || this.groundY; // Default to ground position if not specified
        this.velocityY = 0;
        this.velocityX = 0;
        this.isGrounded = false;
        this.canDoubleJump = false;
        this.state = 'running';
        this.isSliding = false;
        this.isDashing = false;
        this.dashCooldown = 0;
        this.dashDuration = 0;
        this.height = 32;
        this.frame = 0;
    }
}

