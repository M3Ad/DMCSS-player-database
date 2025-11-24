# Push to GitHub Repository

## Step 1: Install Git

Download and install Git for Windows:
- Visit: https://git-scm.com/download/win
- Download the installer and run it
- Use default settings during installation
- **Restart VS Code** after installation

## Step 2: Configure Git (First Time Only)

Open a new terminal in VS Code and run:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Initialize and Push Repository

Run these commands in the terminal:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Next.js player portal with Supabase"

# Add your GitHub repository as remote
git remote add origin https://github.com/L3AAA/DMCSS-player-database.git

# Push to GitHub (may prompt for GitHub credentials)
git branch -M main
git push -u origin main
```

## Step 4: GitHub Authentication

When prompted for credentials, you have two options:

### Option A: Personal Access Token (Recommended)
1. Go to GitHub.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Player Portal"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again)
7. Use the token as your password when Git prompts you

### Option B: GitHub CLI
```bash
# Install GitHub CLI from https://cli.github.com/
# Then authenticate
gh auth login
```

## Step 5: Verify Upload

After pushing, visit:
https://github.com/L3AAA/DMCSS-player-database

You should see all your files uploaded.

## Future Updates

After making changes, push updates with:

```bash
git add .
git commit -m "Description of your changes"
git push
```

## Important Notes

- Your `.env.local` file is **NOT** pushed (protected by .gitignore)
- You'll need to set environment variables separately in Vercel (see VERCEL_ENV.md)
- Never commit sensitive keys or passwords to GitHub
