const dict = {
    en: {
        btn_studio: "STUDIO EDITOR", title: "Minecraft NameMC Skin Generator", dropzone_text: "Drag your image here, click or<br>press CTRL + V to paste",
        personalize_img: "Customize image", adjust_crop: "Adjust image crop:", quality: "Quality (Algorithm):",
        q_nearest: "Nearest Neighbor (Pure pixels)", q_bilinear: "Bilinear (Smooth)", q_high: "High Quality (Fant / Lanczos)",
        free_mode: "Enable Free Mode", free_mode_lock: "Lock Ratio (72x24)", result_label: "Result 72x24 (Pure Pixels)",
        choose_base: "Choose your preferred base skin:", custom: "Custom", search_java: "Search Java player:",
        search_btn: "Search Skin", upload_base: "Or upload a custom base (64x64):", hover_faces: "(Hover over faces)",
        play: "Play", pause: "Pause", explode: "Explode", apply_base: "💾 APPLY THIS BASE", gen_27: "Generate & Download ZIP",
        clear_all: "Clear All", footer_made: "Created by", sig_title: "Skin Signature (Watermark)", sig_desc: "Stamp your 8x8 face at the (0,0) texture corner.",
        sig_btn: "Load Face", sig_check: "Apply signature to files", skin_sel: "Selected Skin",
        readme: "==================================================\n   NAMEMC SKIN ART INSTRUCTIONS\n==================================================\n* IMPORTANT: It is NOT recommended to change your skin via the Minecraft website. Please use the official Minecraft Launcher for best results, then press F5 to refresh if viewing on a mobile phone or browser.\n* NOTE ON RECYCLED SKINS: If multiple skins look identical (e.g., solid white backgrounds), NameMC might skip them as 'recycled'. This tool automatically bypasses this by injecting an imperceptible pixel variant into duplicate files, forcing NameMC to recognize each one as completely unique! Alternatively, you can use the Studio Editor to add custom shades.\n\nUPLOAD FILES IN REVERSE ORDER:\n1. Upload 'c(9).png' first.\n2. Wait for NameMC to cache it.\n3. Upload backwards until 'a(1).png'.\n\nCreated by ArmandoLZ (Sonrojado) with SkinsArts."
    },
    es: {
        btn_studio: "EDITOR STUDIO", title: "Generador de skins Minecraft NameMC", dropzone_text: "arrastre su imagen aquí, haga clic o<br>presione CTRL + V para pegar",
        personalize_img: "Personalizar imagen", adjust_crop: "Ajustar encuadre de imagen:", quality: "Calidad (Algoritmo):",
        q_nearest: "Vecino más próximo (Pixeles puros)", q_bilinear: "Bilineal (Interpolación suave)", q_high: "Alta Calidad (Fant / Lanczos)",
        free_mode: "Activar Modo Libre", free_mode_lock: "Fijar Proporción (72x24)", result_label: "Resultado 72x24 (Pixeles Puros)",
        choose_base: "elija la base de la skin que mas prefiera:", custom: "Personalizada", search_java: "Buscar jugador de Java:",
        search_btn: "Buscar Skin", upload_base: "O sube una base propia (64x64):", hover_faces: "(Pasa el mouse)",
        play: "Play", pause: "Pausar", explode: "Separar", apply_base: "💾 APLICAR ESTA BASE", gen_27: "Generar y Descargar ZIP",
        clear_all: "Limpiar Todo", footer_made: "Esta página fue hecha por", sig_title: "Firma de Skin (Marca de agua)", sig_desc: "Estampa tu cara 8x8 en la esquina (0,0) del archivo.",
        sig_btn: "Cargar Cara", sig_check: "Aplicar firma en los archivos", skin_sel: "Skin Seleccionada",
        readme: "==================================================\n   INSTRUCCIONES PARA NAMEMC (SKIN ART)\n==================================================\n* IMPORTANTE: NO se recomienda cambiar la skin desde la página web de Minecraft. De preferencia hazlo desde el Launcher Oficial y presiona F5 para actualizar si lo estás viendo en un celular o navegador.\n* NOTA SOBRE SKINS RECICLADAS: Si varias skins se ven idénticas (por ejemplo, con fondos blancos), NameMC puede ignorarlas pensando que son recicladas. ¡Esta herramienta soluciona esto automáticamente inyectando una variación de píxel imperceptible en archivos duplicados, obligando a NameMC a reconocer cada una como única! También puedes usar el Editor Studio para añadir tonalidades personalizadas.\n\nPASOS PARA SUBIR (ORDEN INVERSO):\n1. Sube primero el archivo 'c(9).png'.\n2. Espera a que NameMC lo registre.\n3. Sube en reversa hasta la 'a(1).png'.\n\nCreado por ArmandoLZ (Sonrojado) con SkinsArts."
    }
};

