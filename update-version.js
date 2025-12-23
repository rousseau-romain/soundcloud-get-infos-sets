#!/usr/bin/env node

/**
 * Update version number in package.json and manifest.json
 * Usage: node update-version.js <version> [options]
 * Examples:
 *   node update-version.js 1.3.0
 *   node update-version.js patch  (increments 1.2.1 -> 1.2.2)
 *   node update-version.js minor  (increments 1.2.1 -> 1.3.0)
 *   node update-version.js major  (increments 1.2.1 -> 2.0.0)
 *
 * Options:
 *   --no-tag    Skip git tag creation
 *   --no-commit Skip git commit
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGE_JSON = path.join(__dirname, 'package.json');
const MANIFEST_JSON = path.join(__dirname, 'manifest.json');

/**
 * Parse version string into parts
 */
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid version format: ${version}. Expected format: X.Y.Z`);
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10)
  };
}

/**
 * Increment version based on type
 */
function incrementVersion(currentVersion, type) {
  const parts = parseVersion(currentVersion);

  switch (type) {
    case 'major':
      return `${parts.major + 1}.0.0`;
    case 'minor':
      return `${parts.major}.${parts.minor + 1}.0`;
    case 'patch':
      return `${parts.major}.${parts.minor}.${parts.patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}. Use 'major', 'minor', or 'patch'`);
  }
}

/**
 * Update version in a JSON file
 */
function updateJsonFile(filePath, newVersion) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    const oldVersion = json.version;

    json.version = newVersion;

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');

    return { oldVersion, newVersion, file: path.basename(filePath) };
  } catch (error) {
    throw new Error(`Failed to update ${filePath}: ${error.message}`);
  }
}

/**
 * Check if git is available
 */
function isGitAvailable() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if in a git repository
 */
function isGitRepository() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Execute git command
 */
function execGit(command, options = {}) {
  try {
    const output = execSync(command, {
      cwd: __dirname,
      encoding: 'utf8',
      ...options
    });
    return output.trim();
  } catch (error) {
    throw new Error(`Git command failed: ${command}\n${error.message}`);
  }
}

/**
 * Check if working directory is clean
 */
function isWorkingDirectoryClean() {
  try {
    const status = execGit('git status --porcelain');
    return status === '';
  } catch {
    return false;
  }
}

/**
 * Commit version changes
 */
function commitVersionChange(version) {
  console.log('\n📝 Committing version changes...');

  execGit('git add package.json manifest.json');
  execGit(`git commit -m "Bump version to ${version}"`);

  console.log(`   ✅ Committed: "Bump version to ${version}"`);
}

/**
 * Create git tag
 */
function createGitTag(version) {
  const tagName = `v${version}`;

  console.log('\n🏷️  Creating git tag...');

  // Check if tag already exists
  try {
    execGit(`git rev-parse ${tagName}`, { stdio: 'ignore' });
    console.log(`   ⚠️  Tag ${tagName} already exists, skipping`);
    return false;
  } catch {
    // Tag doesn't exist, create it
  }

  execGit(`git tag -a ${tagName} -m "Release ${version}"`);
  console.log(`   ✅ Created tag: ${tagName}`);

  return true;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  // Parse flags
  const noTag = args.includes('--no-tag');
  const noCommit = args.includes('--no-commit');
  const versionArg = args.find(arg => !arg.startsWith('--'));

  if (!versionArg) {
    console.error('❌ Error: No version specified\n');
    console.log('Usage: node update-version.js <version> [options]');
    console.log('');
    console.log('Examples:');
    console.log('  node update-version.js 1.3.0        # Set specific version');
    console.log('  node update-version.js patch        # Increment patch (X.Y.Z -> X.Y.Z+1)');
    console.log('  node update-version.js minor        # Increment minor (X.Y.Z -> X.Y+1.0)');
    console.log('  node update-version.js major        # Increment major (X.Y.Z -> X+1.0.0)');
    console.log('');
    console.log('Options:');
    console.log('  --no-tag        Skip git tag creation');
    console.log('  --no-commit     Skip git commit');
    process.exit(1);
  }

  const input = versionArg;
  let newVersion;

  try {
    // Read current version from package.json
    const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
    const currentVersion = pkg.version;

    // Determine new version
    if (['major', 'minor', 'patch'].includes(input)) {
      newVersion = incrementVersion(currentVersion, input);
      console.log(`📦 Current version: ${currentVersion}`);
      console.log(`🔼 Incrementing ${input} version...\n`);
    } else {
      // Validate version format
      parseVersion(input);
      newVersion = input;
      console.log(`📦 Current version: ${currentVersion}\n`);
    }

    // Check git availability
    const gitAvailable = isGitAvailable();
    const gitRepo = gitAvailable && isGitRepository();

    if (!noCommit && gitRepo && !isWorkingDirectoryClean()) {
      console.log('⚠️  Warning: Working directory has uncommitted changes');
      console.log('   Version files will be committed, but other changes will remain staged/unstaged.\n');
    }

    // Update both files
    const packageResult = updateJsonFile(PACKAGE_JSON, newVersion);
    const manifestResult = updateJsonFile(MANIFEST_JSON, newVersion);

    console.log('✅ Version updated successfully!\n');
    console.log(`   ${packageResult.file}: ${packageResult.oldVersion} → ${packageResult.newVersion}`);
    console.log(`   ${manifestResult.file}: ${manifestResult.oldVersion} → ${manifestResult.newVersion}`);

    // Git operations
    if (gitRepo) {
      if (!noCommit) {
        commitVersionChange(newVersion);
      }

      if (!noTag) {
        const tagCreated = createGitTag(newVersion);

        if (tagCreated) {
          console.log('');
          console.log('📤 To push changes and tags to remote:');
          console.log(`   git push origin main --tags`);
        }
      }
    } else if (!gitAvailable) {
      console.log('\nℹ️  Git not available, skipping commit and tag');
    } else if (!gitRepo) {
      console.log('\nℹ️  Not a git repository, skipping commit and tag');
    }

    // Next steps
    console.log('');
    console.log('📋 Next steps:');
    if (noCommit) {
      console.log('  1. Review changes: git diff');
      console.log(`  2. Commit: git add -A && git commit -m "Bump version to ${newVersion}"`);
      if (noTag) {
        console.log(`  3. Tag: git tag -a v${newVersion} -m "Release ${newVersion}"`);
      }
    }
    console.log(`  ${noCommit ? '4' : '1'}. Build: npm run build`);
    console.log(`  ${noCommit ? '5' : '2'}. Test the extension`);
    console.log(`  ${noCommit ? '6' : '3'}. Package: npm run package`);
    console.log(`  ${noCommit ? '7' : '4'}. Upload soundcloud-ext-v${newVersion}.zip to store`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
