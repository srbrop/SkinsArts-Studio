const dict = {
    en: {
        btn_studio: "STUDIO EDITOR", title: "Minecraft NameMC Skin Generator", dropzone_text: "Drag your image here, click or<br>press CTRL + V to paste",
        personalize_img: "Customize image", adjust_crop: "Adjust image crop:", quality: "Quality (Algorithm):",
        q_nearest: "Nearest Neighbor (Pure pixels)", q_bilinear: "Bilinear (Smooth)", q_high: "High Quality (Fant / Lanczos)",
        free_mode: "Enable Free Mode", free_mode_lock: "Lock Ratio (72x24)", result_label: "Result 72x24 (Pure Pixels)",
        choose_base: "Choose your preferred base skin:", custom: "Custom", search_java: "Search Java player:",
        search_btn: "Search Skin", upload_base: "Or upload a custom base (64x64):", hover_faces: "(Hover over faces)",
        play: "Play", pause: "Pause", explode: "Explode", apply_base: "💾 APPLY THIS BASE", gen_27: "Generate & Download ZIP", flip: "Flip Skin",
        slim_arms: "Slim Arms (Alex)", clear_all: "Clear All", footer_made: "Created by", sig_title: "Skin Signature (Watermark)", sig_desc: "Stamp your 8x8 face at the (0,0) texture corner.",
        sig_btn: "Load Face", sig_check: "Apply signature to files", skin_sel: "Selected Skin",
        adv_title: "Advanced Mural Settings", adv_layer: "Target Layer:", adv_base: "Base Layer (1)",
        adv_mask: "Mask Layer (2 - Ropes)", adv_rope_desc: "This mode clears original 40,8 sombrero and adds strings.", rope_color: "String Color:", rope_gap: "Back Gap:",
        readme: "==================================================\n   NAMEMC SKIN ART INSTRUCTIONS\n==================================================\n* IMPORTANT: It is NOT recommended to change your skin via the Minecraft website. Please use the official Minecraft Launcher for best results, then press F5 to refresh if viewing on a mobile phone or browser.\n* NOTE ON RECYCLED SKINS: This tool automatically injects an imperceptible pixel variant into duplicate files, forcing NameMC to recognize each one as completely unique!\n\nUPLOAD FILES IN REVERSE ORDER:\n1. Upload 'c(9).png' first.\n2. Wait for NameMC to cache it.\n3. Upload backwards until 'a(1).png'.\n\nCreated by ArmandoLZ (Sonrojado) with SkinsArts."
    },
    es: {
        btn_studio: "EDITOR STUDIO", title: "Generador de skins Minecraft NameMC", dropzone_text: "arrastre su imagen aquí, haga clic o<br>presione CTRL + V para pegar",
        personalize_img: "Personalizar imagen", adjust_crop: "Ajustar encuadre de imagen:", quality: "Calidad (Algoritmo):",
        q_nearest: "Vecino más próximo (Pixeles puros)", q_bilinear: "Bilineal (Interpolación suave)", q_high: "Alta Calidad (Fant / Lanczos)",
        free_mode: "Activar Modo Libre", free_mode_lock: "Fijar Proporción (72x24)", result_label: "Resultado 72x24 (Pixeles Puros)",
        choose_base: "elija la base de la skin que mas prefiera:", custom: "Personalizada", search_java: "Buscar jugador de Java:",
        search_btn: "Buscar Skin", upload_base: "O sube una base propia (64x64):", hover_faces: "(Pasa el mouse)",
        play: "Play", pause: "Pausar", explode: "Separar", apply_base: "💾 APLICAR ESTA BASE", gen_27: "Generar y Descargar ZIP", flip: "Voltear Skin",
        slim_arms: "Brazos Delgados (Alex)", clear_all: "Limpiar Todo", footer_made: "Esta página fue hecha por", sig_title: "Firma de Skin (Marca de agua)", sig_desc: "Estampa tu cara 8x8 en la esquina (0,0) del archivo.",
        sig_btn: "Cargar Cara", sig_check: "Aplicar firma en los archivos", skin_sel: "Skin Seleccionada",
        adv_title: "Ajustes Avanzados de Mural", adv_layer: "Capa de Destino:", adv_base: "Capa Base (1)",
        adv_mask: "Capa de Máscara (2 - Cuerdas)", adv_rope_desc: "Limpia el sombrero original 40,8 y añade cuerdas.", rope_color: "Color de Cuerdas:", rope_gap: "Apertura Trasera:",
        readme: "==================================================\n   INSTRUCCIONES PARA NAMEMC (SKIN ART)\n==================================================\n* IMPORTANTE: NO se recomienda cambiar la skin desde la página web de Minecraft. De preferencia hazlo desde el Launcher Oficial y presiona F5 para actualizar si lo estás viendo en un celular o navegador.\n* NOTA SOBRE SKINS RECICLADAS: ¡Esta herramienta inyecta automáticamente una variación de píxel imperceptible en archivos duplicados, obligando a NameMC a reconocer cada una como única!\n\nPASOS PARA SUBIR (ORDEN INVERSO):\n1. Sube primero el archivo 'c(9).png'.\n2. Espera a que NameMC lo registre.\n3. Sube en reversa hasta la 'a(1).png'.\n\nCreado por ArmandoLZ (Sonrojado) con SkinsArts."
    }
};

