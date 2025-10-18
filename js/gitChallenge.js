// Git Challenge System
class GitChallengeSystem {
    constructor() {
        this.challenges = this.initChallenges();
        this.challengeHistory = [];
        this.currentChallenge = null;
        this.checkpointNumber = 0;
        this.correctAnswers = 0;
        this.totalAttempts = 0;
        
        // Track failed commands for spaced repetition
        this.failedCommands = new Set();
    }

    initChallenges() {
        return [
            // BASIC COMMANDS (Checkpoint 1-3)
            {
                id: 1,
                difficulty: 'basic',
                scenario: 'You want to initialize a new Git repository in your project folder.',
                answer: 'git init',
                alternatives: ['git init .'],
                hint: 'Creates a .git folder',
                category: 'Basic',
                points: 100
            },
            {
                id: 2,
                difficulty: 'basic',
                scenario: 'You modified README.md and want to stage it for commit.',
                answer: 'git add readme.md',
                alternatives: ['git add readme.md', 'git add .', 'git add -a', 'git add --all'],
                hint: 'Adds files to staging area',
                category: 'Basic',
                points: 100
            },
            {
                id: 3,
                difficulty: 'basic',
                scenario: 'You want to commit your staged changes with the message "Initial commit".',
                answer: 'git commit -m "initial commit"',
                alternatives: ['git commit -m "initial commit"', 'git commit -m initial commit'],
                hint: 'Records changes to the repository',
                category: 'Basic',
                points: 100
            },
            {
                id: 4,
                difficulty: 'basic',
                scenario: 'Check the current status of your working directory and staging area.',
                answer: 'git status',
                alternatives: [],
                hint: 'Shows modified files',
                category: 'Basic',
                points: 100
            },
            {
                id: 5,
                difficulty: 'basic',
                scenario: 'View the commit history of your repository.',
                answer: 'git log',
                alternatives: ['git log --oneline', 'git log --all'],
                hint: 'Shows commit history',
                category: 'Basic',
                points: 100
            },
            {
                id: 6,
                difficulty: 'basic',
                scenario: 'See what changes you made before staging them.',
                answer: 'git diff',
                alternatives: ['git diff head'],
                hint: 'Shows file differences',
                category: 'Basic',
                points: 100
            },
            {
                id: 7,
                difficulty: 'basic',
                scenario: 'Add all modified and new files to the staging area at once.',
                answer: 'git add .',
                alternatives: ['git add -a', 'git add --all', 'git add *'],
                hint: 'Stages all changes',
                category: 'Basic',
                points: 100
            },

            // BRANCHING (Checkpoint 4-6)
            {
                id: 8,
                difficulty: 'branching',
                scenario: 'Create a new branch called "feature" for your new feature.',
                answer: 'git branch feature',
                alternatives: ['git checkout -b feature', 'git switch -c feature'],
                hint: 'Creates a new branch',
                category: 'Branching',
                points: 150
            },
            {
                id: 9,
                difficulty: 'branching',
                scenario: 'Switch to the "develop" branch.',
                answer: 'git checkout develop',
                alternatives: ['git switch develop'],
                hint: 'Changes current branch',
                category: 'Branching',
                points: 150
            },
            {
                id: 10,
                difficulty: 'branching',
                scenario: 'List all branches in your repository.',
                answer: 'git branch',
                alternatives: ['git branch -a', 'git branch --all', 'git branch -l'],
                hint: 'Shows all branches',
                category: 'Branching',
                points: 150
            },
            {
                id: 11,
                difficulty: 'branching',
                scenario: 'Merge the "feature" branch into your current branch.',
                answer: 'git merge feature',
                alternatives: [],
                hint: 'Combines branches',
                category: 'Branching',
                points: 150
            },
            {
                id: 12,
                difficulty: 'branching',
                scenario: 'Delete the "old-feature" branch that you no longer need.',
                answer: 'git branch -d old-feature',
                alternatives: ['git branch --delete old-feature', 'git branch -d old-feature'],
                hint: 'Removes a branch',
                category: 'Branching',
                points: 150
            },
            {
                id: 13,
                difficulty: 'branching',
                scenario: 'Create and switch to a new branch called "hotfix" in one command.',
                answer: 'git checkout -b hotfix',
                alternatives: ['git switch -c hotfix'],
                hint: 'Create and checkout together',
                category: 'Branching',
                points: 150
            },

            // REMOTE OPERATIONS (Checkpoint 7-10)
            {
                id: 14,
                difficulty: 'remote',
                scenario: 'Add a remote repository with the name "origin" and URL https://github.com/user/repo.git',
                answer: 'git remote add origin https://github.com/user/repo.git',
                alternatives: [],
                hint: 'Links to remote repository',
                category: 'Remote',
                points: 200
            },
            {
                id: 15,
                difficulty: 'remote',
                scenario: 'Push your commits to the "main" branch on the "origin" remote.',
                answer: 'git push origin main',
                alternatives: ['git push'],
                hint: 'Uploads local commits',
                category: 'Remote',
                points: 200
            },
            {
                id: 16,
                difficulty: 'remote',
                scenario: 'Pull the latest changes from the remote "main" branch.',
                answer: 'git pull origin main',
                alternatives: ['git pull'],
                hint: 'Downloads and merges changes',
                category: 'Remote',
                points: 200
            },
            {
                id: 17,
                difficulty: 'remote',
                scenario: 'Clone the repository from https://github.com/user/project.git',
                answer: 'git clone https://github.com/user/project.git',
                alternatives: [],
                hint: 'Downloads entire repository',
                category: 'Remote',
                points: 200
            },
            {
                id: 18,
                difficulty: 'remote',
                scenario: 'Fetch changes from remote without merging them.',
                answer: 'git fetch',
                alternatives: ['git fetch origin'],
                hint: 'Downloads without merging',
                category: 'Remote',
                points: 200
            },
            {
                id: 19,
                difficulty: 'remote',
                scenario: 'View all configured remote repositories.',
                answer: 'git remote -v',
                alternatives: ['git remote --verbose', 'git remote'],
                hint: 'Lists remote connections',
                category: 'Remote',
                points: 200
            },
            {
                id: 20,
                difficulty: 'remote',
                scenario: 'Set the upstream branch for your current branch to origin/main.',
                answer: 'git push -u origin main',
                alternatives: ['git push --set-upstream origin main'],
                hint: 'Links local to remote branch',
                category: 'Remote',
                points: 200
            },

            // ADVANCED (Checkpoint 11-15)
            {
                id: 21,
                difficulty: 'advanced',
                scenario: 'Temporarily save your uncommitted changes without committing.',
                answer: 'git stash',
                alternatives: ['git stash save', 'git stash push'],
                hint: 'Saves work in progress',
                category: 'Advanced',
                points: 250
            },
            {
                id: 22,
                difficulty: 'advanced',
                scenario: 'Apply the most recent stashed changes back to your working directory.',
                answer: 'git stash pop',
                alternatives: ['git stash apply'],
                hint: 'Restores stashed changes',
                category: 'Advanced',
                points: 250
            },
            {
                id: 23,
                difficulty: 'advanced',
                scenario: 'Rebase your current branch onto main.',
                answer: 'git rebase main',
                alternatives: [],
                hint: 'Reapplies commits on top',
                category: 'Advanced',
                points: 250
            },
            {
                id: 24,
                difficulty: 'advanced',
                scenario: 'Undo the last commit but keep the changes in your working directory.',
                answer: 'git reset head~1',
                alternatives: ['git reset --soft head~1', 'git reset --mixed head~1'],
                hint: 'Moves HEAD pointer',
                category: 'Advanced',
                points: 250
            },
            {
                id: 25,
                difficulty: 'advanced',
                scenario: 'Apply only commit abc123 to your current branch.',
                answer: 'git cherry-pick abc123',
                alternatives: [],
                hint: 'Applies specific commit',
                category: 'Advanced',
                points: 250
            },
            {
                id: 26,
                difficulty: 'advanced',
                scenario: 'Create a tag named "v1.0" for the current commit.',
                answer: 'git tag v1.0',
                alternatives: ['git tag -a v1.0'],
                hint: 'Marks a specific point',
                category: 'Advanced',
                points: 250
            },
            {
                id: 27,
                difficulty: 'advanced',
                scenario: 'Amend the last commit to include new changes.',
                answer: 'git commit --amend',
                alternatives: ['git commit --amend -m "message"'],
                hint: 'Modifies last commit',
                category: 'Advanced',
                points: 250
            },
            {
                id: 28,
                difficulty: 'advanced',
                scenario: 'Show changes between your current branch and main.',
                answer: 'git diff main',
                alternatives: ['git diff main..head'],
                hint: 'Compares branches',
                category: 'Advanced',
                points: 250
            },

            // EXPERT (Checkpoint 16+)
            {
                id: 29,
                difficulty: 'expert',
                scenario: 'View the reflog to see all recent HEAD movements.',
                answer: 'git reflog',
                alternatives: [],
                hint: 'Shows reference logs',
                category: 'Expert',
                points: 300
            },
            {
                id: 30,
                difficulty: 'expert',
                scenario: 'Use binary search to find the commit that introduced a bug.',
                answer: 'git bisect start',
                alternatives: ['git bisect'],
                hint: 'Binary search for bugs',
                category: 'Expert',
                points: 300
            },
            {
                id: 31,
                difficulty: 'expert',
                scenario: 'Show who last modified each line of file.txt.',
                answer: 'git blame file.txt',
                alternatives: [],
                hint: 'Shows line authors',
                category: 'Expert',
                points: 300
            },
            {
                id: 32,
                difficulty: 'expert',
                scenario: 'Interactively rebase the last 3 commits.',
                answer: 'git rebase -i head~3',
                alternatives: ['git rebase --interactive head~3'],
                hint: 'Interactive rebase',
                category: 'Expert',
                points: 300
            },
            {
                id: 33,
                difficulty: 'expert',
                scenario: 'Remove file.log from Git tracking but keep it locally.',
                answer: 'git rm --cached file.log',
                alternatives: [],
                hint: 'Untrack file',
                category: 'Expert',
                points: 300
            },
            {
                id: 34,
                difficulty: 'expert',
                scenario: 'Clean all untracked files and directories.',
                answer: 'git clean -fd',
                alternatives: ['git clean -f -d'],
                hint: 'Removes untracked files',
                category: 'Expert',
                points: 300
            }
        ];
    }