let currentLang = 'en';

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[currentLang][key]) {
            if(el.tagName === 'OPTION' || el.tagName === 'SPAN') el.innerText = dict[currentLang][key];
            else el.innerHTML = dict[currentLang][key];
        }
    });
}

document.getElementById('btn-lang').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    applyLanguage();
    const mosBtn = document.getElementById('btn-pause-mosaic');
    mosBtn.innerHTML = mosaicSkinViewer && mosaicSkinViewer.autoRotate ? `⏸️ <span data-i18n="pause">${dict[currentLang]['pause']}</span>` : `▶️ <span data-i18n="play">${dict[currentLang]['play']}</span>`;
    const stuBtn = document.getElementById('btn-pause-studio');
    stuBtn.innerHTML = studioSkinViewer && studioSkinViewer.autoRotate ? `⏸️ <span data-i18n="pause">${dict[currentLang]['pause']}</span>` : `▶️ <span data-i18n="play">${dict[currentLang]['play']}</span>`;
});

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
const botonGenerar = document.getElementById('generate-btn');
const customPanel = document.getElementById('custom-panel');
const editorPanel = document.getElementById('editor-panel');
const btnToggleEditor = document.getElementById('btn-toggle-editor');
const imageToCrop = document.getElementById('image-to-crop'); 
const selectCalidad = document.getElementById('select-calidad');
const btnFreeMode = document.getElementById('btn-free-mode');
const checkFirma = document.getElementById('check-firma');
const sigPreview = document.getElementById('signature-preview');
const sigCtx = sigPreview.getContext('2d');
const mosaicWrapper = document.getElementById('mosaic-wrapper');
const mosaicContainer = document.getElementById('namemc-mosaic');
const preview3dLabel = document.getElementById('preview-3d-label');
const studioModal = document.getElementById('editor-studio-modal');
const btnOpenStudio = document.getElementById('btn-open-studio');
const editorSkinCanvas = document.getElementById('editor-skin-canvas');
const eCtx = editorSkinCanvas.getContext('2d');
const basePreviewCanvas = document.getElementById('base-preview-canvas');
const previewCtx = basePreviewCanvas.getContext('2d');

canvas.width = 72; canvas.height = 24;
previewCtx.imageSmoothingEnabled = false; eCtx.imageSmoothingEnabled = false; sigCtx.imageSmoothingEnabled = false;

let baseSkinImg = new Image(); baseSkinImg.crossOrigin = "Anonymous"; 
let signatureImg = new Image(); signatureImg.crossOrigin = "Anonymous"; 
let cropper = null; let isFreeMode = false; let isPainting = false; let selectedColor = "#11caa0";
let generatedSkinsData = []; 
let studioSkinViewer = null; let mosaicSkinViewer = null; let isExploded = false;

function initStudio3D() {
    if (!studioSkinViewer) {
        studioSkinViewer = new skinview3d.SkinViewer({ canvas: document.getElementById("skin-3d-viewer"), width: 320, height: 400 });
        if (skinview3d.createOrbitControls) {
            let controls = skinview3d.createOrbitControls(studioSkinViewer);
            controls.enableRotate = true; controls.enableZoom = true; controls.enablePan = false;
        }
        studioSkinViewer.autoRotate = false; 
    }
}

function initMosaic3D() {
    if (!mosaicSkinViewer) {
        mosaicSkinViewer = new skinview3d.SkinViewer({ canvas: document.getElementById("mosaic-3d-viewer"), width: 160, height: 260 });
        if (skinview3d.createOrbitControls) {
            let controls = skinview3d.createOrbitControls(mosaicSkinViewer);
            controls.enableRotate = true; controls.enableZoom = false; controls.enablePan = false;
        }
        mosaicSkinViewer.autoRotate = false; 
    }
}