let currentLang = 'en';

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[currentLang][key]) {
            if (el.tagName === 'OPTION' || el.tagName === 'SPAN') {
                el.innerText = dict[currentLang][key];
            } else {
                el.innerHTML = dict[currentLang][key];
            }
        }
    });
}

document.getElementById('btn-lang').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    applyLanguage();
    const mosBtn = document.getElementById('btn-pause-mosaic');
    if (mosBtn && mosaicSkinViewer) {
        mosBtn.innerHTML = mosaicSkinViewer.autoRotate ? `⏸️ <span data-i18n="pause">${dict[currentLang]['pause']}</span>` : `▶️ <span data-i18n="play">${dict[currentLang]['play']}</span>`;
    }
    const stuBtn = document.getElementById('btn-pause-studio');
    if (stuBtn && studioSkinViewer) {
        stuBtn.innerHTML = studioSkinViewer.autoRotate ? `⏸️ <span data-i18n="pause">${dict[currentLang]['pause']}</span>` : `▶️ <span data-i18n="play">${dict[currentLang]['play']}</span>`;
    }
});

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('main-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const botonGenerar = document.getElementById('generate-btn');
const customPanel = document.getElementById('custom-panel');
const editorPanel = document.getElementById('editor-panel');
const btnToggleEditor = document.getElementById('btn-toggle-editor');
const imageToCrop = document.getElementById('image-to-crop'); 
const selectCalidad = document.getElementById('select-calidad');
const btnFreeMode = document.getElementById('btn-free-mode');
const checkFirma = document.getElementById('check-firma');
const sigPreview = document.getElementById('signature-preview');
const sigCtx = sigPreview ? sigPreview.getContext('2d') : null;
const layerBaseRadio = document.querySelector('input[name="mural_layer"][value="inner"]');
const layerMaskRadio = document.querySelector('input[name="mural_layer"][value="outer"]');
const ropesControls = document.getElementById('adv-ropes-controls');
const ropeColorPicker = document.getElementById('rope-color-picker');
const ropeGapSlider = document.getElementById('rope-gap-slider');
const ropeYSlider = document.getElementById('rope-y-slider');
const mosaicWrapper = document.getElementById('mosaic-wrapper');
const mosaicContainer = document.getElementById('namemc-mosaic');
const preview3dLabel = document.getElementById('preview-3d-label');
const studioModal = document.getElementById('editor-studio-modal');
const btnOpenStudio = document.getElementById('btn-open-studio');
const editorSkinCanvas = document.getElementById('editor-skin-canvas');
const eCtx = editorSkinCanvas ? editorSkinCanvas.getContext('2d') : null;
const basePreviewCanvas = document.getElementById('base-preview-canvas');
const previewCtx = basePreviewCanvas ? basePreviewCanvas.getContext('2d') : null;
const checkSlimArms = document.getElementById('check-slim-arms');

const panXSlider = document.getElementById('pan-x-slider');
const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnUndo = document.getElementById('btn-undo');
const btnRedo = document.getElementById('btn-redo');

if (canvas) { canvas.width = 72; canvas.height = 24; }
if (previewCtx) previewCtx.imageSmoothingEnabled = false;
if (eCtx) eCtx.imageSmoothingEnabled = false;
if (sigCtx) sigCtx.imageSmoothingEnabled = false;

let baseSkinImg = new Image();
baseSkinImg.crossOrigin = "Anonymous"; 
let signatureImg = new Image();
signatureImg.crossOrigin = "Anonymous"; 
let cropper = null;
let cropTimeout;
let isFreeMode = false;
let isPainting = false;
let selectedColor = "#11caa0";
let studioSkinViewer = null;
let mosaicSkinViewer = null;
let isExploded = false;
let generatedSkinsData = [];

let undoStack = [];
let redoStack = [];

function updateHistoryButtons() {
    if (btnUndo) btnUndo.innerText = `⬅️ Undo (${Math.max(0, undoStack.length - 1)})`;
    if (btnRedo) btnRedo.innerText = `Redo ➡️ (${redoStack.length})`;
}

function saveCanvasState() {
    if (!editorSkinCanvas) return;
    undoStack.push(editorSkinCanvas.toDataURL());
    if (undoStack.length > 5) undoStack.shift(); 
    redoStack = []; 
    updateHistoryButtons();
}

function restoreCanvasState(dataUrl) {
    let img = new Image();
    img.onload = () => {
        eCtx.clearRect(0, 0, 64, 64);
        eCtx.drawImage(img, 0, 0);
        sync3D();
    };
    img.src = dataUrl;
    updateHistoryButtons();
}

if (btnUndo) {
    btnUndo.addEventListener('click', () => {
        if (undoStack.length > 1) { 
            redoStack.push(undoStack.pop());
            restoreCanvasState(undoStack[undoStack.length - 1]);
        }
    });
}

if (btnRedo) {
    btnRedo.addEventListener('click', () => {
        if (redoStack.length > 0) {
            let state = redoStack.pop();
            undoStack.push(state);
            restoreCanvasState(state);
        }
    });
}

function initStudio3D() {
    if (!studioSkinViewer && document.getElementById("skin-3d-viewer")) {
        studioSkinViewer = new skinview3d.SkinViewer({
            canvas: document.getElementById("skin-3d-viewer"),
            width: 320,
            height: 400
        });
        if (skinview3d.createOrbitControls) {
            let controls = skinview3d.createOrbitControls(studioSkinViewer);
            controls.enableRotate = true;
            controls.enableZoom = true;
            controls.enablePan = false;
        }
        studioSkinViewer.autoRotate = false; 
    }
}

function initMosaic3D() {
    if (!mosaicSkinViewer && document.getElementById("mosaic-3d-viewer")) {
        mosaicSkinViewer = new skinview3d.SkinViewer({
            canvas: document.getElementById("mosaic-3d-viewer"),
            width: 160,
            height: 260
        });
        if (skinview3d.createOrbitControls) {
            let controls = skinview3d.createOrbitControls(mosaicSkinViewer);
            controls.enableRotate = true;
            controls.enableZoom = false;
            controls.enablePan = false;
        }
        mosaicSkinViewer.autoRotate = false; 
    }
}

if (document.getElementById('btn-pause-mosaic')) {
    document.getElementById('btn-pause-mosaic').addEventListener('click', (e) => {
        if (!mosaicSkinViewer) return;
        mosaicSkinViewer.autoRotate = !mosaicSkinViewer.autoRotate;
        e.target.innerHTML = mosaicSkinViewer.autoRotate ? `⏸️ <span data-i18n="pause">${dict[currentLang]['pause']}</span>` : `▶️ <span data-i18n="play">${dict[currentLang]['play']}</span>`;
    });
}

if (document.getElementById('btn-pause-studio')) {
    document.getElementById('btn-pause-studio').addEventListener('click', (e) => {
        if (!studioSkinViewer) return;
        studioSkinViewer.autoRotate = !studioSkinViewer.autoRotate;
        e.target.innerHTML = studioSkinViewer.autoRotate ? `⏸️ <span data-i18n="pause">${dict[currentLang]['pause']}</span>` : `▶️ <span data-i18n="play">${dict[currentLang]['play']}</span>`;
    });
}

if (document.getElementById('btn-explode-view')) {
    document.getElementById('btn-explode-view').addEventListener('click', (e) => {
        if (!studioSkinViewer || !studioSkinViewer.playerObject) return;
        isExploded = !isExploded;
        const skin = studioSkinViewer.playerObject.skin;
        const offset = isExploded ? 6 : -6;
        skin.head.position.y += offset;
        skin.rightArm.position.x -= offset;
        skin.leftArm.position.x += offset;
        skin.rightLeg.position.x -= offset / 2;
        skin.rightLeg.position.y -= offset;
        skin.leftLeg.position.x += offset / 2;
        skin.leftLeg.position.y -= offset;
        e.target.innerText = isExploded ? "🔳 Join (T)" : `🔲 ${dict[currentLang]['explode']}`;
        e.target.classList.toggle('active', isExploded);
    });
}

window.toggleLayer = function(layerName) {
    if (!studioSkinViewer || !studioSkinViewer.playerObject) return;
    const skin = studioSkinViewer.playerObject.skin;
    const parts = [skin.head, skin.body, skin.rightArm, skin.leftArm, skin.rightLeg, skin.leftLeg];
    const btn = event.target;
    const isActive = btn.classList.contains('active');
    parts.forEach(part => {
        if (layerName === 'inner' && part.innerLayer) part.innerLayer.visible = !isActive;
        if (layerName === 'outer' && part.outerLayer) part.outerLayer.visible = !isActive;
    });
    btn.classList.toggle('active', !isActive);
}

document.querySelectorAll('.part-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (!studioSkinViewer || !studioSkinViewer.playerObject) return;
        const part = studioSkinViewer.playerObject.skin[e.target.getAttribute('data-part')];
        if (part) {
            part.visible = !part.visible;
            e.target.classList.toggle('active', part.visible);
        }
    });
});

