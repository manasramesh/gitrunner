// UI Manager
class UIManager {
    constructor(gitChallenge) {
        this.gitChallenge = gitChallenge;
        this.initializeElements();
        this.setupEventListeners();
        this.generateCheatSheet();
    }

    initializeElements() {
        // HUD elements
        this.scoreEl = document.getElementById('score');
        this.highScoreEl = document.getElementById('high-score');
        this.menuHighScoreEl = document.getElementById('menu-high-score');
        this.nextCheckpointEl = document.getElementById('next-checkpoint');
        this.livesDisplay = document.getElementById('lives-display');
        this.powerupIndicator = document.getElementById('powerup-indicator');
        
        // Screens
        this.loadingScreen = document.getElementById('loading-screen');
        this.menuScreen = document.getElementById('menu-screen');
        this.gameContainer = document.getElementById('game-container');
        
        // Modals
        this.challengeModal = document.getElementById('challenge-modal');
        this.cheatsheetModal = document.getElementById('cheatsheet-modal');
        this.instructionsModal = document.getElementById('instructions-modal');
        this.pauseModal = document.getElementById('pause-modal');
        this.gameoverModal = document.getElementById('gameover-modal');
        
        // Challenge elements
        this.checkpointNumEl = document.getElementById('checkpoint-num');
        this.timerEl = document.getElementById('timer');
        this.challengeScenarioEl = document.getElementById('challenge-scenario');
        this.commandInput = document.getElementById('command-input');
        
        // Achievement toast
        this.achievementToast = document.getElementById('achievement-toast');
    }