document.getElementById('btn-pause-mosaic').addEventListener('click', (e) => {
    if (!mosaicSkinViewer) return;
    mosaicSkinViewer.autoRotate = !mosaicSkinViewer.autoRotate;
    e.target.innerHTML = mosaicSkinViewer.autoRotate ? `⏸️ <span data-i18n="pause">${dict[currentLang]['pause']}</span>` : `▶️ <span data-i18n="play">${dict[currentLang]['play']}</span>`;
});

document.getElementById('btn-pause-studio').addEventListener('click', (e) => {
    if (!studioSkinViewer) return;
    studioSkinViewer.autoRotate = !studioSkinViewer.autoRotate;
    e.target.innerHTML = studioSkinViewer.autoRotate ? `⏸️ <span data-i18n="pause">${dict[currentLang]['pause']}</span>` : `▶️ <span data-i18n="play">${dict[currentLang]['play']}</span>`;
});

document.getElementById('btn-explode-view').addEventListener('click', (e) => {
    if (!studioSkinViewer || !studioSkinViewer.playerObject) return;
    isExploded = !isExploded; const skin = studioSkinViewer.playerObject.skin; const offset = isExploded ? 6 : -6;
    skin.head.position.y += offset; skin.rightArm.position.x -= offset; skin.leftArm.position.x += offset;
    skin.rightLeg.position.x -= offset / 2; skin.rightLeg.position.y -= offset; skin.leftLeg.position.x += offset / 2; skin.leftLeg.position.y -= offset;
    e.target.innerText = isExploded ? "🔳 Join (T)" : `🔲 ${dict[currentLang]['explode']}`;
    e.target.classList.toggle('active', isExploded);
});

window.toggleLayer = function(layerName) {
    if (!studioSkinViewer || !studioSkinViewer.playerObject) return;
    const skin = studioSkinViewer.playerObject.skin;
    const parts = [skin.head, skin.body, skin.rightArm, skin.leftArm, skin.rightLeg, skin.leftLeg];
    const btn = event.target; const isActive = btn.classList.contains('active');
    parts.forEach(part => {
        if(layerName === 'inner' && part.innerLayer) part.innerLayer.visible = !isActive;
        if(layerName === 'outer' && part.outerLayer) part.outerLayer.visible = !isActive;
    });
    btn.classList.toggle('active', !isActive);
}

document.querySelectorAll('.part-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (!studioSkinViewer || !studioSkinViewer.playerObject) return;
        const part = studioSkinViewer.playerObject.skin[e.target.getAttribute('data-part')];
        if (part) { part.visible = !part.visible; e.target.classList.toggle('active', part.visible); }
    });
});

let syncTimeout = null;
function sync3D() { if (studioSkinViewer) studioSkinViewer.loadSkin(editorSkinCanvas.toDataURL()); }

function renderMosaicEnVivo() {
    if (!cropper || !baseSkinImg.src || baseSkinImg.src.endsWith("index.html")) return;
    initMosaic3D();
    mosaicWrapper.style.display = 'flex';
    mosaicContainer.innerHTML = ''; 
    generatedSkinsData = []; 
    
    const filas = 3; const columnas = 9; const tamano = 8;
    const prefijos = ['A', 'B', 'C']; const caraX = 8; const caraY = 8;
    let primeraSkinBase64 = null; 
    const aplicarFirma = checkFirma.checked && signatureImg.src;
    let hashesInBatch = new Set();

    for (let y = 0; y < filas; y++) {
        for (let x = 0; x < columnas; x++) {
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = 64; finalCanvas.height = 64;
            const finalCtx = finalCanvas.getContext('2d');
            finalCtx.imageSmoothingEnabled = false;

            finalCtx.drawImage(baseSkinImg, 0, 0, 64, 64);

            if (aplicarFirma) {
                finalCtx.drawImage(signatureImg, 8, 8, 8, 8, 0, 0, 8, 8); 
                finalCtx.drawImage(signatureImg, 40, 8, 8, 8, 0, 0, 8, 8); 
            }

            finalCtx.drawImage(canvas, x * tamano, y * tamano, tamano, tamano, caraX, caraY, tamano, tamano);

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
            facePreviewCanvas.width = 8; facePreviewCanvas.height = 8;
            const faceCtx = facePreviewCanvas.getContext('2d');
            faceCtx.imageSmoothingEnabled = false;
            faceCtx.drawImage(finalCanvas, caraX, caraY, tamano, tamano, 0, 0, tamano, tamano);
            
            facePreviewCanvas.dataset.fullSkin = dataUriCompleta;
            
            facePreviewCanvas.addEventListener('mouseenter', (e) => {
                document.querySelectorAll('.namemc-mosaic canvas').forEach(c => c.style.outline = 'none');
                e.target.style.outline = '2px solid #ff5555';
                preview3dLabel.innerText = `${dict[currentLang]['skin_sel']}: (${prefijos[y]}${x + 1})`;
                mosaicSkinViewer.loadSkin(e.target.dataset.fullSkin);
            });

            mosaicContainer.appendChild(facePreviewCanvas);
        }
    }
    mosaicSkinViewer.loadSkin(primeraSkinBase64);
}

