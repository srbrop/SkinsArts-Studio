# 🎨 SkinsArts Studio
*A powerful web suite to generate, edit, and preview 27-part Minecraft skin arts for NameMC.*

## 🚀 [>>> CLICK HERE TO USE SKINSARTS STUDIO LIVE <<<](https://srbrop.github.io/SkinsArts-Studio)

---

## 📖 The Story Behind This
I got tired of opening image editors to manually crop and resize images pixel by pixel. The absolute most tedious part was trying to fit images of random sizes and qualities into a perfect 72x24 grid without ruining them. I decided to automate the whole process by building a comfortable, all-in-one tool. Now, I'm sharing this suite with anyone who wants to give a unique, artistic impact to their NameMC profile without the hassle.

*(Me aburrí de abrir editores de imágenes para hacer recortes y redimensionar píxel por píxel. La parte más tediosa era intentar ajustar imágenes de cualquier tamaño o calidad en una cuadrícula perfecta de 72x24 sin arruinarlas. Decidí automatizar el proceso creando herramientas cómodas. Ahora comparto esto con cualquier persona que quiera darle un impacto artístico a su perfil de NameMC).*

## ✨ Features

- **🖼️ Universal Image Support:** It doesn't matter the size, resolution, or quality of your image. Upload anything, and the tool will automatically downscale it to the exact pixels needed. **(See Visual Guide #1)**
- **👾 Live 3D Render & Fast Skin Selection:** Fast template selection (Built-in, NameMC search, or local file) with a fully interactive 3D model. **(See Visual Guide #2)**
- **✂️ Smart Cropper:** Visual UI to easily downscale and frame your desired artwork.
- **🖌️ Full Pixel Studio:** A built-in 64x64 pixel art canvas to paint and edit your base skin in real-time.
- **🛡️ Hash-Breaker Algorithm:** Automatically injects imperceptible pixel variants into identical output files, preventing NameMC from discarding them as "recycled" skins.
- **📦 1-Click ZIP Export:** Downloads all 27 numbered parts instantly, ready to upload.

## 🚀 Visual Guide (How it Works)

We know you want to see the magic. Here is how simple it is:

### 1. The Power of Copy-Paste (Universal Image Support)
![Visual Guide 1](https://github.com/user-attachments/assets/d9bbcfe5-c4f7-47b1-9f0c-cf29daf1d01e)
*GIF: Searching for an image on Google, copying it, pasting it directly into SkinsArts, and using the Turqouise-outlined cropper UI for framing.*

Finding your perfect artwork is effortless. **You don't need to download anything!** Just find an image you love, right-click to copy it, and paste (`Ctrl + V`) directly into SkinsArts Studio. The downscaling is done automatically!

### 2. Fast Base Skin Selection (Built-in or NameMC Search)
![Visual Guide 2](https://github.com/user-attachments/assets/476298bb-4925-4091-b296-5bf13daf26ed)
*GIF: Quickly changing base skins using the fast search tool and local file upload.*

Quickly find your base skin to use for the mural. Search by Minecraft username (connected directly to NameMC), upload your own local `.png`, or choose from our built-in templates (Steve, Alex, NameMC Blue).

---

## 📦 Step-by-Step Instructions

Here is the full workflow to transform your profile from start to finish:

### Step 1: Find an Image
*GIF Guide #1*
You can find an image of your choice using any of these methods:
*   **Google Images:** Right-click an image and select **"Copy image"**. Then, paste it into SkinsArts using `Ctrl + V`.
*   **Drag & Drop:** Drag an image file from your folder and drop it into the gray area.
*   **Local Upload:** Use the file input button to upload a `.png`.

### Step 2: Choose a Base Skin Template
*GIF Guide #2*
Choose the base skin that will hold the mural. Options include:
*   **NameMC Search:** Enter your Minecraft Java username to load your current skin directly from NameMC.
*   **Local File:** Upload your own custom 64x64 `.png` base.
*   **Built-in:** Use one of our pre-set templates.

### Step 3: Download the ZIP
Once framed and finalized, click the green **"Generate & Download ZIP"** button. This will create a file called **`SkinsArt_generated.zip`** in your root directory.

### Step 4: Extract and Upload in Reverse Order
This is the critical step to avoid having your mural marked as "recycled" or "spam."

1.  **Preparation:** Extract the `SkinsArt_generated.zip` file to a folder. We recommend opening the **Minecraft Launcher** in one window and your **NameMC profile** in another.
2.  **The Upload Sequence:** You MUST upload the files in reverse order (bottom to top). NameMC caches skins, so the new skin forces the old ones down. To get the perfect descending look, start from the bottom-left C-row:
    *   **Row C (Bottom):** Upload `c9.png` first, wait a few seconds, then `c8.png`, `c7.png`, all the way to `c1.png`.
    *   **Row B (Middle):** Upload `b9.png` first, wait, then `b8.png` ... to `b1.png`.
    *   **Row A (Top):** Upload `a9.png` first, wait, then `a8.png` ... to `a2.png`.
    *   **A1 is Optional:** The very last skin (`a1.png`) is optional, as NameMC can still display the last active skin you use.

**IMPORTANT:** Always press F5 (refresh) on your NameMC profile between uploads to ensure the skins are registering and the descending cached list is updating correctly.

---

### 🛠️ Built With
- HTML5, CSS3, Vanilla JavaScript
- [Cropper.js](https://fengyuanchen.github.io/cropperjs/)
- [skinview3d](https://github.com/bs-community/skinview3d)
- [JSZip](https://stuk.github.io/jszip/)

---

### ❤️ Support the Project
This tool was made with love for the Minecraft community. If you found it helpful and want to support my work, the best way to do it is by dropping a follow on my NameMC profile!

👉 **[Follow ArmandoLZ (Sonrojado) on NameMC](https://namemc.com/profile/Sonrojado)**
