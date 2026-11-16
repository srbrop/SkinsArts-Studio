const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    const username = 'TU_USUARIO';

    console.log('[CAPTURA HD] Conectando al navegador (Brave, Chrome o Edge)...');

    try {
        const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
        const pages = await browser.pages();
        let tabNameMC = pages.find(p => p.url().includes('namemc.com'));

        if (!tabNameMC) {
            throw new Error('Abre primero la pestana de tu perfil de NameMC en el navegador.');
        }

        await tabNameMC.bringToFront();

        if (!tabNameMC.url().toLowerCase().includes(`/profile/${username.toLowerCase()}`)) {
            await tabNameMC.goto(`https://es.namemc.com/profile/${username}`, { waitUntil: 'networkidle2', timeout: 60000 });
        }

        const client = await tabNameMC.target().createCDPSession();

        await client.send('Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
        await tabNameMC.setViewport({ width: 1920, height: 3000, deviceScaleFactor: 4 });

        const zoomFactor = await tabNameMC.evaluate(() => 1920 / window.innerWidth);

        if (Math.abs(zoomFactor - 1) > 0.005) {
            await tabNameMC.setViewport({
                width: Math.round(1920 * zoomFactor),
                height: Math.round(3000 * zoomFactor),
                deviceScaleFactor: 4 / zoomFactor
            });
        }

        await tabNameMC.addStyleTag({
            content: `
                html, body {
                    min-width: 1200px !important;
                    zoom: 100% !important;
                    scroll-behavior: auto !important;
                }
                .container, .container-lg, .container-xl {
                    width: 1140px !important;
                    max-width: 1140px !important;
                }
                .col-md-4, .col-lg-4, .card {
                    min-width: 379px !important;
                }
                .card canvas.skin-2d, .skin-2d {
                    image-rendering: pixelated !important;
                }
                ins.adsbygoogle, [id^="google_ads"], [class*="ad-"], iframe:not([src*="namemc"]), .namemc-extras, [class*="namemc-unlock"], [id*="namemc-extras"], [id*="namemc-unlock"] {
                    display: none !important;
                }
            `
        });

        await tabNameMC.evaluate(() => {
            document.documentElement.style.zoom = '100%';
            document.body.style.zoom = '100%';
            window.scrollTo(0, 0);
            window.dispatchEvent(new Event('resize'));
        });

        console.log('Esperando renderizado en alta resolucion...');
        await tabNameMC.waitForSelector('h1', { timeout: 30000 });
        await tabNameMC.waitForSelector('canvas', { timeout: 30000 });
        await new Promise(r => setTimeout(r, 2500));

        const rawRegion = await tabNameMC.evaluate(() => {
            window.scrollTo(0, 0);
            const nameEl = document.querySelector('h1');
            const cards = Array.from(document.querySelectorAll('.card'));
            const skinCard = cards.find(c => c.querySelector('canvas'));
            const mosaicCard = cards.find(c =>
                c.querySelectorAll('a[href*="/skin/"]').length > 0 ||
                c.innerText.includes('Aspectos') ||
                c.innerText.includes('Skins')
            );

            if (!nameEl || !skinCard || !mosaicCard) return null;

            const nRect = nameEl.getBoundingClientRect();
            const sRect = skinCard.getBoundingClientRect();
            const mRect = mosaicCard.getBoundingClientRect();

            const left = Math.min(nRect.left, sRect.left, mRect.left) + window.scrollX;
            const right = Math.max(nRect.right, sRect.right, mRect.right) + window.scrollX;
            const top = nRect.top + window.scrollY;
            const bottom = mRect.bottom + window.scrollY;

            return {
                x: Math.max(0, left),
                y: Math.max(0, top),
                width: right - left,
                height: bottom - top
            };
        });

        if (rawRegion) {
            const clipRegion = {
                x: Math.floor(rawRegion.x * zoomFactor),
                y: Math.floor(rawRegion.y * zoomFactor),
                width: Math.ceil(rawRegion.width * zoomFactor),
                height: Math.ceil(rawRegion.height * zoomFactor)
            };

            let numeroMural = 1;
            while (fs.existsSync(path.join(__dirname, `${username}_mural_${numeroMural}.png`))) {
                numeroMural++;
            }

            const savePath = path.join(__dirname, `${username}_mural_${numeroMural}.png`);

            await tabNameMC.screenshot({
                path: savePath,
                clip: clipRegion,
                captureBeyondViewport: true
            });
            console.log(`\nCaptura guardada con exito: ${username}_mural_${numeroMural}.png`);
        } else {
            console.log('\nError: No se pudo calcular el area del perfil.');
        }

        try {
            await client.send('Emulation.clearDeviceMetricsOverride');
        } catch (e) {}

        browser.disconnect();
    } catch (error) {
        console.error('\nError al tomar la captura:', error);
    }
})();