baseSkinImg.onload = () => {
    basePreviewCanvas.style.display = 'block';
    previewCtx.clearRect(0, 0, 64, 64);
    previewCtx.drawImage(baseSkinImg, 0, 0, 64, 64);
    renderMosaicEnVivo(); 
};
checkFirma.addEventListener('change', renderMosaicEnVivo);
signatureImg.onload = () => {
    sigPreview.style.display = 'block';
    sigCtx.clearRect(0, 0, 8, 8);
    sigCtx.drawImage(signatureImg, 8, 8, 8, 8, 0, 0, 8, 8);
    sigCtx.drawImage(signatureImg, 40, 8, 8, 8, 0, 0, 8, 8);
    renderMosaicEnVivo();
};

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => { if (e.target.files.length > 0) iniciarProcesamiento(e.target.files[0]); });
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.backgroundColor = '#5c728a'; });
dropZone.addEventListener('dragleave', () => dropZone.style.backgroundColor = '#7289A0');
dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.style.backgroundColor = '#7289A0'; if (e.dataTransfer.files.length > 0) iniciarProcesamiento(e.dataTransfer.files[0]); });
window.addEventListener('paste', (evento) => {
    const items = (evento.clipboardData || evento.originalEvent.clipboardData).items;
    for (let index in items) { if (items[index].kind === 'file' && items[index].type.startsWith('image/')) iniciarProcesamiento(items[index].getAsFile()); }
});

function iniciarProcesamiento(archivo) {
    if (archivo && archivo.type.startsWith('image/')) {
        const lector = new FileReader();
        lector.onload = (e) => {
            if (cropper) cropper.destroy(); 
            imageToCrop.src = e.target.result;
            document.getElementById('btn-toggle-editor').style.display = 'inline-block';
            editorPanel.style.display = 'block'; 
            isFreeMode = false; btnFreeMode.innerText = dict[currentLang]['free_mode'];
            if (!baseSkinImg.src || baseSkinImg.src.endsWith("index.html")) baseSkinImg.src = 'steve_base.png';

            cropper = new Cropper(imageToCrop, {
                aspectRatio: 72 / 24, viewMode: 1, dragMode: 'move',     
                crop(event) { redibujarLienzoRostros(); },
                cropend(event) { renderMosaicEnVivo(); },
                ready() { renderMosaicEnVivo(); }
            });
        };
        lector.readAsDataURL(archivo);
    } else alert("Invalid image."); 
}

btnFreeMode.addEventListener('click', () => {
    if (!cropper) return;
    isFreeMode = !isFreeMode;
    if (isFreeMode) { cropper.setAspectRatio(NaN); btnFreeMode.innerText = dict[currentLang]['free_mode_lock']; btnFreeMode.style.borderColor = "#11caa0"; btnFreeMode.style.color = "#11caa0"; } 
    else { cropper.setAspectRatio(72 / 24); btnFreeMode.innerText = dict[currentLang]['free_mode']; btnFreeMode.style.borderColor = "#f39c12"; btnFreeMode.style.color = "#f39c12"; }
});

document.getElementById('btn-toggle-editor').addEventListener('click', () => { editorPanel.style.display = editorPanel.style.display === 'none' ? 'block' : 'none'; });

