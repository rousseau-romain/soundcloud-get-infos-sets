# Version Management Guide

This document explains how to manage version numbers for the SoundCloud Playlist Button extension.

## Quick Start

```bash
# Patch release (bug fixes) - 1.2.1 → 1.2.2
npm run version:patch

# Minor release (new features) - 1.2.1 → 1.3.0
npm run version:minor

# Major release (breaking changes) - 1.2.1 → 2.0.0
npm run version:major
```

## Table of Contents

- [Overview](#overview)
- [Semantic Versioning](#semantic-versioning)
- [Available Commands](#available-commands)
- [What Happens](#what-happens)
- [Options](#options)
- [Complete Release Workflow](#complete-release-workflow)
- [Safety Features](#safety-features)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The version management script (`update-version.js`) automates the process of:

1. ✅ Updating version in `package.json`
2. ✅ Updating version in `manifest.json`
3. ✅ Creating a git commit with a standardized message
4. ✅ Creating an annotated git tag for the release
5. ✅ Providing next steps for building and publishing

## Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/) (semver):

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └─── Bug fixes, no new features
  │     └───────── New features, backwards compatible
  └─────────────── Breaking changes, not backwards compatible
```

### When to Use Each Type

| Version Type | When to Use | Example |
|--------------|-------------|---------|
| **Patch** | Bug fixes, typos, minor tweaks | Fixed export formatting bug |
| **Minor** | New features, additions | Added settings page, new export format |
| **Major** | Breaking changes, removed features | Changed from JSON to CSV format |

## Available Commands

### NPM Scripts

```bash
# Increment patch version (1.2.1 → 1.2.2)
npm run version:patch

# Increment minor version (1.2.1 → 1.3.0)
npm run version:minor

# Increment major version (1.2.1 → 2.0.0)
npm run version:major

# Set specific version
npm run version 2.5.0

# Show usage help
npm run version
```

### Direct Node Usage

```bash
# Increment versions
node update-version.js patch
node update-version.js minor
node update-version.js major

# Set specific version
node update-version.js 1.5.0

# With options
node update-version.js patch --no-tag
node update-version.js minor --no-commit
```

## What Happens

When you run a version command, the script:

### 1. **Updates Version Numbers**
- Updates `version` field in `package.json`
- Updates `version` field in `manifest.json`
- Both files are kept in sync automatically

### 2. **Creates Git Commit**
- Stages only `package.json` and `manifest.json`
- Creates commit with message: `"Bump version to X.Y.Z"`
- Other uncommitted changes are left untouched

### 3. **Creates Git Tag**
- Creates annotated tag: `vX.Y.Z` (e.g., `v1.2.3`)
- Tag message: `"Release X.Y.Z"`
- Annotated tags include author, date, and message

### 4. **Shows Next Steps**
- Displays push command for remote
- Lists build and packaging steps
- Guides you through the release process

## Options

### `--no-commit`

Skip git commit (only update files):

```bash
npm run version patch -- --no-commit
```

Use when you want to review changes before committing.

### `--no-tag`

Skip git tag creation (but still commit):

```bash
npm run version patch -- --no-tag
```

Use when you want to create the tag manually later.

### Combine Options

```bash
npm run version patch -- --no-commit --no-tag
```

Only updates version files, no git operations.

## Complete Release Workflow

### 1. **Prepare for Release**

```bash
# Make sure all changes are committed
git status

# Make sure tests pass (if you have any)
npm run build
# Test the extension manually
```

### 2. **Bump Version**

```bash
# Choose appropriate version type
npm run version:patch   # for bug fixes
npm run version:minor   # for new features
npm run version:major   # for breaking changes
```

**Output:**
```
📦 Current version: 1.2.1
🔼 Incrementing patch version...

✅ Version updated successfully!
   package.json: 1.2.1 → 1.2.2
   manifest.json: 1.2.1 → 1.2.2

📝 Committing version changes...
   ✅ Committed: "Bump version to 1.2.2"

🏷️  Creating git tag...
   ✅ Created tag: v1.2.2

📤 To push changes and tags to remote:
   git push origin main --tags
```

### 3. **Push to Remote**

```bash
# Push commits and tags
git push origin main --tags

# Or push tag separately
git push origin v1.2.2
```

### 4. **Build and Package**

```bash
# Build the extension
npm run build

# Create distribution package
npm run package
```

This creates: `soundcloud-ext-v1.2.2.zip`

### 5. **Publish**

Upload the zip file to:
- **Chrome Web Store**: https://chrome.google.com/webstore/devconsole
- **Firefox Add-ons**: https://addons.mozilla.org/developers/

## Safety Features

### Working Directory Check

If you have uncommitted changes:

```
⚠️  Warning: Working directory has uncommitted changes
   Version files will be committed, but other changes will remain staged/unstaged.
```

The script commits ONLY `package.json` and `manifest.json`, leaving other changes untouched.

### Tag Collision Prevention

If tag already exists:

```
🏷️  Creating git tag...
   ⚠️  Tag v1.2.2 already exists, skipping
```

The script won't overwrite existing tags.

### Git Repository Detection

Not in a git repository?
```
ℹ️  Not a git repository, skipping commit and tag
```

Git not installed?
```
ℹ️  Git not available, skipping commit and tag
```

Version files are still updated, but git operations are skipped.

## Examples

### Example 1: Bug Fix Release

```bash
# Fixed a bug in URL formatting
npm run version:patch

# Output:
# 1.2.1 → 1.2.2
# Commit: "Bump version to 1.2.2"
# Tag: v1.2.2

git push origin main --tags
npm run package
```

### Example 2: New Feature Release

```bash
# Added settings page
npm run version:minor

# Output:
# 1.2.2 → 1.3.0
# Commit: "Bump version to 1.3.0"
# Tag: v1.3.0

git push origin main --tags
npm run package
```

### Example 3: Manual Version

```bash
# Jump to specific version (e.g., aligning with major release)
npm run version 2.0.0

# Output:
# 1.3.0 → 2.0.0
# Commit: "Bump version to 2.0.0"
# Tag: v2.0.0
```

### Example 4: Review Before Commit

```bash
# Update files only
npm run version patch -- --no-commit

# Review changes
git diff

# Commit manually if satisfied
git add package.json manifest.json
git commit -m "Bump version to 1.2.3"
git tag -a v1.2.3 -m "Release 1.2.3"
```

## Troubleshooting

### Problem: "Git command failed"

**Solution:** Make sure git is installed and you're in a git repository:
```bash
git --version
git status
```

### Problem: Tag already exists

**Solution:** Delete the existing tag first:
```bash
# Delete local tag
git tag -d v1.2.2

# Delete remote tag (if pushed)
git push origin :refs/tags/v1.2.2

# Then run version command again
npm run version:patch
```

### Problem: Wrong version committed

**Solution:** Rollback the commit and tag:
```bash
# Undo last commit (keeps changes)
git reset --soft HEAD~1

# Or undo completely
git reset --hard HEAD~1

# Delete the tag
git tag -d v1.2.2

# Run version command with correct version
npm run version:minor
```

### Problem: Uncommitted changes warning

**Solution:** Either:
1. Commit your other changes first
2. Use `--no-commit` to update version files only
3. Proceed anyway (version files will be committed separately)

### Problem: Can't push tags

**Solution:** Make sure you include `--tags` flag:
```bash
# This doesn't push tags
git push origin main

# This pushes tags
git push origin main --tags
```

## Advanced Usage

### Pre-release Versions

For beta/alpha releases:
```bash
npm run version 2.0.0-beta.1
npm run version 2.0.0-rc.1
```

### View All Tags

```bash
# List all tags
git tag

# List tags matching pattern
git tag -l "v1.2.*"

# Show tag details
git show v1.2.2
```

### Delete Tags

```bash
# Delete local tag
git tag -d v1.2.2

# Delete remote tag
git push origin --delete v1.2.2
```

### Sync with Remote

```bash
# Fetch tags from remote
git fetch --tags

# Push all tags
git push --tags
```

## Benefits

### Before Automation

```bash
# Manual process (error-prone):
# 1. Edit package.json → set version to 1.2.2
# 2. Edit manifest.json → set version to 1.2.2
# 3. git add package.json manifest.json
# 4. git commit -m "Bump version to 1.2.2"
# 5. git tag -a v1.2.2 -m "Release 1.2.2"
```

**Time:** ~2-3 minutes
**Risk:** Version mismatch, typos, forgotten tags

### After Automation

```bash
npm run version:patch
```

**Time:** ~5 seconds
**Risk:** None (automated, consistent, validated)

## Git History

With this system, your git history stays clean:

```bash
$ git log --oneline --decorate

e48156a (HEAD -> main, tag: v1.2.2) Bump version to 1.2.2
93d7e7c add License
9d98269 fix mozilla requirement
10ff73c update svg creation
```

## GitHub/GitLab Integration

Tags automatically create release points:

- **GitHub:** Tags appear in Releases page
- **GitLab:** Tags appear in Tags/Releases section
- **Automatic:** No manual release creation needed

## Related Commands

```bash
# Build the extension
npm run build

# Watch for changes during development
npm run watch

# Clean build artifacts
npm run clean

# Validate and lint
npm run validate

# Create distribution package
npm run package
```

## Version History Format

Commit messages follow this format:
```
Bump version to X.Y.Z
```

Tags follow this format:
```
vX.Y.Z
```

This consistency helps with:
- Automated changelog generation
- Release note creation
- Version tracking in git history

---

## Quick Reference

| Task | Command |
|------|---------|
| Bug fix release | `npm run version:patch` |
| New feature release | `npm run version:minor` |
| Breaking change release | `npm run version:major` |
| Custom version | `npm run version 1.5.0` |
| View tags | `git tag` |
| Push to remote | `git push origin main --tags` |
| Build extension | `npm run build` |
| Package for release | `npm run package` |

---

**Last Updated:** December 2024
**Script Location:** `update-version.js`
**Maintained By:** Project maintainers
