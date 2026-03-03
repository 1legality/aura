# Project Restart Prompt: Aura

## Context
Aura is a digital signage application originally built using Angular 5, Electron 2, and several outdated libraries (`videogular2`, `angular-sortablejs`, `ngx-electron`, `electron-json-storage`).

The goal of this project is to **restart** the application from scratch using modern web technologies. The core functionality is to act as a local media player that turns a screen into a digital signage display. It has no network capabilities, meaning it only plays local files (HTML, images, and videos).

## Technology Stack
- **Framework:** Angular (latest stable, e.g., Angular 17+)
- **Desktop Wrapper:** Electron (latest stable) or Tauri (if preferred for smaller bundle size, but Electron is the direct equivalent)
- **Styling:** Bootstrap 5+ (via `ng-bootstrap` or similar) or TailwindCSS
- **State Management / Communication:** Modern Angular services, Signals, or RxJS.
- **Drag & Drop:** Angular CDK Drag and Drop (to replace `angular-sortablejs`)
- **Video Player:** HTML5 native video player or a modern Angular-compatible wrapper (to replace `videogular2`)
- **Local Storage:** Electron IPC with a modern key-value store like `electron-store` (to replace `electron-json-storage`)

## Core Features to Replicate

### 1. Setup / Playlist Management (`SetupComponent`)
- **Drag and Drop Files:** Users can drag and drop local files (images, videos, HTML/text) into the app to add them to the playlist.
- **File Input:** Users can also click a button to select local files via a file dialog.
- **Playlist Order:** Users can reorder the items in the playlist using drag and drop.
- **Duration Configuration:** Users can set the display duration (in seconds) for each media file.
    - *Special Case for Videos:* The app needs to automatically detect the duration of video files so they play in their entirety.
- **Save/Load/Delete Playlists:** Users can save the current playlist under a specific name, load previously saved playlists, and delete saved playlists. This data must be persisted locally (e.g., using `electron-store`).
- **Clear Playlist:** A button to empty the current playlist.

### 2. Fullscreen Player (`PlayerComponent`)
- **Auto-Play:** When "Play" is clicked, the app enters full-screen mode and begins iterating through the playlist.
- **Seamless Transitions:** The original app used a two-window approach (`window.one` and `window.two`) to preload the next file and toggle visibility to ensure seamless transitions between media files. The new app should achieve a similar seamless transition effect.
- **Supported Media Types:**
    - Images (`<img>` tags)
    - Videos (`<video>` tags with autoplay)
    - Local HTML files (`<iframe>` tags)
- **Power Management:** The app should use Electron's `powerSaveBlocker` to prevent the display from sleeping while the player is active.
- **Keyboard Controls:**
    - Press `1` to exit full-screen mode, stop playback, and return to the setup screen.
    - Press `2` to skip the current file and immediately go to the next file in the playlist.
- **Notifications:** Brief on-screen notifications (e.g., "Press 1 to quit full screen mode") that fade out after a few seconds.

## IPC Communication (Electron Main Process)
The Electron `main.js` (or `main.ts` in modern setups) needs to handle:
- `fullscreen`: Toggling full-screen mode and starting/stopping the `powerSaveBlocker`.
- `save`: Saving a playlist to local storage.
- `remove`: Deleting a playlist from local storage.
- `get`: Retrieving a specific playlist.
- `getAll`: Retrieving a list of all saved playlist names.

## Suggested Development Steps
1. Scaffold a new Angular project using the Angular CLI.
2. Integrate Electron (or Tauri) into the Angular build process.
3. Setup IPC communication between the Angular renderer and the Electron main process.
4. Implement the `SetupComponent` with Angular CDK Drag and Drop for the playlist and file uploading logic.
5. Implement the `PlayerComponent` to handle full-screen playback, media duration timers, and seamless transitions.
6. Package the application for Windows and Linux.
