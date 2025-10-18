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
                points: 100,
                terminalOutput: 'Initialized empty Git repository in /project/.git/'
            },
            {
                id: 2,
                difficulty: 'basic',
                scenario: 'You modified README.md and want to stage it for commit.',
                answer: 'git add readme.md',
                alternatives: ['git add readme.md', 'git add .', 'git add -a', 'git add --all'],
                hint: 'Adds files to staging area',
                category: 'Basic',
                points: 100,
                terminalOutput: ''  // Silent success (Git add has no output)
            },
            {
                id: 3,
                difficulty: 'basic',
                scenario: 'You want to commit your staged changes with the message "Initial commit".',
                answer: 'git commit -m "initial commit"',
                alternatives: ['git commit -m "initial commit"', 'git commit -m initial commit'],
                hint: 'Records changes to the repository',
                category: 'Basic',
                points: 100,
                terminalOutput: '[main a3f2c9b] Initial commit\n 1 file changed, 10 insertions(+)\n create mode 100644 README.md'
            },
            {
                id: 4,
                difficulty: 'basic',
                scenario: 'Check the current status of your working directory and staging area.',
                answer: 'git status',
                alternatives: [],
                hint: 'Shows modified files',
                category: 'Basic',
                points: 100,
                terminalOutput: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean'
            },
            {
                id: 5,
                difficulty: 'basic',
                scenario: 'View the commit history of your repository.',
                answer: 'git log',
                alternatives: ['git log --oneline', 'git log --all'],
                hint: 'Shows commit history',
                category: 'Basic',
                points: 100,
                terminalOutput: 'commit f8e1d4a (HEAD -> main, origin/main)\nAuthor: Developer <dev@example.com>\nDate:   Sat Oct 18 14:30:22 2025\n\n    Add new feature\n\ncommit a3f2c9b\nAuthor: Developer <dev@example.com>\nDate:   Sat Oct 18 12:15:10 2025\n\n    Initial commit'
            },
            {
                id: 6,
                difficulty: 'basic',
                scenario: 'See what changes you made before staging them.',
                answer: 'git diff',
                alternatives: ['git diff head'],
                hint: 'Shows file differences',
                category: 'Basic',
                points: 100,
                terminalOutput: 'diff --git a/file.js b/file.js\nindex a3f2c9b..f8e1d4a 100644\n--- a/file.js\n+++ b/file.js\n@@ -1,3 +1,4 @@\n function hello() {\n+  console.log("Updated!");\n   return "world";\n }'
            },
            {
                id: 7,
                difficulty: 'basic',
                scenario: 'Add all modified and new files to the staging area at once.',
                answer: 'git add .',
                alternatives: ['git add -a', 'git add --all', 'git add *'],
                hint: 'Stages all changes',
                category: 'Basic',
                points: 100,
                terminalOutput: ''  // Silent success
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
                points: 150,
                terminalOutput: ''  // Silent success for git branch
            },
            {
                id: 9,
                difficulty: 'branching',
                scenario: 'Switch to the "develop" branch.',
                answer: 'git checkout develop',
                alternatives: ['git switch develop'],
                hint: 'Changes current branch',
                category: 'Branching',
                points: 150,
                terminalOutput: 'Switched to branch \'develop\'\nYour branch is up to date with \'origin/develop\'.'
            },
            {
                id: 10,
                difficulty: 'branching',
                scenario: 'List all branches in your repository.',
                answer: 'git branch',
                alternatives: ['git branch -a', 'git branch --all', 'git branch -l'],
                hint: 'Shows all branches',
                category: 'Branching',
                points: 150,
                terminalOutput: '  develop\n  feature\n* main\n  hotfix'
            },
            {
                id: 11,
                difficulty: 'branching',
                scenario: 'Merge the "feature" branch into your current branch.',
                answer: 'git merge feature',
                alternatives: [],
                hint: 'Combines branches',
                category: 'Branching',
                points: 150,
                terminalOutput: 'Updating a3f2c9b..f8e1d4a\nFast-forward\n file.js | 15 +++++++++++++++\n 1 file changed, 15 insertions(+)'
            },
            {
                id: 12,
                difficulty: 'branching',
                scenario: 'Delete the "old-feature" branch that you no longer need.',
                answer: 'git branch -d old-feature',
                alternatives: ['git branch --delete old-feature', 'git branch -d old-feature'],
                hint: 'Removes a branch',
                category: 'Branching',
                points: 150,
                terminalOutput: 'Deleted branch old-feature (was a3f2c9b).'
            },
            {
                id: 13,
                difficulty: 'branching',
                scenario: 'Create and switch to a new branch called "hotfix" in one command.',
                answer: 'git checkout -b hotfix',
                alternatives: ['git switch -c hotfix'],
                hint: 'Create and checkout together',
                category: 'Branching',
                points: 150,
                terminalOutput: 'Switched to a new branch \'hotfix\''
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
                points: 200,
                terminalOutput: 'Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nWriting objects: 100% (3/3), 287 bytes | 287.00 KiB/s, done.\nTotal 3 (delta 0), reused 0 (delta 0)\nTo https://github.com/user/repo.git\n   a3f2c9b..f8e1d4a  main -> main'
            },
            {
                id: 16,
                difficulty: 'remote',
                scenario: 'Pull the latest changes from the remote "main" branch.',
                answer: 'git pull origin main',
                alternatives: ['git pull'],
                hint: 'Downloads and merges changes',
                category: 'Remote',
                points: 200,
                terminalOutput: 'From https://github.com/user/repo\n * branch            main       -> FETCH_HEAD\nUpdating a3f2c9b..f8e1d4a\nFast-forward\n src/app.js | 25 +++++++++++++++++++++++++\n 1 file changed, 25 insertions(+)'
            },
            {
                id: 17,
                difficulty: 'remote',
                scenario: 'Clone the repository from https://github.com/user/project.git',
                answer: 'git clone https://github.com/user/project.git',
                alternatives: [],
                hint: 'Downloads entire repository',
                category: 'Remote',
                points: 200,
                terminalOutput: 'Cloning into \'project\'...\nremote: Enumerating objects: 42, done.\nremote: Counting objects: 100% (42/42), done.\nremote: Compressing objects: 100% (28/28), done.\nReceiving objects: 100% (42/42), 8.52 KiB | 1.70 MiB/s, done.\nResolving deltas: 100% (12/12), done.'
            },
            {
                id: 18,
                difficulty: 'remote',
                scenario: 'Fetch changes from remote without merging them.',
                answer: 'git fetch',
                alternatives: ['git fetch origin'],
                hint: 'Downloads without merging',
                category: 'Remote',
                points: 200,
                terminalOutput: 'remote: Enumerating objects: 5, done.\nremote: Counting objects: 100% (5/5), done.\nremote: Total 3 (delta 0), reused 0 (delta 0)\nUnpacking objects: 100% (3/3), done.\nFrom https://github.com/user/repo\n   a3f2c9b..f8e1d4a  main       -> origin/main'
            },
            {
                id: 19,
                difficulty: 'remote',
                scenario: 'View all configured remote repositories.',
                answer: 'git remote -v',
                alternatives: ['git remote --verbose', 'git remote'],
                hint: 'Lists remote connections',
                category: 'Remote',
                points: 200,
                terminalOutput: 'origin\thttps://github.com/user/repo.git (fetch)\norigin\thttps://github.com/user/repo.git (push)'
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
                points: 250,
                terminalOutput: 'Saved working directory and index state WIP on main: a3f2c9b Add feature'
            },
            {
                id: 22,
                difficulty: 'advanced',
                scenario: 'Apply the most recent stashed changes back to your working directory.',
                answer: 'git stash pop',
                alternatives: ['git stash apply'],
                hint: 'Restores stashed changes',
                category: 'Advanced',
                points: 250,
                terminalOutput: 'On branch main\nChanges not staged for commit:\n  modified:   src/app.js\n\nDropped refs/stash@{0} (f8e1d4a)'
            },
            {
                id: 23,
                difficulty: 'advanced',
                scenario: 'Rebase your current branch onto main.',
                answer: 'git rebase main',
                alternatives: [],
                hint: 'Reapplies commits on top',
                category: 'Advanced',
                points: 250,
                terminalOutput: 'Successfully rebased and updated refs/heads/feature.\n3 commits applied'
            },
            {
                id: 24,
                difficulty: 'advanced',
                scenario: 'Undo the last commit but keep the changes in your working directory.',
                answer: 'git reset head~1',
                alternatives: ['git reset --soft head~1', 'git reset --mixed head~1'],
                hint: 'Moves HEAD pointer',
                category: 'Advanced',
                points: 250,
                terminalOutput: 'Unstaged changes after reset:\nM\tsrc/app.js\nM\tREADME.md'
            },
            {
                id: 25,
                difficulty: 'advanced',
                scenario: 'Apply only commit abc123 to your current branch.',
                answer: 'git cherry-pick abc123',
                alternatives: [],
                hint: 'Applies specific commit',
                category: 'Advanced',
                points: 250,
                terminalOutput: '[main f8e1d4a] Feature: Add login\n Date: Sat Oct 18 15:45:30 2025\n 1 file changed, 42 insertions(+)'
            },
            {
                id: 26,
                difficulty: 'advanced',
                scenario: 'Create a tag named "v1.0" for the current commit.',
                answer: 'git tag v1.0',
                alternatives: ['git tag -a v1.0'],
                hint: 'Marks a specific point',
                category: 'Advanced',
                points: 250,
                terminalOutput: ''  // Silent success
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
            },
            
            // DEVOPS & CI/CD (Checkpoint 8+)
            {
                id: 35,
                difficulty: 'remote',
                scenario: 'Force push your local branch to remote (use with caution!).',
                answer: 'git push -f',
                alternatives: ['git push --force', 'git push origin main -f', 'git push --force-with-lease'],
                flexibleMatch: true,
                hint: 'Overwrites remote branch',
                category: 'DevOps',
                points: 200
            },
            {
                id: 36,
                difficulty: 'advanced',
                scenario: 'Show the changes introduced by a specific commit abc123.',
                answer: 'git show abc123',
                alternatives: ['git show abc123', 'git diff abc123^!'],
                flexibleMatch: true,
                hint: 'Displays commit details',
                category: 'DevOps',
                points: 250
            },
            {
                id: 37,
                difficulty: 'basic',
                scenario: 'Configure your global Git username as "developer".',
                answer: 'git config --global user.name developer',
                alternatives: ['git config --global user.name "developer"'],
                flexibleMatch: true,
                hint: 'Sets Git username',
                category: 'Basic',
                points: 100
            },
            {
                id: 38,
                difficulty: 'basic',
                scenario: 'Configure your global Git email as dev@example.com.',
                answer: 'git config --global user.email dev@example.com',
                alternatives: ['git config --global user.email "dev@example.com"'],
                flexibleMatch: true,
                hint: 'Sets Git email',
                category: 'Basic',
                points: 100
            },
            {
                id: 39,
                difficulty: 'branching',
                scenario: 'Rename the current branch to "new-name".',
                answer: 'git branch -m new-name',
                alternatives: ['git branch --move new-name'],
                hint: 'Moves/renames branch',
                category: 'Branching',
                points: 150
            },
            {
                id: 40,
                difficulty: 'advanced',
                scenario: 'Create a lightweight tag "v1.0" for the current commit.',
                answer: 'git tag v1.0',
                alternatives: ['git tag -a v1.0'],
                flexibleMatch: true,
                hint: 'Marks a version',
                category: 'DevOps',
                points: 250
            },
            {
                id: 41,
                difficulty: 'advanced',
                scenario: 'Push all tags to the remote repository.',
                answer: 'git push --tags',
                alternatives: ['git push origin --tags'],
                hint: 'Uploads version tags',
                category: 'DevOps',
                points: 250
            },
            {
                id: 42,
                difficulty: 'remote',
                scenario: 'Set the upstream branch for current branch to track origin/main.',
                answer: 'git branch --set-upstream-to=origin/main',
                alternatives: ['git push -u origin main', 'git branch -u origin/main'],
                flexibleMatch: true,
                hint: 'Links local to remote',
                category: 'Remote',
                points: 200
            },
            
            // SECURITY & BEST PRACTICES (Checkpoint 10+)
            {
                id: 43,
                difficulty: 'expert',
                scenario: 'Remove sensitive file secrets.txt from Git history.',
                answer: 'git filter-branch --tree-filter "rm -f secrets.txt"',
                alternatives: ['git filter-branch', 'git filter-repo'],
                acceptVariations: true,
                hint: 'Rewrites history',
                category: 'Security',
                points: 300
            },
            {
                id: 44,
                difficulty: 'advanced',
                scenario: 'Sign your commit with GPG key.',
                answer: 'git commit -S',
                alternatives: ['git commit --gpg-sign', 'git commit -S -m message'],
                flexibleMatch: true,
                hint: 'Cryptographic signature',
                category: 'Security',
                points: 250
            },
            {
                id: 45,
                difficulty: 'expert',
                scenario: 'Verify the GPG signature of the last commit.',
                answer: 'git verify-commit HEAD',
                alternatives: ['git log --show-signature'],
                hint: 'Checks commit authenticity',
                category: 'Security',
                points: 300
            },
            {
                id: 46,
                difficulty: 'advanced',
                scenario: 'Create a .gitignore file to ignore node_modules directory.',
                answer: 'echo node_modules > .gitignore',
                alternatives: ['git ignore node_modules', 'echo "node_modules" > .gitignore'],
                acceptVariations: true,
                hint: 'Excludes files from Git',
                category: 'Security',
                points: 250
            },
            
            // COLLABORATION & WORKFLOWS (Checkpoint 11+)
            {
                id: 47,
                difficulty: 'remote',
                scenario: 'Fetch and merge changes from upstream remote.',
                answer: 'git pull upstream main',
                alternatives: ['git fetch upstream', 'git pull upstream'],
                flexibleMatch: true,
                hint: 'Syncs with upstream',
                category: 'Collaboration',
                points: 200
            },
            {
                id: 48,
                difficulty: 'branching',
                scenario: 'Create a new branch from a specific commit abc123.',
                answer: 'git checkout -b newbranch abc123',
                alternatives: ['git branch newbranch abc123', 'git switch -c newbranch abc123'],
                flexibleMatch: true,
                hint: 'Branch from commit',
                category: 'Collaboration',
                points: 150
            },
            {
                id: 49,
                difficulty: 'advanced',
                scenario: 'Squash the last 3 commits into one.',
                answer: 'git rebase -i HEAD~3',
                alternatives: ['git rebase --interactive HEAD~3'],
                hint: 'Combines commits',
                category: 'Collaboration',
                points: 250
            },
            {
                id: 50,
                difficulty: 'expert',
                scenario: 'Abort an ongoing merge conflict.',
                answer: 'git merge --abort',
                alternatives: ['git reset --merge'],
                hint: 'Cancels merge',
                category: 'Collaboration',
                points: 300
            },
            {
                id: 51,
                difficulty: 'expert',
                scenario: 'Abort an ongoing rebase operation.',
                answer: 'git rebase --abort',
                alternatives: [],
                hint: 'Cancels rebase',
                category: 'Collaboration',
                points: 300
            },
            
            // CLOUD & DEPLOYMENT (Checkpoint 12+)
            {
                id: 52,
                difficulty: 'remote',
                scenario: 'Deploy by pushing to heroku remote.',
                answer: 'git push heroku main',
                alternatives: ['git push heroku master'],
                flexibleMatch: true,
                hint: 'Cloud deployment',
                category: 'Cloud',
                points: 200
            },
            {
                id: 53,
                difficulty: 'advanced',
                scenario: 'Create a Git archive of the current branch as a zip file.',
                answer: 'git archive -o project.zip HEAD',
                alternatives: ['git archive --format=zip HEAD', 'git archive HEAD'],
                acceptVariations: true,
                hint: 'Exports repository',
                category: 'Cloud',
                points: 250
            },
            {
                id: 54,
                difficulty: 'remote',
                scenario: 'Add a second remote called "backup" for disaster recovery.',
                answer: 'git remote add backup url',
                alternatives: ['git remote add backup'],
                acceptVariations: true,
                hint: 'Multiple remotes',
                category: 'Cloud',
                points: 200
            },
            
            // DEBUGGING & TROUBLESHOOTING (Checkpoint 13+)
            {
                id: 55,
                difficulty: 'expert',
                scenario: 'Find which commit introduced a bug using binary search.',
                answer: 'git bisect start',
                alternatives: ['git bisect'],
                hint: 'Binary search commits',
                category: 'Debugging',
                points: 300
            },
            {
                id: 56,
                difficulty: 'expert',
                scenario: 'Mark the current commit as bad during bisect.',
                answer: 'git bisect bad',
                alternatives: [],
                hint: 'Bisect marker',
                category: 'Debugging',
                points: 300
            },
            {
                id: 57,
                difficulty: 'expert',
                scenario: 'Mark a commit as good during bisect.',
                answer: 'git bisect good',
                alternatives: ['git bisect good abc123'],
                flexibleMatch: true,
                hint: 'Bisect marker',
                category: 'Debugging',
                points: 300
            },
            {
                id: 58,
                difficulty: 'advanced',
                scenario: 'Find who last modified each line of file.txt.',
                answer: 'git blame file.txt',
                alternatives: ['git annotate file.txt'],
                hint: 'Line-by-line history',
                category: 'Debugging',
                points: 250
            },
            {
                id: 59,
                difficulty: 'advanced',
                scenario: 'Search for commits containing the word "bugfix" in message.',
                answer: 'git log --grep=bugfix',
                alternatives: ['git log --grep bugfix', 'git log --grep="bugfix"'],
                flexibleMatch: true,
                hint: 'Search commit messages',
                category: 'Debugging',
                points: 250
            },
            {
                id: 60,
                difficulty: 'expert',
                scenario: 'Show commits that changed file.txt.',
                answer: 'git log file.txt',
                alternatives: ['git log -- file.txt', 'git log --follow file.txt'],
                flexibleMatch: true,
                hint: 'File history',
                category: 'Debugging',
                points: 300
            },
            
            // PERFORMANCE & OPTIMIZATION (Checkpoint 14+)
            {
                id: 61,
                difficulty: 'expert',
                scenario: 'Optimize the local repository by running garbage collection.',
                answer: 'git gc',
                alternatives: ['git gc --aggressive'],
                flexibleMatch: true,
                hint: 'Cleans up repository',
                category: 'Performance',
                points: 300
            },
            {
                id: 62,
                difficulty: 'advanced',
                scenario: 'Clone only the latest commit (shallow clone) to save bandwidth.',
                answer: 'git clone --depth 1 url',
                alternatives: ['git clone --depth=1'],
                acceptVariations: true,
                hint: 'Faster clone',
                category: 'Performance',
                points: 250
            },
            {
                id: 63,
                difficulty: 'expert',
                scenario: 'Prune remote-tracking branches that no longer exist.',
                answer: 'git remote prune origin',
                alternatives: ['git fetch --prune', 'git fetch -p'],
                flexibleMatch: true,
                hint: 'Cleans remote refs',
                category: 'Performance',
                points: 300
            },
            
            // ADVANCED WORKFLOWS (Checkpoint 15+)
            {
                id: 64,
                difficulty: 'expert',
                scenario: 'Create a patch file from the last commit.',
                answer: 'git format-patch -1',
                alternatives: ['git format-patch HEAD~1..HEAD', 'git format-patch -1 HEAD'],
                flexibleMatch: true,
                hint: 'Exports commit as patch',
                category: 'Advanced',
                points: 300
            },
            {
                id: 65,
                difficulty: 'expert',
                scenario: 'Apply a patch file to your repository.',
                answer: 'git apply patch.patch',
                alternatives: ['git am patch.patch'],
                acceptVariations: true,
                hint: 'Imports patch',
                category: 'Advanced',
                points: 300
            },
            {
                id: 66,
                difficulty: 'advanced',
                scenario: 'Show a summary of changes in the staging area.',
                answer: 'git diff --staged',
                alternatives: ['git diff --cached'],
                hint: 'Shows staged changes',
                category: 'Basic',
                points: 250
            },
            {
                id: 67,
                difficulty: 'advanced',
                scenario: 'Temporarily switch to a different commit to examine it.',
                answer: 'git checkout abc123',
                alternatives: ['git switch --detach abc123'],
                flexibleMatch: true,
                hint: 'Detached HEAD',
                category: 'Advanced',
                points: 250
            },
            {
                id: 68,
                difficulty: 'expert',
                scenario: 'Find commits in current branch but not in main.',
                answer: 'git log main..HEAD',
                alternatives: ['git log main..', 'git cherry main'],
                flexibleMatch: true,
                hint: 'Compare branches',
                category: 'Advanced',
                points: 300
            },
            {
                id: 69,
                difficulty: 'expert',
                scenario: 'Revert a merge commit abc123.',
                answer: 'git revert -m 1 abc123',
                alternatives: ['git revert --mainline 1 abc123'],
                flexibleMatch: true,
                hint: 'Undoes merge',
                category: 'Advanced',
                points: 300
            },
            {
                id: 70,
                difficulty: 'advanced',
                scenario: 'Copy a commit from another branch to current branch.',
                answer: 'git cherry-pick abc123',
                alternatives: [],
                hint: 'Selective commit apply',
                category: 'Advanced',
                points: 250
            },
            
            // GIT SUBMODULES & SUBTREES (Checkpoint 16+)
            {
                id: 71,
                difficulty: 'expert',
                scenario: 'Add a Git submodule from https://github.com/user/lib.git.',
                answer: 'git submodule add https://github.com/user/lib.git',
                alternatives: [],
                hint: 'Nested repository',
                category: 'Advanced',
                points: 300
            },
            {
                id: 72,
                difficulty: 'expert',
                scenario: 'Update all submodules to their latest commits.',
                answer: 'git submodule update --remote',
                alternatives: ['git submodule update --recursive --remote'],
                flexibleMatch: true,
                hint: 'Syncs submodules',
                category: 'Advanced',
                points: 300
            },
            {
                id: 73,
                difficulty: 'expert',
                scenario: 'Initialize and clone all submodules after cloning a repo.',
                answer: 'git submodule init',
                alternatives: ['git submodule update --init', 'git clone --recursive'],
                flexibleMatch: true,
                hint: 'Sets up submodules',
                category: 'Advanced',
                points: 300
            },
            
            // MONOREPO & LARGE REPOS (Checkpoint 17+)
            {
                id: 74,
                difficulty: 'expert',
                scenario: 'Enable Git LFS for tracking large binary files.',
                answer: 'git lfs install',
                alternatives: ['git lfs track'],
                acceptVariations: true,
                hint: 'Large File Storage',
                category: 'Performance',
                points: 300
            },
            {
                id: 75,
                difficulty: 'expert',
                scenario: 'Track all .zip files with Git LFS.',
                answer: 'git lfs track "*.zip"',
                alternatives: ['git lfs track *.zip'],
                flexibleMatch: true,
                hint: 'LFS file pattern',
                category: 'Performance',
                points: 300
            },
            
            // TEAM WORKFLOWS (Checkpoint 18+)
            {
                id: 76,
                difficulty: 'advanced',
                scenario: 'Fetch all branches from all remotes.',
                answer: 'git fetch --all',
                alternatives: ['git remote update'],
                hint: 'Updates all remotes',
                category: 'Collaboration',
                points: 250
            },
            {
                id: 77,
                difficulty: 'advanced',
                scenario: 'Show which branches contain commit abc123.',
                answer: 'git branch --contains abc123',
                alternatives: ['git branch -a --contains abc123'],
                flexibleMatch: true,
                hint: 'Branch search',
                category: 'Collaboration',
                points: 250
            },
            {
                id: 78,
                difficulty: 'expert',
                scenario: 'Create an orphan branch (no history) for GitHub Pages.',
                answer: 'git checkout --orphan gh-pages',
                alternatives: ['git switch --orphan gh-pages'],
                hint: 'Fresh branch',
                category: 'Cloud',
                points: 300
            },
            {
                id: 79,
                difficulty: 'advanced',
                scenario: 'Compare two branches: feature and main.',
                answer: 'git diff main..feature',
                alternatives: ['git diff main feature', 'git log main..feature'],
                flexibleMatch: true,
                hint: 'Branch comparison',
                category: 'Collaboration',
                points: 250
            },
            {
                id: 80,
                difficulty: 'expert',
                scenario: 'Recover a deleted branch using reflog.',
                answer: 'git reflog',
                alternatives: ['git checkout -b branch HEAD@{n}'],
                acceptVariations: true,
                hint: 'Branch recovery',
                category: 'Debugging',
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
        
        // Normalize: trim, lowercase, remove extra spaces
        let normalized = userInput.trim().toLowerCase().replace(/\s+/g, ' ');
        
        // Remove quotes variations (both single and double)
        normalized = normalized.replace(/["']/g, '');
        
        const correctAnswer = this.currentChallenge.answer.toLowerCase().replace(/["']/g, '');
        const alternatives = this.currentChallenge.alternatives.map(a => 
            a.toLowerCase().replace(/["']/g, '').replace(/\s+/g, ' ')
        );
        
        this.totalAttempts++;
        
        // Check exact match or alternatives
        let isCorrect = normalized === correctAnswer || alternatives.includes(normalized);
        
        // Additional flexible matching for common variations
        if (!isCorrect && this.currentChallenge.flexibleMatch) {
            isCorrect = this.flexibleMatch(normalized, this.currentChallenge);
        }
        
        if (isCorrect) {
            this.correctAnswers++;
            this.failedCommands.delete(this.currentChallenge.id);
        } else {
            this.failedCommands.add(this.currentChallenge.id);
        }
        
        return isCorrect;
    }
    
    flexibleMatch(input, challenge) {
        // Extract the main command (first two words usually)
        const inputParts = input.split(' ');
        const answerParts = challenge.answer.toLowerCase().replace(/["']/g, '').split(' ');
        
        // Must match the main git command (first 2-3 parts)
        const minMatch = Math.min(2, answerParts.length);
        for (let i = 0; i < minMatch; i++) {
            if (inputParts[i] !== answerParts[i]) {
                return false;
            }
        }
        
        // If it's just "git command" without arguments, accept it
        if (inputParts.length === 2 && answerParts.length === 2) {
            return true;
        }
        
        // Accept variations like -m vs --message, -a vs --all, etc.
        if (challenge.acceptVariations) {
            return true;
        }
        
        return false;
    }

    getCheatSheet() {
        const categories = {
            'Basic': [],
            'Branching': [],
            'Remote': [],
            'Advanced': [],
            'Expert': [],
            'DevOps': [],
            'Security': [],
            'Cloud': [],
            'Collaboration': [],
            'Debugging': [],
            'Performance': []
        };
        
        this.challenges.forEach(challenge => {
            if (!categories[challenge.category]) {
                categories[challenge.category] = [];
            }
            categories[challenge.category].push({
                command: challenge.answer,
                description: challenge.scenario,
                hint: challenge.hint
            });
        });
        
        // Remove empty categories
        Object.keys(categories).forEach(key => {
            if (categories[key].length === 0) {
                delete categories[key];
            }
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