    setupEventListeners() {
        // Menu buttons
        document.getElementById('start-btn').addEventListener('click', () => {
            window.game.startGame();
        });
        
        document.getElementById('cheatsheet-menu-btn').addEventListener('click', () => {
            this.showCheatSheet();
        });
        
        document.getElementById('instructions-btn').addEventListener('click', () => {
            this.showInstructions();
        });
        
        // Challenge submit
        document.getElementById('submit-command').addEventListener('click', () => {
            window.game.submitCommand();
        });
        
        document.getElementById('command-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault(); // Prevent form submission
                window.game.submitCommand();
            }
        });
        
        // Also handle keydown for better cross-browser compatibility
        document.getElementById('command-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                window.game.submitCommand();
            }
        });
        
        // Cheat sheet buttons
        document.getElementById('cheatsheet-btn').addEventListener('click', () => {
            this.showCheatSheet();
        });
        
        document.getElementById('close-cheatsheet').addEventListener('click', () => {
            this.hideCheatSheet();
        });
        
        // Instructions
        document.getElementById('close-instructions').addEventListener('click', () => {
            this.hideInstructions();
        });
        
        // Pause
        document.getElementById('pause-btn').addEventListener('click', () => {
            window.game.pause();
        });
        
        document.getElementById('resume-btn').addEventListener('click', () => {
            window.game.resume();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            window.game.restart();
        });
        
        document.getElementById('quit-btn').addEventListener('click', () => {
            window.game.quitToMenu();
        });
        
        // Game over
        document.getElementById('play-again-btn').addEventListener('click', () => {
            window.game.restart();
        });
        
        document.getElementById('menu-btn').addEventListener('click', () => {
            window.game.quitToMenu();
        });
        
        // Cheat sheet search
        document.getElementById('cheatsheet-search').addEventListener('input', (e) => {
            this.filterCheatSheet(e.target.value);
        });
    }

    showLoading() {
        this.loadingScreen.classList.remove('hidden');
    }

    hideLoading() {
        this.loadingScreen.classList.add('hidden');
    }

    showMenu() {
        this.menuScreen.classList.remove('hidden');
        this.gameContainer.classList.add('hidden');
        const highScore = localStorage.getItem('gitRunnerHighScore') || 0;
        this.menuHighScoreEl.textContent = highScore;
    }

    hideMenu() {
        this.menuScreen.classList.add('hidden');
        this.gameContainer.classList.remove('hidden');
    }

    updateScore(score) {
        this.scoreEl.textContent = Math.floor(score);
    }

    updateHighScore(highScore) {
        this.highScoreEl.textContent = Math.floor(highScore);
        this.menuHighScoreEl.textContent = Math.floor(highScore);
    }

    updateNextCheckpoint(checkpoint) {
        this.nextCheckpointEl.textContent = checkpoint;
    }

    updateLives(lives) {
        const hearts = this.livesDisplay.querySelectorAll('.heart');
        hearts.forEach((heart, index) => {
            if (index < lives) {
                heart.classList.remove('lost');
            } else {
                heart.classList.add('lost');
            }
        });
    }

    updatePowerupIndicator(powerupInfo) {
        if (powerupInfo) {
            this.powerupIndicator.textContent = `${powerupInfo.icon} ${powerupInfo.timeLeft}s`;
            this.powerupIndicator.style.background = `rgba(${this.hexToRgb(powerupInfo.color)}, 0.9)`;
            this.powerupIndicator.classList.remove('hidden');
        } else {
            this.powerupIndicator.classList.add('hidden');
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '181, 101, 255';
    }

    showChallenge(challenge, checkpointNumber) {
        this.checkpointNumEl.textContent = checkpointNumber;
        this.challengeScenarioEl.textContent = challenge.scenario;
        this.commandInput.value = '';
        
        // Hide timer display (no time pressure for learning!)
        const timerDisplay = this.challengeModal.querySelector('.timer-display');
        if (timerDisplay) {
            timerDisplay.style.display = 'none';
        }
        
        this.challengeModal.classList.remove('hidden');
        
        // Focus input after modal is visible
        setTimeout(() => {
            this.commandInput.focus();
        }, 100);
    }

    hideChallenge() {
        this.challengeModal.classList.add('hidden');
    }

    updateTimer(seconds) {
        // Timer removed - no time pressure for learning!
        // Keeping function for compatibility but doing nothing
    }

    showFeedback(isCorrect, message) {
        // Remove any existing feedback
        const existing = this.challengeModal.querySelector('.feedback-message');
        if (existing) existing.remove();
        
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${isCorrect ? 'success' : 'error'}`;
        feedback.textContent = message;
        
        this.challengeModal.querySelector('.terminal-body').appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }

    showCheatSheet() {
        this.cheatsheetModal.classList.remove('hidden');
    }

    hideCheatSheet() {
        this.cheatsheetModal.classList.add('hidden');
    }

    showInstructions() {
        this.instructionsModal.classList.remove('hidden');
    }

    hideInstructions() {
        this.instructionsModal.classList.add('hidden');
    }

    showPause() {
        this.pauseModal.classList.remove('hidden');
    }

    hidePause() {
        this.pauseModal.classList.add('hidden');
    }

    showGameOver(stats, isNewRecord) {
        document.getElementById('final-score').textContent = Math.floor(stats.score);
        document.getElementById('checkpoints-completed').textContent = stats.checkpoints;
        document.getElementById('coins-collected').textContent = stats.coins;
        document.getElementById('challenges-correct').textContent = stats.challengesCorrect;
        document.getElementById('challenges-total').textContent = stats.challengesTotal;
        
        if (isNewRecord) {
            document.getElementById('new-record').classList.remove('hidden');
        } else {
            document.getElementById('new-record').classList.add('hidden');
        }
        
        this.gameoverModal.classList.remove('hidden');
    }

    hideGameOver() {
        this.gameoverModal.classList.add('hidden');
    }

    showAchievement(text) {
        const achievementText = this.achievementToast.querySelector('.achievement-text');
        achievementText.textContent = text;
        this.achievementToast.classList.remove('hidden');
        
        setTimeout(() => {
            this.achievementToast.classList.add('hidden');
        }, 3000);
    }

    generateCheatSheet() {
        const cheatSheet = this.gitChallenge.getCheatSheet();
        const container = document.getElementById('cheatsheet-body');
        container.innerHTML = '';
        
        for (const [category, commands] of Object.entries(cheatSheet)) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'cheat-category';
            categoryDiv.dataset.category = category;
            
            const title = document.createElement('h3');
            title.className = 'pixel-text-small';
            title.textContent = category;
            categoryDiv.appendChild(title);
            
            commands.forEach(cmd => {
                const item = document.createElement('div');
                item.className = 'cheat-item';
                item.dataset.command = cmd.command.toLowerCase();
                item.dataset.description = cmd.description.toLowerCase();
                
                const command = document.createElement('div');
                command.className = 'cheat-command pixel-text-small';
                command.textContent = cmd.command;
                
                const description = document.createElement('div');
                description.className = 'cheat-description pixel-text-small';
                description.textContent = cmd.description;
                
                item.appendChild(command);
                item.appendChild(description);
                categoryDiv.appendChild(item);
            });
            
            container.appendChild(categoryDiv);
        }
    }

    filterCheatSheet(query) {
        const items = document.querySelectorAll('.cheat-item');
        const categories = document.querySelectorAll('.cheat-category');
        const lowerQuery = query.toLowerCase();
        
        categories.forEach(category => {
            let hasVisibleItems = false;
            const categoryItems = category.querySelectorAll('.cheat-item');
            
            categoryItems.forEach(item => {
                const command = item.dataset.command;
                const description = item.dataset.description;
                
                if (command.includes(lowerQuery) || description.includes(lowerQuery)) {
                    item.style.display = 'block';
                    hasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            category.style.display = hasVisibleItems ? 'block' : 'none';
        });
    }
}

