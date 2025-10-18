# 🚀 Quick Start Guide

## Play Immediately (Local)
1. Open `index.html` in your browser
2. That's it! The game runs entirely in your browser.

## Deploy to GitHub Pages (5 minutes)

### Step 1: Create Repository
```bash
cd /Users/manas.ramesh/Documents/mns/game
git init
git add .
git commit -m "🎮 Add Git Runner: Command Quest"
```

### Step 2: Push to GitHub
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/git-runner.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Click **Save**
5. Wait 1-2 minutes for deployment

### Step 4: Play!
Your game will be live at:
```
https://YOUR_USERNAME.github.io/git-runner/
```

## File Structure ✅
```
game/
├── index.html              ✅ Main HTML file
├── styles/
│   ├── main.css           ✅ Main styling
│   └── terminal.css       ✅ Challenge terminal styling
├── js/
│   ├── main.js            ✅ Game initialization
│   ├── engine.js          ✅ Core game engine
│   ├── player.js          ✅ Player mechanics
│   ├── world.js           ✅ World generation
│   ├── gitChallenge.js    ✅ Git challenges (60+ commands)
│   ├── powerups.js        ✅ Power-up system
│   ├── particles.js       ✅ Particle effects
│   ├── audio.js           ✅ Sound system
│   └── ui.js              ✅ UI management
├── sw.js                   ✅ Service worker (offline)
├── README.md              ✅ Full documentation
└── .gitignore             ✅ Git ignore rules
```

## Controls 🎮

### Desktop
- **SPACE** or **↑** - Jump
- **↓** - Slide
- **Double-tap SPACE** - Dash

### Mobile
- **Tap** - Jump
- **Swipe Down** - Slide
- **Double-tap** - Dash

## Game Rules 📖
1. **Run** automatically and avoid obstacles
2. **Collect** coins (+10 points each)
3. **Reach checkpoints** every 500-1000 points
4. **Type Git commands** correctly within 15 seconds
5. **Win**: Correct answer = bonus points + power-up
6. **Lose**: Wrong answer = -1 life (3 lives total)
7. **Game Over**: All lives lost = restart

## Git Challenge Progression 📚
- **Checkpoint 1-3**: Basic commands (init, add, commit)
- **Checkpoint 4-6**: Branching (branch, checkout, merge)
- **Checkpoint 7-10**: Remote (push, pull, clone)
- **Checkpoint 11-15**: Advanced (stash, rebase, cherry-pick)
- **Checkpoint 16+**: Expert (reflog, bisect, blame)

## Features ✨
✅ 60+ Git commands to learn
✅ Progressive difficulty
✅ Built-in Git cheat sheet
✅ 4 power-up types
✅ Particle effects & animations
✅ High score tracking
✅ Mobile-responsive
✅ Works offline
✅ No dependencies!

## Troubleshooting 🔧

### Game won't start?
- Make sure JavaScript is enabled
- Try a different browser (Chrome recommended)
- Check browser console (F12) for errors

### Slow performance?
- Close other browser tabs
- Disable browser extensions
- Game targets 60 FPS on modern hardware

### Service worker errors?
- Service worker is optional for offline play
- Can be disabled - game works fine without it

## Share Your High Score! 🏆
Tweet your score with #GitRunner and challenge your dev friends!

## Need Help? 
Read the full [README.md](README.md) for detailed information.

---

**Have fun learning Git! 🎮📚**

