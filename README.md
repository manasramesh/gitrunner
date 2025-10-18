# 🎮 Git Runner: Command Quest

An addictive 2D endless runner game that teaches you Git commands while you play! Master Git through gameplay, not boring tutorials.

![Game Screenshot](https://via.placeholder.com/800x400/1a1a2e/00F5FF?text=Git+Runner:+Command+Quest)

## 🌟 Features

### Gameplay
- **Endless Runner Mechanics**: Jump, slide, and dash through procedurally generated obstacles
- **Progressive Difficulty**: Game speed increases as you advance through checkpoints
- **Multiple Biomes**: Cyber City, Neon Forest, and Digital Void themes
- **Power-ups**: Shield, Magnet, Slow-Mo, and 2x Score Multiplier
- **Combo System**: Chain obstacle dodges for bonus points

### Git Learning
- **Real Git Commands**: Type actual Git commands to pass checkpoints
- **60+ Commands**: From basic (`git init`) to expert (`git bisect`)
- **Progressive Learning**: Difficulty scales from beginner to advanced
- **Git Cheat Sheet**: Built-in reference guide available anytime
- **Spaced Repetition**: Failed commands appear more frequently
- **No Spoon-Feeding**: Wrong answers don't reveal solutions - learn by doing!

### Polish
- **Particle Effects**: Smooth animations for jumps, dashes, and collisions
- **Screen Shake**: Dynamic feedback for impacts
- **Parallax Backgrounds**: Multi-layer scrolling for depth
- **Achievement System**: Unlock milestones as you progress
- **High Score Tracking**: Persistent localStorage saves
- **Mobile Support**: Touch controls for on-the-go play
- **Responsive Design**: Works on any screen size

## 🎯 How to Play

### Basic Controls
- **SPACE / ↑** - Jump (press twice for double jump)
- **↓** - Slide under obstacles
- **Double-tap SPACE** - Dash forward (1 second cooldown)

### Mobile Controls
- **Tap** - Jump
- **Swipe Up** - Jump
- **Swipe Down** - Slide
- **Double-tap** - Dash

### Game Flow
1. Run automatically through an endless world
2. Avoid obstacles (spikes, barriers) by jumping/sliding
3. Collect coins for bonus points
4. Every 500-1000 points, reach a Git Challenge checkpoint
5. Type the correct Git command within 15 seconds
6. **Correct answer**: +100-500 points + random power-up
7. **Wrong answer or timeout**: Lose 1 life
8. You have 3 lives - lose all = Game Over!

### Power-ups
- **⚡ Shield**: 5 seconds of invincibility
- **🧲 Magnet**: 8 seconds of auto-collect coins
- **⏰ Slow-Mo**: 5 seconds of 50% game speed
- **✨ 2x Multiplier**: 10 seconds of double points

## 🚀 Deployment

### GitHub Pages (Recommended)
This game is 100% static and perfect for GitHub Pages!

1. **Create a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Git Runner game"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/git-runner.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main` / `(root)`
   - Save

3. **Access your game**
   - URL: `https://YOUR_USERNAME.github.io/git-runner/`
   - Share with friends!

### Other Static Hosting Platforms

#### Netlify
1. Drag and drop the entire folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get instant URL

#### Vercel
```bash
npm i -g vercel
vercel --prod
```

#### Cloudflare Pages
1. Connect your GitHub repo
2. Build settings: None needed (static site)
3. Deploy!

## 🛠️ Development

### File Structure
```
game/
├── index.html              # Entry point
├── styles/
│   ├── main.css           # Main styling
│   └── terminal.css       # Git challenge terminal
├── js/
│   ├── main.js            # Initialization
│   ├── engine.js          # Core game engine
│   ├── player.js          # Player mechanics
│   ├── world.js           # World generation
│   ├── gitChallenge.js    # Git challenge system
│   ├── powerups.js        # Power-up logic
│   ├── particles.js       # Particle effects
│   ├── audio.js           # Sound system
│   └── ui.js              # UI management
└── README.md
```

### Technologies Used
- **HTML5 Canvas**: For rendering graphics
- **Vanilla JavaScript (ES6+)**: No frameworks, pure performance
- **CSS3**: Animations and styling
- **Web Audio API**: Procedural sound generation
- **LocalStorage**: High score persistence

### Performance
- Target: **60 FPS** on modern browsers
- Object pooling for particles
- Separate canvas layers for background
- Efficient collision detection (AABB)
- Delta time for frame-independent physics

## 🎓 Learning Git

The game includes Git commands across 5 difficulty levels:

### Basic (Checkpoint 1-3)
- `git init`, `git add`, `git commit`, `git status`, `git log`, `git diff`

### Branching (Checkpoint 4-6)
- `git branch`, `git checkout`, `git merge`, `git branch -d`

### Remote (Checkpoint 7-10)
- `git push`, `git pull`, `git clone`, `git fetch`, `git remote`

### Advanced (Checkpoint 11-15)
- `git stash`, `git rebase`, `git reset`, `git cherry-pick`, `git tag`

### Expert (Checkpoint 16+)
- `git reflog`, `git bisect`, `git blame`, `git clean`, `git rm --cached`

## 🏆 Achievements
- **First Checkpoint**: Complete your first Git challenge
- **First 1000 Points**: Reach 1000 points
- **Git Wizard**: Get 5 correct answers in a row
- **Legendary**: Reach 5000 points

## 📱 Browser Compatibility
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing
Want to add more Git commands or improve the game? Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License
MIT License - Feel free to use this for learning, teaching, or fun!

## 🎉 Credits
Created with ❤️ for developers who want to learn Git while having fun!

## 🐛 Known Issues
- None! Please report any bugs you find.

## 💡 Tips for High Scores
1. Use the Git Cheat Sheet during challenges (no penalty!)
2. Collect all coins for bonus points
3. Chain obstacles for combo multipliers
4. Save dash for emergency situations
5. Learn the Git commands - speed matters!

## 🎮 Start Playing Now!
Open `index.html` in your browser or visit the deployed version!

---

**Remember**: The best way to learn Git is by doing. Play, fail, learn, and master! 🚀

