# Instructions de compilation — SoundCloud Playlist Button

Ce document fournit les instructions **étape par étape** pour compiler l'extension à partir du code source. Ces instructions garantissent que vous pouvez recréer **exactement** le fichier ZIP distribué.

---

## 📋 Table des matières

1. [Prérequis système](#️-prérequis-système)
2. [Installation des outils](#-installation-des-outils)
3. [Compilation manuelle (étape par étape)](#️-compilation-manuelle-étape-par-étape)
4. [Installation automatisée avec setup.sh](#-installation-automatisée-avec-setupsh)
5. [Vérification du build](#-vérification-du-build)
6. [Structure du package final](#-structure-du-package-final)
7. [Processus de compilation détaillé](#-processus-de-compilation-détaillé)
8. [Dépannage](#️-dépannage)
9. [Support](#-support)
10. [Résumé des commandes](#-résumé-des-commandes)
11. [Checklist de compilation](#-checklist-de-compilation)

---

## 🖥️ Prérequis système

### Systèmes d'exploitation supportés

L'extension peut être compilée sur :

- **macOS** 10.15+ (Catalina ou supérieur)

### Environnement requis

Avant de commencer, assurez-vous d'avoir :

- ✅ **Connexion Internet** (pour télécharger les dépendances npm)
- ✅ **Espace disque** : Au moins 200 MB disponibles
- ✅ **Droits d'administration** (pour installer Node.js et npm si nécessaire)
- ✅ **Terminal/Ligne de commande** accessible

---

## 🔧 Installation des outils

### 1. Node.js et npm

**Version recommandée :**

- **Node.js** : `23.9.0` (spécifiée dans `.nvmrc`)
- **npm** : `10.9.2` (inclus avec Node.js)

**Version minimale requise :**

- **Node.js** : `18.0.0` ou supérieur
- **npm** : `9.0.0` ou supérieur

#### Installation sur macOS

```bash
# Option 1 : Via Homebrew (recommandé)
brew install node

# Option 2 : Via nvm (Node Version Manager) - recommandé pour les développeurs
# Installer nvm depuis https://github.com/nvm-sh/nvm
# Puis utiliser la version spécifiée dans .nvmrc
nvm install
nvm use

# Option 3 : Télécharger depuis nodejs.org
# Visitez https://nodejs.org/ et téléchargez le package macOS
```

> **💡 Note :** Ce projet inclut un fichier `.nvmrc` qui spécifie Node.js 23.9.0 comme version recommandée.

#### Vérification de l'installation

```bash
node --version   # Devrait afficher v18.0.0 ou supérieur
npm --version    # Devrait afficher 9.0.0 ou supérieur
```

### 2. Git (optionnel mais recommandé)

Git n'est **pas strictement requis** pour compiler l'extension, mais il est utile pour cloner le dépôt.

```bash
brew install git
```

---

## 🏗️ Compilation manuelle (étape par étape)

Suivez ces étapes **dans l'ordre** pour compiler l'extension depuis le code source.

### Étape 1 : Obtenir le code source

#### Option A : Cloner avec Git

```bash
# Cloner le dépôt
git clone https://github.com/rousseau-romain/soundcloud-ext.git

# Naviguer dans le répertoire
cd soundcloud-ext
```

#### Option B : Télécharger l'archive ZIP

1. Téléchargez le code source depuis GitHub (bouton "Code" → "Download ZIP")
2. Décompressez l'archive
3. Ouvrez un terminal dans le dossier décompressé

### Étape 2 : Installer les dépendances

```bash
npm install
```

**Que fait cette commande ?**

- Lit le fichier `package.json`
- Télécharge toutes les dépendances listées dans `devDependencies`
- Installe les packages dans le dossier `node_modules/`

**Dépendances installées :**

- `esbuild` v0.27.2 (bundler JavaScript ultra-rapide)
- `typescript` v5.3.3 (compilateur TypeScript)
- `@types/chrome` v0.0.254 (définitions de types pour l'API Chrome)
- `addons-linter` v9.3.0 (validateur Mozilla pour extensions)

**Durée estimée :** 10-30 secondes (selon votre connexion)

### Étape 3 : Nettoyer les builds précédents (recommandé)

```bash
npm run clean
```

Cette commande supprime le dossier `dist/` s'il existe, garantissant un build propre.

### Étape 4 : Compiler le code TypeScript

```bash
npm run build
```

**Que fait cette commande ?**

1. Exécute le script `build.js`
2. Utilise **esbuild** pour :
   - Compiler `src/content.ts` → `dist/content.js`
   - Compiler `src/options.ts` → `dist/options.js`
   - Bundler tous les modules importés en un seul fichier
   - Minifier le code JavaScript
   - Cibler ES2020 pour la compatibilité navigateur

**Durée estimée :** < 1 seconde

**Sortie attendue :**

```
🔨 Building extension...

  dist/content.js  XX.XkB
  dist/options.js  XX.XkB

✅ Build complete!
```

### Étape 5 : Vérifier que les fichiers sont générés

```bash
ls -lh dist/
```

**Vous devriez voir :**

- `dist/content.js` (code du content script compilé)
- `dist/options.js` (code de la page d'options compilée)

### Étape 6 : Créer le package ZIP pour distribution

```bash
npm run package
```

**Que fait cette commande ?**

1. Exécute `npm run clean` (supprime `dist/`)
2. Exécute `npm install` (réinstalle les dépendances proprement)
3. Exécute `npm run build` (compile le TypeScript)
4. Crée une archive ZIP contenant :
   - `manifest.json`
   - `options.html`
   - `icon-48.png`
   - `icon.png`
   - `icon.svg`
   - `dist/content.js`
   - `dist/options.js`

**Nom du fichier généré :**

```
soundcloud-ext-v1.2.3.zip
```

(Le numéro de version est extrait automatiquement de `package.json`)

**Durée totale :** 10-40 secondes

### Étape 7 : Vérifier l'intégrité du package (optionnel)

```bash
# Lister le contenu du ZIP
unzip -l soundcloud-ext-v*.zip

# Valider avec le linter Mozilla (si installé)
npm run lint
```

---

## ⚡ Installation automatisée avec `setup.sh`

Un script d'installation automatisé est fourni pour simplifier le processus.

### Utilisation

```bash
# Rendre le script exécutable
chmod +x setup.sh

# Exécuter le script
./setup.sh
```

### Ce que fait le script

1. ✅ Vérifie que Node.js et npm sont installés
2. ✅ Vérifie les versions minimales requises
3. ✅ Nettoie les builds précédents
4. ✅ Installe les dépendances npm
5. ✅ Compile le code TypeScript
6. ✅ Crée le package ZIP de distribution
7. ✅ Affiche un résumé du build

---

## ✅ Vérification du build

### Tests manuels

1. **Vérifier que le ZIP est créé :**

   ```bash
   ls -lh soundcloud-ext-v*.zip
   ```

2. **Vérifier le contenu du ZIP :**

   ```bash
   unzip -l soundcloud-ext-v*.zip
   ```

3. **Charger l'extension dans le navigateur :**

   **Chrome / Edge / Brave :**
   1. Ouvrir `chrome://extensions/`
   2. Activer "Mode développeur"
   3. Cliquer "Charger l'extension non empaquetée"
   4. Sélectionner le dossier `soundcloud-ext/` (pas le ZIP)
   5. L'extension devrait se charger sans erreur

   **Firefox :**
   1. Ouvrir `about:debugging#/runtime/this-firefox`
   2. Cliquer "Charger un module complémentaire temporaire"
   3. Sélectionner `manifest.json` dans le dossier
   4. L'extension devrait se charger sans erreur

4. **Tester la fonctionnalité :**
   - Aller sur une playlist SoundCloud (ex: <https://soundcloud.com/user/sets/playlist>)
   - Vérifier que le bouton "Sets info" apparaît
   - Tester les 3 modes d'interaction (clic, long-press, Shift+clic)

### Validation automatisée (Mozilla Add-ons)

```bash
npm run lint
```

Cette commande :

- Package l'extension en ZIP
- Exécute **addons-linter** (outil officiel Mozilla)
- Vérifie la conformité avec les standards Firefox
- Signale les warnings et erreurs potentiels

**Sortie attendue :**

```
Validation Summary:
✔ 0 errors
⚠ X warnings
```

---

## 📦 Structure du package final

Le fichier `soundcloud-ext-vX.X.X.zip` contient exactement :

```
soundcloud-ext-vX.X.X.zip
│
├── manifest.json           # Configuration de l'extension (Manifest V3)
├── options.html            # Interface de la page de paramètres
│
├── icon-48.png             # Icône 48x48 (navigateur)
├── icon.png                # Icône 96x96 (haute résolution)
├── icon.svg                # Icône vectorielle
│
└── dist/                   # Code JavaScript compilé
    ├── content.js          # Script injecté dans SoundCloud (bundled & minified)
    └── options.js          # Script de la page de paramètres (bundled & minified)
```

### Fichiers **exclus** du package

Ces fichiers sont uniquement pour le développement :

- ❌ `src/` (code source TypeScript)
- ❌ `node_modules/` (dépendances npm)
- ❌ `build.js` (script de build)
- ❌ `update-version.js` (gestion des versions)
- ❌ `tsconfig.json` (configuration TypeScript)
- ❌ `package.json` et `package-lock.json`
- ❌ `.git/` et `.gitignore`
- ❌ Documentation (README.md, BUILD.md, etc.)

---

## 🔍 Processus de compilation détaillé

### Architecture du build

```
┌─────────────────────────────────────────────────────────┐
│                   CODE SOURCE                           │
├─────────────────────────────────────────────────────────┤
│  src/content.ts  →  Imports:                            │
│    ├─ shared/types.ts                                   │
│    ├─ shared/constants.ts                               │
│    ├─ shared/settings.ts                                │
│    ├─ utils/playlist.ts                                 │
│    ├─ utils/clipboard.ts                                │
│    ├─ ui/button.ts                                      │
│    └─ ui/icon.ts                                        │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
         ┌────────────────────────────┐
         │   esbuild (bundler)        │
         │  - Bundle all modules      │
         │  - Compile TypeScript      │
         │  - Minify code             │
         │  - Target ES2020           │
         └────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              FICHIERS COMPILÉS                          │
├─────────────────────────────────────────────────────────┤
│  dist/content.js  →  Single bundled file (~XX KB)       │
│  dist/options.js  →  Single bundled file (~XX KB)       │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
         ┌────────────────────────────┐
         │   zip (packaging)          │
         │  - Add manifest.json       │
         │  - Add options.html        │
         │  - Add icons               │
         │  - Add dist/ folder        │
         └────────────────────────────┘
                         │
                         ▼
         soundcloud-ext-vX.X.X.zip
         (Prêt pour soumission aux stores)
```

### Outils utilisés

| Outil | Version | Rôle |
|-------|---------|------|
| **Node.js** | ≥18.0.0 | Environnement d'exécution JavaScript |
| **npm** | ≥9.0.0 | Gestionnaire de paquets |
| **esbuild** | 0.27.2 | Bundler et minifier ultra-rapide |
| **TypeScript** | 5.3.3 | Compilation TypeScript → JavaScript |
| **@types/chrome** | 0.0.254 | Définitions de types pour API Chrome |
| **addons-linter** | 9.3.0 | Validateur officiel Mozilla |

### Options de compilation (build.js)

```javascript
{
  entryPoints: ['src/content.ts', 'src/options.ts'],
  bundle: true,              // Bundler tous les imports
  outdir: 'dist',            // Dossier de sortie
  platform: 'browser',       // Cible : navigateurs web
  target: 'es2020',          // Compatibilité ECMAScript 2020
  sourcemap: false,          // Pas de source maps en production
  minify: true,              // Minification activée
  logLevel: 'info'           // Afficher les logs de build
}
```

---

## 🛠️ Dépannage

### Problème : `npm: command not found`

**Cause :** Node.js/npm n'est pas installé ou pas dans le PATH.

**Solution :**

```bash
# Vérifier si Node.js est installé
which node

# Si vide, installer Node.js (voir section "Installation des outils")
```

### Problème : `npm ERR! code EACCES`

**Cause :** Permissions insuffisantes pour installer des packages npm.

**Solution :**

```bash
# Option 1 : Utiliser npx (pas besoin de sudo)
npx npm install

# Option 2 : Corriger les permissions npm
sudo chown -R $(whoami) ~/.npm
```

### Problème : `Error: Cannot find module 'esbuild'`

**Cause :** Les dépendances npm ne sont pas installées.

**Solution :**

```bash
npm install
```

### Problème : Build lent ou bloqué

**Cause :** Cache npm corrompu ou connexion Internet lente.

**Solution :**

```bash
# Nettoyer le cache npm
npm cache clean --force

# Réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème : `npm ERR! Unsupported platform`

**Cause :** Certaines dépendances natives (comme esbuild) ne supportent pas votre plateforme.

**Solution :**
Vérifiez que vous utilisez :

- **Node.js** ≥18.0.0
- **macOS** 10.15+ (Catalina ou supérieur)

### Problème : Le ZIP n'est pas créé

**Cause :** La commande `zip` n'est pas disponible sur votre système.

**Solution :**

```bash
# Installer zip si nécessaire (préinstallé normalement sur macOS)
brew install zip
```

### Problème : Extension ne se charge pas dans le navigateur

**Cause possible :** Erreur de syntaxe ou fichier manquant.

**Solution :**

```bash
# Vérifier que tous les fichiers sont présents
ls manifest.json options.html icon*.png dist/

# Reconstruire proprement
npm run clean && npm run build

# Vérifier les erreurs dans la console du navigateur
# Chrome : chrome://extensions/ → "Details" → "Inspect views: background page"
```

---

## 📞 Support

Si vous rencontrez des problèmes lors de la compilation :

1. **Vérifiez les prérequis** :

   ```bash
   node --version   # ≥18.0.0
   npm --version    # ≥9.0.0
   ```

2. **Essayez un build propre** :

   ```bash
   npm run clean
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Consultez les logs** :
   - Les erreurs de build apparaissent dans le terminal
   - Les erreurs d'extension apparaissent dans la console du navigateur

4. **Reportez un bug** :
   - GitHub Issues : <https://github.com/votre-username/soundcloud-ext/issues>
   - Incluez : version Node.js/npm, OS, message d'erreur complet

---

## 📄 Résumé des commandes

| Commande | Description |
|----------|-------------|
| `npm install` | Installer les dépendances |
| `npm run clean` | Supprimer le dossier dist/ |
| `npm run build` | Compiler TypeScript → JavaScript |
| `npm run watch` | Mode développement (recompile automatiquement) |
| `npm run package` | Créer le ZIP de distribution |
| `npm run lint` | Valider avec addons-linter (Mozilla) |
| `npm run validate` | Build + lint en une commande |

---

## ✅ Checklist de compilation

Avant de soumettre l'extension aux stores :

- [ ] Node.js ≥18.0.0 installé
- [ ] `npm install` exécuté sans erreur
- [ ] `npm run build` réussi
- [ ] Fichiers `dist/content.js` et `dist/options.js` générés
- [ ] `npm run package` créé le ZIP
- [ ] Extension testée dans Chrome/Firefox
- [ ] `npm run lint` sans erreurs critiques
- [ ] Version dans `manifest.json` et `package.json` identiques

---

**Dernière mise à jour :** 2025-12-23
**Version du document :** 1.0
**Extension version :** 1.2.3
