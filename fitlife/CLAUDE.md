# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Server Management
- **Start development server**: `./start-server.sh` (uses Python3/Python/PHP, serves on port 8005)
- **Alternative server**: `python3 -m http.server 8005` or `php -S localhost:8005`

### Image Management
- **Replace all images**: `./replace-all-homepage-images.sh` (replaces 16 images with diverse visual styles)
- **Test image replacement**: `./test-image-replacement.sh`
- **Download images**: `./download-images.sh` or `./download-trainer-images.sh`

### Build Tools
- **Dependencies**: `npm install` (minimal dependencies: dotenv, express, nodemailer)
- No build process required - this is a static website with dynamic component loading

## Architecture Overview

### Project Structure
This is a modular fitness website with a component-based architecture:

```
fitness-website/
├── index.html                 # Main entry point
├── components/                # Modular HTML components
│   ├── header.html
│   ├── hero.html
│   ├── about.html
│   └── [other components]
├── js/
│   ├── app.js                 # Main application orchestrator
│   ├── component-loader.js    # Dynamic component loading
│   └── modules/               # Feature modules
│       ├── config.js          # Global configuration
│       ├── navigation.js      # Navigation logic
│       ├── hero-slider.js     # Hero carousel
│       └── [other modules]
├── css/
├── images/
└── start-server.sh           # Development server
```

### Component System
- **Dynamic Loading**: Components are loaded asynchronously via `component-loader.js`
- **Modular Architecture**: Each feature is a separate module in `js/modules/`
- **Configuration-Driven**: All modules use centralized config in `js/modules/config.js`

### Key Components
1. **Component Loader**: Dynamically loads HTML components into containers
2. **App Orchestrator**: `FitnessApp` class coordinates all modules
3. **Module System**: Feature-based modules (navigation, hero slider, trainers, etc.)
4. **Configuration**: Centralized config with helper functions for getting/setting values

### Authentication Architecture
- **Modular Auth**: `js/modules/auth-core.js` handles authentication logic
- **User Management**: `js/modules/user-manager.js` manages user data
- **Avatar System**: `js/modules/avatar-manager.js` handles profile pictures

### Data Flow
1. `index.html` loads `component-loader.js` and `app.js`
2. `ComponentLoader` fetches HTML components from `/components/`
3. `FitnessApp` initializes all modules after components load
4. Modules communicate via custom events and shared configuration

## Configuration System

### Global Config
- Located in `js/modules/config.js`
- Provides `getConfig(path)` and `setConfig(path, value)` helpers
- Includes settings for animations, navigation, BMI calculator, etc.

### Key Configuration Areas
- **Hero Slider**: Auto-play, intervals, touch controls
- **Navigation**: Scroll offsets, mobile breakpoints
- **Animations**: Scroll thresholds, durations
- **Storage**: Local storage keys and expiry

## Image Management System

### Image Replacement
- **Automated**: `replace-all-homepage-images.sh` handles 16 images
- **Categories**: Hero carousel (6), facilities (6), gallery (4)
- **Backup System**: Automatic timestamped backups in `images/backup-*/`
- **Validation**: File size, format checking, damage detection

### Image Sources
- Multiple documentation files guide image sourcing and replacement
- Diverse visual styles to avoid repetition
- Automated download scripts for consistent sourcing

## Development Notes

### Testing
- No automated test suite - manual testing in browser
- Image replacement has dedicated test script
- Server startup includes port conflict detection

### Deployment
- Static site - no build process required
- All assets are self-contained
- Server script handles multiple Python/PHP versions

### Modular Development
- Each feature is a separate module
- Components are loaded dynamically
- Configuration is centralized
- Event-driven communication between modules