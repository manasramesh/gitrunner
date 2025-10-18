// Main initialization
let game;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

function initializeGame() {
    // Show loading screen
    const loadingScreen = document.getElementById('loading-screen');
    const loadingFill = document.querySelector('.loading-fill');
    
    // Simulate asset loading (in a real app, you'd load actual assets here)
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 5;
        loadingFill.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            finishLoading();
        }
    }, 50);
}

function finishLoading() {
    setTimeout(() => {
        // Initialize game engine
        game = new GameEngine();
        window.game = game; // Make accessible globally for UI callbacks
        
        // Hide loading, show menu
        game.ui.hideLoading();
        game.ui.showMenu();
        
        // Update high score display
        game.ui.updateHighScore(game.highScore);
        
        console.log('🎮 Git Runner: Command Quest initialized!');
        console.log('📚 Learn Git commands while having fun!');
    }, 500);
}

// Prevent accidental page closure during gameplay
window.addEventListener('beforeunload', (e) => {
    if (game && (game.state === 'PLAYING' || game.state === 'CHECKPOINT')) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && game && game.state === 'PLAYING') {
        game.pause();
    }
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            (registration) => {
                console.log('ServiceWorker registration successful');
            },
            (err) => {
                console.log('ServiceWorker registration failed: ', err);
            }
        ).catch(() => {
            // Fail silently if service worker not available
        });
    });
}

