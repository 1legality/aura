# Project Restart Prompt: Aura

## Context
Aura is a digital signage application originally built using Angular 5, Electron 2, and several outdated libraries (`videogular2`, `angular-sortablejs`, `ngx-electron`, `electron-json-storage`).

The goal of this project is to **restart** the application from scratch using modern web technologies in 2026. The core functionality is to act as a local media player that turns a screen into a digital signage display. It has no network capabilities, meaning it only plays local files (HTML, images, and videos).

## Technology Stack
- **Framework:** React (latest stable, e.g., React 18+ or 19)
- **Desktop Wrapper:** Tauri (for a smaller bundle size and modern, secure architecture)
- **Styling:** TailwindCSS
- **State Management:** React Context, Zustand, or Jotai
- **Drag & Drop:** `@dnd-kit/core` or `react-beautiful-dnd` (to replace `angular-sortablejs`)
- **Video Player:** HTML5 native video player or a modern React-compatible wrapper (to replace `videogular2`)
- **Local Storage:** Tauri's `tauri-plugin-store` (to replace `electron-json-storage`)

## Core Features to Replicate

### 1. Setup / Playlist Management (`SetupComponent` equivalent)
- **Drag and Drop Files:** Users can drag and drop local files (images, videos, HTML/text) into the app to add them to the playlist.
- **File Input:** Users can also click a button to select local files via a file dialog (using Tauri's dialog API).
- **Playlist Order:** Users can reorder the items in the playlist using drag and drop.
- **Duration Configuration:** Users can set the display duration (in seconds) for each media file.
    - *Special Case for Videos:* The app needs to automatically detect the duration of video files so they play in their entirety.
- **Save/Load/Delete Playlists:** Users can save the current playlist under a specific name, load previously saved playlists, and delete saved playlists. This data must be persisted locally (using `tauri-plugin-store`).
- **Clear Playlist:** A button to empty the current playlist.

### 2. Fullscreen Player (`PlayerComponent` equivalent)
- **Auto-Play:** When "Play" is clicked, the app enters full-screen mode and begins iterating through the playlist.
- **Seamless Transitions:** The original app used a two-window approach (`window.one` and `window.two`) to preload the next file and toggle visibility to ensure seamless transitions between media files. The new app should achieve a similar seamless transition effect, potentially using two hidden/visible React components.
- **Supported Media Types:**
    - Images (`<img>` tags)
    - Videos (`<video>` tags with autoplay)
    - Local HTML files (`<iframe>` tags)
- **Power Management:** The app should use Tauri APIs (or custom Rust code via Tauri commands) to prevent the display from sleeping while the player is active.
- **Keyboard Controls:**
    - Press `1` to exit full-screen mode, stop playback, and return to the setup screen.
    - Press `2` to skip the current file and immediately go to the next file in the playlist.
- **Notifications:** Brief on-screen notifications (e.g., "Press 1 to quit full screen mode") that fade out after a few seconds.

## Backend Communication (Tauri Rust Backend)
The Tauri Rust backend (replacing Electron's `main.js`) needs to handle:
- `fullscreen`: Toggling full-screen mode and managing power-save APIs to prevent the display from sleeping.
- File system access for reading dragged-and-dropped local files securely.
- Persisting playlists via `tauri-plugin-store` (or directly via Rust file I/O).

## Suggested Development Steps
1. Scaffold a new React + Tauri project using `create-tauri-app`.
2. Setup the Rust backend to handle full-screen, power management, and file system access.
3. Setup `tauri-plugin-store` for playlist persistence.
4. Implement the Setup screen with `@dnd-kit/core` for the playlist and file uploading logic.
5. Implement the Player screen to handle full-screen playback, media duration timers, and seamless transitions.
6. Package the application for Windows and Linux using Tauri's build commands.