function sync3D() {
    if (studioSkinViewer && editorSkinCanvas) {
        const modelType = (checkSlimArms && checkSlimArms.checked) ? "slim" : "default";
        studioSkinViewer.loadSkin(editorSkinCanvas.toDataURL(), { model: modelType });
    }
}

function mirrorImage(context, imageCanvas, x, y, horizontal, vertical) {
    context.save();
    context.setTransform(horizontal ? -1 : 1, 0, 0, vertical ? -1 : 1, x + (horizontal ? imageCanvas.width : 0), y + (vertical ? imageCanvas.height : 0));
    context.drawImage(imageCanvas, 0, 0);
    context.restore();
}

function processBlock(srcCanvas, srow, scol, w, h, drow, dcol, dCanvas, fliph = false, flipv = false) {
    const cCanvas = document.createElement('canvas');
    cCanvas.width = w; cCanvas.height = h;
    const cCtx = cCanvas.getContext("2d");
    cCtx.drawImage(srcCanvas, scol, srow, w, h, 0, 0, w, h);
    const aCanvas = document.createElement('canvas');
    aCanvas.width = w; aCanvas.height = h;
    const aCtx = aCanvas.getContext("2d");
    mirrorImage(aCtx, cCanvas, 0, 0, fliph, flipv);
    dCanvas.getContext("2d").drawImage(aCanvas, 0, 0, w, h, dcol, drow, w, h);
}