function redibujarLienzoRostros() {
    if (!cropper) return;
    const lienzoRecortado = cropper.getCroppedCanvas({ width: 72, height: 24, imageSmoothingEnabled: selectCalidad.value !== 'nearest', imageSmoothingQuality: selectCalidad.value === 'high' ? 'high' : 'low' });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (selectCalidad.value === 'nearest') ctx.imageSmoothingEnabled = false; 
    else { ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = selectCalidad.value === 'high' ? 'high' : 'low'; }
    ctx.drawImage(lienzoRecortado, 0, 0, 72, 24);
}
selectCalidad.addEventListener('change', () => { redibujarLienzoRostros(); renderMosaicEnVivo(); });

document.getElementById('btn-load-signature').addEventListener('click', () => {
    const nick = document.getElementById('signature-nick').value.trim();
    if (nick !== "") signatureImg.src = `https://minotar.net/skin/${nick}`;
});

document.getElementById('btn-steve').addEventListener('click', () => { customPanel.style.display = 'none'; baseSkinImg.src = 'steve_base.png'; });
document.getElementById('btn-alex').addEventListener('click', () => { customPanel.style.display = 'none'; baseSkinImg.src = 'alex_base.png'; });
document.getElementById('btn-namemc').addEventListener('click', () => { customPanel.style.display = 'none'; baseSkinImg.src = 'namemc_base.png'; });
document.getElementById('btn-custom').addEventListener('click', () => { customPanel.style.display = 'block'; });
document.getElementById('fetch-api-btn').addEventListener('click', () => {
    const username = document.getElementById('username-input').value.trim();
    if (username !== "") baseSkinImg.src = `https://minotar.net/skin/${username}`;
});
document.getElementById('local-base-input').addEventListener('change', (e) => {
    if (e.target.files[0]) {
        const lector = new FileReader();
        lector.onload = (event) => { baseSkinImg.src = event.target.result; };
        lector.readAsDataURL(e.target.files[0]);
    }
});

btnOpenStudio.addEventListener('click', () => {
    studioModal.classList.add('open'); initStudio3D(); eCtx.clearRect(0, 0, 64, 64);
    if(baseSkinImg.src && !baseSkinImg.src.endsWith("index.html")) eCtx.drawImage(baseSkinImg, 0, 0, 64, 64);
    sync3D(); 
});
document.getElementById('btn-close-studio').addEventListener('click', () => studioModal.classList.remove('open'));
document.getElementById('paint-color-picker').addEventListener('input', (e) => selectedColor = e.target.value);
document.querySelectorAll('.palette-color').forEach(b => {
    b.addEventListener('click', (e) => {
        if(e.target.id === 'btn-tool-eraser') selectedColor = "rgba(0,0,0,0)"; 
        else { selectedColor = e.target.getAttribute('data-color'); document.getElementById('paint-color-picker').value = selectedColor; }
    });
});
editorSkinCanvas.addEventListener('mousedown', (e) => { isPainting = true; pintarPixel(e); });
editorSkinCanvas.addEventListener('mousemove', (e) => { if (isPainting) pintarPixel(e); });
window.addEventListener('mouseup', () => { if (isPainting) { isPainting = false; sync3D(); } });
function pintarPixel(e) {
    const rect = editorSkinCanvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * 64); const y = Math.floor(((e.clientY - rect.top) / rect.height) * 64);
    if (selectedColor === "rgba(0,0,0,0)") eCtx.clearRect(x, y, 1, 1); else { eCtx.fillStyle = selectedColor; eCtx.fillRect(x, y, 1, 1); }
    if (!syncTimeout) syncTimeout = setTimeout(() => { sync3D(); syncTimeout = null; }, 100);
}
document.getElementById('btn-save-skin-edit').addEventListener('click', () => {
    baseSkinImg.src = editorSkinCanvas.toDataURL(); 
    studioModal.classList.remove('open');
});

botonGenerar.addEventListener('click', () => {
    if (generatedSkinsData.length === 0) { alert("Load an image first!"); return; }
    const zip = new JSZip();

    generatedSkinsData.forEach(skin => { zip.file(skin.name, skin.data, {base64: true}); });

    const artBase64 = canvas.toDataURL("image/png").split(',')[1];
    zip.file("Art_Mural_72x24.png", artBase64, {base64: true});

    zip.file("README.txt", dict[currentLang]['readme']);
    
    zip.generateAsync({type:"blob"}).then(function(contenido) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(contenido);
        link.download = "SkinsArt_generated.zip";
        link.click();
    });
});

document.getElementById('reset-app-btn').addEventListener('click', () => { if(confirm("Clear workspace?")) window.location.reload(); });

applyLanguage();