    getNextChallenge(checkpointNum) {
        this.checkpointNumber = checkpointNum;
        
        // Prioritize failed commands (spaced repetition)
        if (this.failedCommands.size > 0 && Math.random() < 0.4) {
            const failedIds = Array.from(this.failedCommands);
            const randomFailedId = failedIds[Math.floor(Math.random() * failedIds.length)];
            const challenge = this.challenges.find(c => c.id === randomFailedId);
            if (challenge) {
                this.currentChallenge = challenge;
                return challenge;
            }
        }
        
        // Select appropriate difficulty based on checkpoint
        let availableChallenges;
        if (checkpointNum <= 3) {
            availableChallenges = this.challenges.filter(c => c.difficulty === 'basic');
        } else if (checkpointNum <= 6) {
            availableChallenges = this.challenges.filter(c => c.difficulty === 'branching');
        } else if (checkpointNum <= 10) {
            availableChallenges = this.challenges.filter(c => c.difficulty === 'remote');
        } else if (checkpointNum <= 15) {
            availableChallenges = this.challenges.filter(c => c.difficulty === 'advanced');
        } else {
            availableChallenges = this.challenges.filter(c => c.difficulty === 'expert');
        }
        
        // Avoid repeating recent challenges
        const recentIds = this.challengeHistory.slice(-5).map(c => c.id);
        const freshChallenges = availableChallenges.filter(c => !recentIds.includes(c.id));
        
        const pool = freshChallenges.length > 0 ? freshChallenges : availableChallenges;
        const challenge = pool[Math.floor(Math.random() * pool.length)];
        
        this.currentChallenge = challenge;
        this.challengeHistory.push(challenge);
        
        return challenge;
    }

