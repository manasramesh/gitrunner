// Player class with physics and controls
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityY = 0;
        this.velocityX = 0;
        
        // Physics constants
        this.gravity = 980;
        this.jumpForce = -400;
        this.groundY = 400;
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
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        // Draw player as colored rectangle with state indication
        ctx.save();
        
        // State-based colors
        let color = '#00F5FF'; // Default running
        if (this.state === 'jumping') color = '#B565FF';
        if (this.state === 'sliding') color = '#FF006E';
        if (this.state === 'dashing') color = '#FFD700';
        
        // Main body
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add detail (eyes/face)
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 8, this.y + 8, 6, 6);
        ctx.fillRect(this.x + 18, this.y + 8, 6, 6);
        
        // Glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
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
        this.y = y;
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