if (document.getElementById('btn-flip-skin')) {
    document.getElementById('btn-flip-skin').addEventListener('click', () => {
        if (!baseSkinImg.src) return;
        const tmp = document.createElement('canvas');
        tmp.width = 64; tmp.height = 64;
        const tCtx = tmp.getContext('2d');
        tCtx.drawImage(baseSkinImg, 0, 0);
        
        const res = document.createElement('canvas');
        res.width = 64; res.height = 64;
        const headSize = 8;
        const bodyHeight = 12;
        const defaultLimbWidth = 4;
        const armWidth = (checkSlimArms && checkSlimArms.checked) ? 3 : defaultLimbWidth;

        processBlock(tmp, 0, 8, headSize, headSize, 0, 8, res, true, true);
        processBlock(tmp, 0, 16, headSize, headSize, 0, 16, res, true, true);
        processBlock(tmp, 8, 0, headSize, headSize, 8, 16, res);
        processBlock(tmp, 8, 8, headSize, headSize, 8, 24, res);
        processBlock(tmp, 8, 16, headSize, headSize, 8, 0, res);
        processBlock(tmp, 8, 24, headSize, headSize, 8, 8, res);

        processBlock(tmp, 0, 40, headSize, headSize, 0, 40, res, true, true);
        processBlock(tmp, 0, 48, headSize, headSize, 0, 48, res, true, true);
        processBlock(tmp, 8, 32, headSize, headSize, 8, 48, res);
        processBlock(tmp, 8, 40, headSize, headSize, 8, 56, res);
        processBlock(tmp, 8, 48, headSize, headSize, 8, 32, res);
        processBlock(tmp, 8, 56, headSize, headSize, 8, 40, res);

        processBlock(tmp, 48, 20, defaultLimbWidth, defaultLimbWidth, 16, 4, res, true, true);
        processBlock(tmp, 48, 24, defaultLimbWidth, defaultLimbWidth, 16, 8, res, true, true);
        processBlock(tmp, 52, 28, defaultLimbWidth, bodyHeight, 20, 4, res);
        processBlock(tmp, 52, 20, defaultLimbWidth, bodyHeight, 20, 12, res);
        processBlock(tmp, 52, 24, defaultLimbWidth, bodyHeight, 20, 0, res);
        processBlock(tmp, 52, 16, defaultLimbWidth, bodyHeight, 20, 8, res);

        processBlock(tmp, 16, 4, defaultLimbWidth, defaultLimbWidth, 48, 20, res, true, true);
        processBlock(tmp, 16, 8, defaultLimbWidth, defaultLimbWidth, 48, 24, res, true, true);
        processBlock(tmp, 20, 4, defaultLimbWidth, bodyHeight, 52, 28, res);
        processBlock(tmp, 20, 12, defaultLimbWidth, bodyHeight, 52, 20, res);
        processBlock(tmp, 20, 0, defaultLimbWidth, bodyHeight, 52, 24, res);
        processBlock(tmp, 20, 8, defaultLimbWidth, bodyHeight, 52, 16, res);

        processBlock(tmp, 48, 4, defaultLimbWidth, defaultLimbWidth, 32, 4, res, true, true);
        processBlock(tmp, 48, 8, defaultLimbWidth, defaultLimbWidth, 32, 8, res, true, true);
        processBlock(tmp, 52, 12, defaultLimbWidth, bodyHeight, 36, 4, res);
        processBlock(tmp, 52, 4, defaultLimbWidth, bodyHeight, 36, 12, res);
        processBlock(tmp, 52, 8, defaultLimbWidth, bodyHeight, 36, 0, res);
        processBlock(tmp, 52, 0, defaultLimbWidth, bodyHeight, 36, 8, res);

        processBlock(tmp, 32, 4, defaultLimbWidth, defaultLimbWidth, 48, 4, res, true, true);
        processBlock(tmp, 32, 8, defaultLimbWidth, defaultLimbWidth, 48, 8, res, true, true);
        processBlock(tmp, 36, 4, defaultLimbWidth, bodyHeight, 52, 12, res);
        processBlock(tmp, 36, 12, defaultLimbWidth, bodyHeight, 52, 4, res);
        processBlock(tmp, 36, 0, defaultLimbWidth, bodyHeight, 52, 8,  res);
        processBlock(tmp, 36, 8, defaultLimbWidth, bodyHeight, 52, 0, res);

        processBlock(tmp, 16, 20, headSize, defaultLimbWidth, 16, 20, res, true, true);
        processBlock(tmp, 16, 28, headSize, defaultLimbWidth, 16, 28, res, true, true);
        processBlock(tmp, 20, 28, defaultLimbWidth, bodyHeight, 20, 16, res);
        processBlock(tmp, 20, 32, headSize, bodyHeight, 20, 20, res);
        processBlock(tmp, 20, 20, headSize, bodyHeight, 20, 32, res);
        processBlock(tmp, 20, 16, defaultLimbWidth, bodyHeight, 20, 28, res);

        processBlock(tmp, 32, 20, headSize, defaultLimbWidth, 32, 20, res, true, true);
        processBlock(tmp, 32, 28, headSize, defaultLimbWidth, 32, 28, res, true, true);
        processBlock(tmp, 36, 28, defaultLimbWidth, bodyHeight, 36, 16, res);
        processBlock(tmp, 36, 32, headSize, bodyHeight, 36, 20, res);
        processBlock(tmp, 36, 20, headSize, bodyHeight, 36, 32, res);
        processBlock(tmp, 36, 16, defaultLimbWidth, bodyHeight, 36, 28, res);

        processBlock(tmp, 48, 36, armWidth, defaultLimbWidth, 16, 44, res, true, true);
        processBlock(tmp, 48, 36 + armWidth, armWidth, defaultLimbWidth, 16, 44 + armWidth, res, true, true);
        processBlock(tmp, 52, 36 + armWidth, defaultLimbWidth, bodyHeight, 20, 40, res);
        processBlock(tmp, 52, 40 + armWidth, armWidth, bodyHeight, 20, 44, res);
        processBlock(tmp, 52, 32, defaultLimbWidth, bodyHeight, 20, 44 + armWidth, res);
        processBlock(tmp, 52, 36, armWidth, bodyHeight, 20, 48 + armWidth, res);

        processBlock(tmp, 16, 44, armWidth, defaultLimbWidth, 48, 36, res, true, true);
        processBlock(tmp, 16, 44 + armWidth, armWidth, defaultLimbWidth, 48, 36 + armWidth, res, true, true);
        processBlock(tmp, 20, 40, defaultLimbWidth, bodyHeight, 52, 36 + armWidth, res);
        processBlock(tmp, 20, 44, armWidth, bodyHeight, 52, 40 + armWidth, res);
        processBlock(tmp, 20, 44 + armWidth, defaultLimbWidth, bodyHeight, 52, 32, res);
        processBlock(tmp, 20, 48 + armWidth, armWidth, bodyHeight, 52, 36, res);

        processBlock(tmp, 48, 52, armWidth, defaultLimbWidth, 32, 44, res, true, true);
        processBlock(tmp, 48, 52 + armWidth, armWidth, defaultLimbWidth, 32, 44 + armWidth, res, true, true);
        processBlock(tmp, 52, 52 + armWidth, defaultLimbWidth, bodyHeight, 36, 40, res);
        processBlock(tmp, 52, 56 + armWidth, armWidth, bodyHeight, 36, 44, res);
        processBlock(tmp, 52, 48, defaultLimbWidth, bodyHeight, 36, 44 + armWidth, res);
        processBlock(tmp, 52, 52, armWidth, bodyHeight, 36, 48 + armWidth, res);

        processBlock(tmp, 32, 44, armWidth, defaultLimbWidth, 48, 52, res, true, true);
        processBlock(tmp, 32, 44 + armWidth, armWidth, defaultLimbWidth, 48, 52 + armWidth, res, true, true);
        processBlock(tmp, 36, 40, defaultLimbWidth, bodyHeight, 52, 52 + armWidth, res);
        processBlock(tmp, 36, 44, armWidth, bodyHeight, 52, 56 + armWidth, res);
        processBlock(tmp, 36, 44 + armWidth, defaultLimbWidth, bodyHeight, 52, 48, res);
        processBlock(tmp, 36, 48 + armWidth, armWidth, bodyHeight, 52, 52, res);

        baseSkinImg.src = res.toDataURL();
        if (eCtx) {
            eCtx.clearRect(0, 0, 64, 64);
            eCtx.drawImage(res, 0, 0);
        }
        renderMosaicEnVivo();
        sync3D();
        saveCanvasState();
    });
}