    validateAnswer(userInput) {
        if (!this.currentChallenge) return false;
        
        const normalized = userInput.trim().toLowerCase();
        const correctAnswer = this.currentChallenge.answer.toLowerCase();
        const alternatives = this.currentChallenge.alternatives.map(a => a.toLowerCase());
        
        this.totalAttempts++;
        
        const isCorrect = normalized === correctAnswer || alternatives.includes(normalized);
        
        if (isCorrect) {
            this.correctAnswers++;
            this.failedCommands.delete(this.currentChallenge.id);
        } else {
            this.failedCommands.add(this.currentChallenge.id);
        }
        
        return isCorrect;
    }

    getCheatSheet() {
        const categories = {
            'Basic': [],
            'Branching': [],
            'Remote': [],
            'Advanced': [],
            'Expert': []
        };
        
        this.challenges.forEach(challenge => {
            categories[challenge.category].push({
                command: challenge.answer,
                description: challenge.scenario,
                hint: challenge.hint
            });
        });
        
        return categories;
    }

    getStats() {
        return {
            checkpoints: this.checkpointNumber,
            correct: this.correctAnswers,
            total: this.totalAttempts,
            accuracy: this.totalAttempts > 0 ? Math.round((this.correctAnswers / this.totalAttempts) * 100) : 0
        };
    }

    reset() {
        this.challengeHistory = [];
        this.currentChallenge = null;
        this.checkpointNumber = 0;
        this.correctAnswers = 0;
        this.totalAttempts = 0;
        // Keep failedCommands for long-term learning
    }
}

