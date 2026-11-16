# SkinsArts Studio

Web tool and automation suite for generating, previewing, and uploading 27-part Minecraft skin murals (`72x24`) for NameMC profiles.

Live application: [https://skinsarts-studio.vercel.app](https://skinsarts-studio.vercel.app)

---

## Overview

Creating a 27-skin mural on NameMC requires resizing an image into an exact `72x24` pixel grid, slicing it into twenty-seven `8x8` face textures (`a(1).png` through `c(9).png`), embedding each slice onto a `64x64` Minecraft skin template, preventing NameMC from discarding duplicate tiles as recycled skins, and uploading all 27 files in reverse order.

**SkinsArts Studio** handles this entire workflow in a single streamlined interface and includes a built-in Node.js script generator (`script/`) to automate browser uploads and high-resolution profile captures.

---

## Core Capabilities

- **Exact 72x24 Detection & Real-Time Slicing:** Supports drag-and-drop, file selection, and clipboard paste (`Ctrl + V`). Images measuring `72x24` are automatically detected and locked at `1:1` with pure pixel preservation.
- **Multi-Base Skin Slots & Distribution:** Configure up to 3 distinct base skins (Skin A, Skin B, Skin C) with live previews. Distribute them across the 27 tiles using:
  - **1 Skin (Only A):** Standard single-skin base for all 27 tiles.
  - **Alternated (`c9=A`, `c8=B`, `c7=C`...):** Follows the reverse upload sequence to alternate base skins seamlessly.
  - **By Rows (A, B, C):** Row A (`a1-a9`) uses Skin A, Row B (`b1-b9`) uses Skin B, and Row C (`c1-c9`) uses Skin C.
- **Preserve Clean Skin on `a(1)` (Final Active Skin):** Because `a(1)` is the last file uploaded, it becomes your active in-game Minecraft skin. Enabling this option retains your full original skin on `a(1).png` instead of overwriting it with the mural corner.
- **Official Minecraft Skin Resolution:** Queries Mojang profile and session servers (`textures.minecraft.net`) to load textures for single or comma-separated usernames (e.g., `Dream, Notch, MrBeast`), automatically detecting Classic (`4px` Steve) or Slim (`3px` Alex) arm models.
- **Mural Layering & Skin Flipping:** Supports base head layer (`8,8`), outer hat/mask layer (`40,8`) with customizable suspension strings, full `64x64` skin flipping, and `(0,0)` corner face watermarks.
- **Cryptographic Hash-Breaker Protection:** Injects an imperceptible color sub-pixel variation on identical tiles so NameMC registers every tile as a unique skin without recycling duplicates.
- **Integrated Node.js Script Generator:** Generates clean Puppeteer scripts tailored to your username and custom file naming:
  - **Guided Mode (`Z` Key):** Uploads each skin on Minecraft.net, cycles F5 refreshes on NameMC, and advances immediately upon pressing `Z`. Supports resuming from any tile (`c(9)`, `b(3)`, `a(5)`).
  - **Automatic Mode:** Uploads all 27 skins sequentially from `c(9).png` down to `a(1).png` with rate-limit cooldowns.
  - **Universal HD Profile Capture:** Connects to Brave, Google Chrome, or Microsoft Edge via remote debugging, locks zoom to `100%`, and captures a pristine `1516x2460` (`4x` scale) screenshot of your profile.
  - **Combined Workflow:** Option to merge upload and capture into a single file.

---

## Workflow

### 1. Generate the 27 Skins

1. Open [SkinsArts Studio](https://skinsarts-studio.vercel.app).
2. Load or paste (`Ctrl + V`) an image and adjust the crop or algorithm (`Nearest Neighbor`, `Bilinear`, or `Lanczos`).
3. Select your base skin template (`Steve`, `Alex`, `NameMC`, or search your Minecraft Java username).
4. Optionally enable **Clean skin on a(1)** to preserve your in-game skin upon completion.
5. Click **Generate & Download ZIP (27 Skins)** to download `SkinsArt_generated.zip`.
6. Extract the `.zip` into a local directory outside cloud-synced folders (avoid OneDrive, Google Drive, or Dropbox).

### 2. Upload Order (Manual or Automated)

NameMC orders skin history from newest to oldest. To assemble the `9x3` grid properly, skins must be uploaded in reverse order:

1. **Row C (Bottom):** `c(9).png` down to `c(1).png`
2. **Row B (Middle):** `b(9).png` down to `b(1).png`
3. **Row A (Top):** `a(9).png` down to `a(1).png`

To automate this upload or take an HD profile capture, open the **Scripts AutoNameMC** section inside the app and follow the 4-step setup guide for Node.js and Chromium remote debugging (`--remote-debugging-port=9222`).

---

## Technical Stack

- HTML5 Canvas, CSS3, Vanilla JavaScript
- [Cropper.js](https://fengyuanchen.github.io/cropperjs/)
- [skinview3d](https://github.com/bs-community/skinview3d)
- [JSZip](https://stuk.github.io/jszip/)
- [Puppeteer](https://pptr.dev/) (for Node.js automation scripts)

---

## Credits

Created by [ArmandoLZ (Sonrojado)](https://namemc.com/profile/Sonrojado).  
Skin flip coordinates adapted from [babutxa](https://github.com/babutxa).