function renderMosaicEnVivo() {
    if (!cropper || !baseSkinImg.src || baseSkinImg.src.endsWith("index.html")) return;
    initMosaic3D();
    if (mosaicWrapper) mosaicWrapper.style.display = 'flex';
    if (mosaicContainer) mosaicContainer.innerHTML = ''; 
    
    const filas = 3;
    const columnas = 9;
    const tamano = 8;
    const prefijos = ['A', 'B', 'C'];
    const caraX = 8;
    const caraY = 8;
    
    let primeraSkinBase64 = null; 
    generatedSkinsData = []; 
    let hashesInBatch = new Set();
    
    const targetBaseLayer = layerBaseRadio ? layerBaseRadio.checked : true;
    const targetMaskLayer = layerMaskRadio ? layerMaskRadio.checked : false;
    const aplicarFirma = (checkFirma && checkFirma.checked && signatureImg.src);
    let gap = ropeGapSlider ? parseInt(ropeGapSlider.value) : 0;
    let yOffset = ropeYSlider ? parseInt(ropeYSlider.value) : 0;
    const modelType = (checkSlimArms && checkSlimArms.checked) ? "slim" : "default";

    for (let y = 0; y < filas; y++) {
        for (let x = 0; x < columnas; x++) {
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = 64;
            finalCanvas.height = 64;
            const finalCtx = finalCanvas.getContext('2d');
            finalCtx.imageSmoothingEnabled = false;

            finalCtx.drawImage(baseSkinImg, 0, 0, 64, 64);
            if(targetBaseLayer) finalCtx.clearRect(40, 8, 8, 8); 

            if (aplicarFirma) {
                finalCtx.drawImage(signatureImg, 8, 8, 8, 8, 0, 0, 8, 8);
                finalCtx.drawImage(signatureImg, 40, 8, 8, 8, 0, 0, 8, 8);
            }

            if(targetMaskLayer) {
                finalCtx.clearRect(40, 8, 8, 8); 
                finalCtx.drawImage(canvas, x * tamano, y * tamano, tamano, tamano, 40, 8, tamano, tamano);
                finalCtx.fillStyle = ropeColorPicker ? ropeColorPicker.value : "#444444";
                
                let baseRopeY = 11 + yOffset;
                finalCtx.fillRect(32, baseRopeY, 8, 1);
                
                if(gap === 0) {
                    finalCtx.fillRect(48, baseRopeY, 16, 1);
                } else {
                    let backLeftWidth = 4 - (gap / 2);
                    finalCtx.fillRect(48, baseRopeY, 8 + backLeftWidth, 1);
                    let backRightStart = 60 + (gap / 2);
                    let backRightWidth = 64 - backRightStart;
                    if (backRightWidth > 0) finalCtx.fillRect(backRightStart, baseRopeY, backRightWidth, 1);
                }
            } else {
                finalCtx.drawImage(canvas, x * tamano, y * tamano, tamano, tamano, caraX, caraY, tamano, tamano);
            }

            let base64DataRaw = finalCanvas.toDataURL("image/png").split(',')[1];
            let tweakX = 0;
            while (hashesInBatch.has(base64DataRaw) && tweakX < 27) {
                let imgData = finalCtx.getImageData(tweakX, 0, 1, 1);
                imgData.data[0] = imgData.data[0] === 255 ? 254 : imgData.data[0] + 1;
                finalCtx.putImageData(imgData, tweakX, 0);
                base64DataRaw = finalCanvas.toDataURL("image/png").split(',')[1];
                tweakX++;
            }
            hashesInBatch.add(base64DataRaw);
            
            const dataUriCompleta = `data:image/png;base64,${base64DataRaw}`; 
            generatedSkinsData.push({ name: `${prefijos[y].toLowerCase()}(${x + 1}).png`, data: base64DataRaw });
            if (!primeraSkinBase64) primeraSkinBase64 = dataUriCompleta;

            const facePreviewCanvas = document.createElement('canvas');
            facePreviewCanvas.width = 8;
            facePreviewCanvas.height = 8;
            const faceCtx = facePreviewCanvas.getContext('2d');
            faceCtx.imageSmoothingEnabled = false;
            
            faceCtx.drawImage(finalCanvas, caraX, caraY, tamano, tamano, 0, 0, tamano, tamano);
            faceCtx.drawImage(finalCanvas, 40, 8, 8, 8, 0, 0, 8, 8);
            
            facePreviewCanvas.dataset.fullSkin = dataUriCompleta;
            facePreviewCanvas.addEventListener('mouseenter', (e) => {
                document.querySelectorAll('.namemc-mosaic canvas').forEach(c => c.style.outline = 'none');
                e.target.style.outline = '2px solid #ff5555';
                if (preview3dLabel) preview3dLabel.innerText = `${dict[currentLang]['skin_sel']}: (${prefijos[y]}${x + 1})`;
                if (mosaicSkinViewer) mosaicSkinViewer.loadSkin(e.target.dataset.fullSkin, { model: modelType });
            });

            if (mosaicContainer) mosaicContainer.appendChild(facePreviewCanvas);
        }
    }
    
    if (mosaicSkinViewer) mosaicSkinViewer.loadSkin(primeraSkinBase64, { model: modelType });
    
    const zip = new JSZip();
    generatedSkinsData.forEach(skin => { zip.file(skin.name, skin.data, {base64: true}); });
    const artBase64 = canvas.toDataURL("image/png").split(',')[1];
    zip.file("Art_Mural_72x24.png", artBase64, {base64: true});
    zip.file("README.txt", dict[currentLang]['readme']);
    
    zip.generateAsync({type:"blob"}).then(function(contenido) {
        if (botonGenerar) botonGenerar.dataset.readyZip = URL.createObjectURL(contenido);
    });
}

baseSkinImg.onload = () => {
    const tempC = document.createElement('canvas');
    tempC.width = 64; tempC.height = 64;
    const tCx = tempC.getContext('2d');
    tCx.drawImage(baseSkinImg, 0, 0);
    const p1 = tCx.getImageData(54, 20, 1, 1).data[3];
    const p2 = tCx.getImageData(55, 20, 1, 1).data[3];
    if (checkSlimArms) checkSlimArms.checked = (p1 === 0 && p2 === 0);

    if (basePreviewCanvas) basePreviewCanvas.style.display = 'block';
    if (previewCtx) {
        previewCtx.clearRect(0, 0, 64, 64);
        previewCtx.drawImage(baseSkinImg, 0, 0, 64, 64);
    }
    renderMosaicEnVivo(); 
    sync3D();
};

if (checkSlimArms) {
    checkSlimArms.addEventListener('change', () => {
        sync3D();
        renderMosaicEnVivo();
    });
}

if (checkFirma) checkFirma.addEventListener('change', renderMosaicEnVivo);
if (layerBaseRadio) layerBaseRadio.addEventListener('change', () => { if(ropesControls) ropesControls.style.display = 'none'; renderMosaicEnVivo(); });
if (layerMaskRadio) layerMaskRadio.addEventListener('change', () => { if(ropesControls) ropesControls.style.display = 'block'; renderMosaicEnVivo(); });
if (ropeColorPicker) ropeColorPicker.addEventListener('change', renderMosaicEnVivo);
if (ropeGapSlider) ropeGapSlider.addEventListener('input', renderMosaicEnVivo);
if (ropeYSlider) ropeYSlider.addEventListener('input', renderMosaicEnVivo);

signatureImg.onload = () => {
    if (sigPreview) sigPreview.style.display = 'block';
    if (sigCtx) {
        sigCtx.clearRect(0, 0, 8, 8);
        sigCtx.drawImage(signatureImg, 8, 8, 8, 8, 0, 0, 8, 8);
        sigCtx.drawImage(signatureImg, 40, 8, 8, 8, 0, 0, 8, 8);
    }
    renderMosaicEnVivo();
};

if (btnZoomIn) btnZoomIn.addEventListener('click', () => { if (cropper) cropper.zoom(0.1); });
if (btnZoomOut) btnZoomOut.addEventListener('click', () => { if (cropper) cropper.zoom(-0.1); });

let lastPanX = 0;
if (panXSlider) {
    panXSlider.addEventListener('input', (e) => {
        let currentPan = parseInt(e.target.value);
        let diff = currentPan - lastPanX;
        if (cropper) cropper.move(diff * 2, 0); 
        lastPanX = currentPan;
    });
}

if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => { 
        if (e.target.files.length > 0) {
            iniciarProcesamiento(e.target.files[0]); 
            if(panXSlider) { panXSlider.value = 0; lastPanX = 0; }
        }
    });
    dropZone.addEventListener('dragover', (e) => { 
        e.preventDefault(); 
        dropZone.style.backgroundColor = '#5c728a'; 
    });
    dropZone.addEventListener('dragleave', () => { 
        dropZone.style.backgroundColor = '#7289A0'; 
    });
    dropZone.addEventListener('drop', (e) => { 
        e.preventDefault(); 
        dropZone.style.backgroundColor = '#7289A0'; 
        if (e.dataTransfer.files.length > 0) {
            iniciarProcesamiento(e.dataTransfer.files[0]); 
            if(panXSlider) { panXSlider.value = 0; lastPanX = 0; }
        }
    });
}

window.addEventListener('paste', (evento) => {
    if (!evento.clipboardData && !evento.originalEvent.clipboardData) return;
    const items = (evento.clipboardData || evento.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
            iniciarProcesamiento(items[i].getAsFile());
            if(panXSlider) { panXSlider.value = 0; lastPanX = 0; }
            break;
        }
    }
});

function iniciarProcesamiento(archivo) {
    if (archivo && archivo.type.startsWith('image/')) {
        const lector = new FileReader();
        lector.onload = (e) => {
            if (cropper) cropper.destroy(); 
            if (imageToCrop) imageToCrop.src = e.target.result;
            if (btnToggleEditor) btnToggleEditor.style.display = 'inline-block';
            if (editorPanel) editorPanel.style.display = 'block'; 
            isFreeMode = false;
            if (btnFreeMode) btnFreeMode.innerText = dict[currentLang]['free_mode'];
            if (!baseSkinImg.src || baseSkinImg.src.endsWith("index.html")) { 
                baseSkinImg.src = 'steve_base.png'; 
            }
            if (imageToCrop) {
                cropper = new Cropper(imageToCrop, {
                    aspectRatio: 72 / 24,
                    viewMode: 1,
                    dragMode: 'move',     
                    crop(event) { 
                        clearTimeout(cropTimeout);
                        cropTimeout = setTimeout(() => {
                            redibujarLienzoRostros(); 
                        }, 50);
                    },
                    cropend(event) {
                        clearTimeout(cropTimeout);
                        redibujarLienzoRostros();
                        renderMosaicEnVivo(); 
                    },
                    ready() {
                        clearTimeout(cropTimeout);
                        redibujarLienzoRostros();
                        renderMosaicEnVivo(); 
                    }
                });
            }
        };
        lector.readAsDataURL(archivo);
    } else { 
        alert("Invalid image."); 
    }
}

if (btnFreeMode) {
    btnFreeMode.addEventListener('click', () => {
        if (!cropper) return;
        isFreeMode = !isFreeMode;
        if (isFreeMode) { 
            cropper.setAspectRatio(NaN); 
            btnFreeMode.innerText = dict[currentLang]['free_mode_lock']; 
            btnFreeMode.style.borderColor = "#11caa0"; 
            btnFreeMode.style.color = "#11caa0"; 
        } else { 
            cropper.setAspectRatio(72 / 24); 
            btnFreeMode.innerText = dict[currentLang]['free_mode']; 
            btnFreeMode.style.borderColor = "#f39c12"; 
            btnFreeMode.style.color = "#f39c12"; 
        }
    });
}

if (btnToggleEditor) {
    btnToggleEditor.addEventListener('click', () => { 
        if(editorPanel) editorPanel.style.display = editorPanel.style.display === 'none' ? 'block' : 'none'; 
    });
}

function redibujarLienzoRostros() {
    if (!cropper || !canvas || !ctx) return;
    const lienzoRecortado = cropper.getCroppedCanvas({ 
        width: 72, height: 24, 
        imageSmoothingEnabled: selectCalidad ? selectCalidad.value !== 'nearest' : true, 
        imageSmoothingQuality: (selectCalidad && selectCalidad.value === 'high') ? 'high' : 'low' 
    });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (selectCalidad && selectCalidad.value === 'nearest') { 
        ctx.imageSmoothingEnabled = false; 
    } else { 
        ctx.imageSmoothingEnabled = true; 
        ctx.imageSmoothingQuality = (selectCalidad && selectCalidad.value === 'high') ? 'high' : 'high'; 
    }
    ctx.drawImage(lienzoRecortado, 0, 0, 72, 24);
}

if (selectCalidad) { selectCalidad.addEventListener('change', () => { redibujarLienzoRostros(); renderMosaicEnVivo(); }); }

if (document.getElementById('btn-load-signature')) {
    document.getElementById('btn-load-signature').addEventListener('click', () => {
        const nickInput = document.getElementById('signature-nick');
        if (nickInput && nickInput.value.trim() !== "") { signatureImg.src = `https://minotar.net/skin/${nickInput.value.trim()}`; }
    });
}

if (document.getElementById('btn-steve')) {
    document.getElementById('btn-steve').addEventListener('click', () => { 
        if (customPanel) customPanel.style.display = 'none'; 
        baseSkinImg.src = 'steve_base.png'; 
    });
}
if (document.getElementById('btn-alex')) {
    document.getElementById('btn-alex').addEventListener('click', () => { 
        if (customPanel) customPanel.style.display = 'none'; 
        baseSkinImg.src = 'alex_base.png'; 
    });
}
if (document.getElementById('btn-namemc')) {
    document.getElementById('btn-namemc').addEventListener('click', () => { 
        if (customPanel) customPanel.style.display = 'none'; 
        baseSkinImg.src = 'namemc_base.png'; 
    });
}
if (document.getElementById('btn-custom')) {
    document.getElementById('btn-custom').addEventListener('click', () => { 
        if (customPanel) customPanel.style.display = 'block'; 
    });
}

if (document.getElementById('fetch-api-btn')) {
    document.getElementById('fetch-api-btn').addEventListener('click', () => {
        const usernameInput = document.getElementById('username-input');
        if (usernameInput && usernameInput.value.trim() !== "") { 
            baseSkinImg.src = `https://minotar.net/skin/${usernameInput.value.trim()}`; 
        }
    });
}

if (document.getElementById('local-base-input')) {
    document.getElementById('local-base-input').addEventListener('change', (e) => {
        if (e.target.files[0]) {
            const lector = new FileReader();
            lector.onload = (event) => { baseSkinImg.src = event.target.result; };
            lector.readAsDataURL(e.target.files[0]);
        }
    });
}

if (btnOpenStudio) {
    btnOpenStudio.addEventListener('click', () => {
        if (studioModal) studioModal.classList.add('open'); 
        initStudio3D(); 
        if (eCtx) {
            eCtx.clearRect(0, 0, 64, 64);
            if(baseSkinImg.src && !baseSkinImg.src.endsWith("index.html")) { eCtx.drawImage(baseSkinImg, 0, 0, 64, 64); }
        }
        sync3D(); 
        setTimeout(() => { 
            undoStack = [editorSkinCanvas.toDataURL()];
            redoStack = [];
            updateHistoryButtons();
        }, 100);
    });
}

if (document.getElementById('btn-close-studio')) {
    document.getElementById('btn-close-studio').addEventListener('click', () => {
        if (studioModal) studioModal.classList.remove('open');
    });
}

if (document.getElementById('paint-color-picker')) {
    document.getElementById('paint-color-picker').addEventListener('input', (e) => { selectedColor = e.target.value; });
}

document.querySelectorAll('#studio-palette .palette-color').forEach(b => {
    b.addEventListener('click', (e) => {
        if(b.id === 'btn-tool-eraser') { 
            selectedColor = "rgba(0,0,0,0)"; 
        } else { 
            selectedColor = b.getAttribute('data-color'); 
            const picker = document.getElementById('paint-color-picker');
            if (picker) picker.value = selectedColor; 
        }
    });
});

document.querySelectorAll('#rope-palette .palette-color').forEach(b => {
    b.addEventListener('click', (e) => {
        const ropeColor = b.getAttribute('data-color'); 
        const picker = document.getElementById('rope-color-picker');
        if (picker) {
            picker.value = ropeColor; 
            renderMosaicEnVivo();
        }
    });
});

let syncTimeoutStudio = null;
if (editorSkinCanvas) {
    editorSkinCanvas.addEventListener('mousedown', (e) => { isPainting = true; pintarPixel(e); });
    editorSkinCanvas.addEventListener('mousemove', (e) => { if (isPainting) pintarPixel(e); });
}

window.addEventListener('mouseup', () => { 
    if (isPainting) { 
        isPainting = false; 
        sync3D(); 
        saveCanvasState(); 
    } 
});

function pintarPixel(e) {
    if (!editorSkinCanvas || !eCtx) return;
    const rect = editorSkinCanvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * 64); 
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * 64);
    
    if (selectedColor === "rgba(0,0,0,0)") { eCtx.clearRect(x, y, 1, 1); } 
    else { eCtx.fillStyle = selectedColor; eCtx.fillRect(x, y, 1, 1); }
    
    if (!syncTimeoutStudio) { 
        syncTimeoutStudio = setTimeout(() => { sync3D(); syncTimeoutStudio = null; }, 100); 
    }
}

if (document.getElementById('btn-save-skin-edit')) {
    document.getElementById('btn-save-skin-edit').addEventListener('click', () => {
        if (editorSkinCanvas) baseSkinImg.src = editorSkinCanvas.toDataURL(); 
        renderMosaicEnVivo(); 
        if (studioModal) studioModal.classList.remove('open');
    });
}

if (botonGenerar) {
    botonGenerar.addEventListener('click', () => {
        if (botonGenerar.dataset.readyZip) {
            const link = document.createElement("a");
            link.href = botonGenerar.dataset.readyZip;
            link.download = "SkinsArt_generated.zip";
            link.click();
        } else { alert("Crop an image first to generate."); }
    });
}

if (document.getElementById('reset-app-btn')) {
    document.getElementById('reset-app-btn').addEventListener('click', () => { 
        if(confirm("Clear workspace?")) { window.location.reload(); } 
    });
}

applyLanguage();
