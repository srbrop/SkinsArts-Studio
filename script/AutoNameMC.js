const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const username = 'TU_USUARIO';

    const urlNameMC = `https://es.namemc.com/profile/${username}`;
    const letras = ['c', 'b', 'a'];
    const skins = [];

    for (let letra of letras) {
        for (let i = 9; i >= 1; i--) {
            skins.push(`${letra}(${i}).png`);
        }
    }

    console.log(`Lista generada: ${skins.length} skins para subir.`);

    try {
        console.log('Conectando a tu navegador para la subida...');
        const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
        const pages = await browser.pages();

        let tabMinecraft = pages.find(p => p.url().includes('minecraft.net'));
        let tabNameMC = pages.find(p => p.url().includes('namemc.com'));

        if (!tabMinecraft || !tabNameMC) {
            throw new Error('No se encontraron las pestanas requeridas. Asegurate de tener minecraft.net y namemc.com abiertas.');
        }

        if (!tabNameMC.url().toLowerCase().includes(username.toLowerCase())) {
            await tabNameMC.goto(urlNameMC, { waitUntil: 'domcontentloaded', timeout: 60000 });
        }

        console.log('Pestanas detectadas. Iniciando subida automatica...\n');

        for (let skin of skins) {
            const skinPath = path.join(__dirname, skin);
            let subidaExitosa = false;
            let intentos = 1;

            while (!subidaExitosa) {
                console.log(`[Intento #${intentos}] Procesando: ${skin}...`);

                try {
                    await tabMinecraft.bringToFront();

                    if (!tabMinecraft.url().includes('editskin')) {
                        console.log('[ALERTA] Redireccion detectada. Pausando 30s...');
                        await new Promise(r => setTimeout(r, 30000));
                        await tabMinecraft.goto('https://www.minecraft.net/msaprofile/mygames/editskin', { waitUntil: 'networkidle2', timeout: 60000 });
                        continue;
                    }

                    const btnSelectorFile = '#choose-file';
                    await tabMinecraft.waitForSelector(btnSelectorFile, { visible: true, timeout: 15000 });

                    const [fileChooser] = await Promise.all([
                        tabMinecraft.waitForFileChooser({ timeout: 15000 }),
                        tabMinecraft.click(btnSelectorFile)
                    ]);
                    await fileChooser.accept([skinPath]);

                    await new Promise(r => setTimeout(r, 2500));

                    const promesaRed = tabMinecraft.waitForResponse(
                        res => res.url().includes('/profile/skins') && res.request().method() !== 'OPTIONS',
                        { timeout: 12000 }
                    ).catch(() => null);

                    console.log('   Enviando peticion a Mojang...');
                    const btnCargar = 'button[data-aem-contentname="Upload Skin"]';
                    await tabMinecraft.waitForSelector(btnCargar, { visible: true, timeout: 15000 });
                    await tabMinecraft.click(btnCargar);

                    const respuestaAPI = await promesaRed;

                    if (respuestaAPI && respuestaAPI.ok()) {
                        console.log('   [CONFIRMADO] El servidor acepto la skin correctamente.');
                        subidaExitosa = true;
                    } else {
                        if (!respuestaAPI) {
                            console.log('   [FALLO] Peticion perdida o pagina congelada.');
                        } else {
                            const statusCode = respuestaAPI.status();
                            let detallesError = 'No detallado.';
                            try { detallesError = await respuestaAPI.text(); } catch (e) {}
                            console.log(`   [RECHAZADO] Codigo: ${statusCode} | Motivo: ${detallesError}`);
                        }

                        console.log('   [ESPERA] Esperando 15s para reintentar...');
                        await tabMinecraft.reload({ waitUntil: 'networkidle2', timeout: 60000 });
                        await new Promise(r => setTimeout(r, 15000));
                        intentos++;
                    }
                } catch (innerError) {
                    console.log(`   [ERROR DE NAVEGADOR] ${innerError.message}`);
                    console.log('   [RECUPERACION] Forzando recarga (15s)...');
                    try { await tabMinecraft.reload({ waitUntil: 'networkidle2', timeout: 60000 }); } catch (e) {}
                    await new Promise(r => setTimeout(r, 15000));
                    intentos++;
                }
            }

            try {
                console.log('Pasando a NameMC para actualizar el historial...');
                await tabNameMC.bringToFront();

                for (let ciclo = 1; ciclo <= 4; ciclo++) {
                    console.log(`   Ejecutando F5 #${ciclo} de 4...`);
                    await tabNameMC.reload({ waitUntil: 'networkidle2', timeout: 60000 });

                    if (ciclo < 4) {
                        console.log('   Esperando 8s...');
                        await new Promise(r => setTimeout(r, 8000));
                    }
                }

                console.log('Historial actualizado tras 4 ciclos.');
            } catch (nameMcError) {
                console.log('   [AVISO] Retraso al recargar NameMC.');
            }

            console.log('Esperando 7s de seguridad finales...\n');
            await new Promise(r => setTimeout(r, 7000));
        }

        browser.disconnect();
        console.log('\nPROCESO COMPLETADO. Las 27 skins fueron subidas.');
    } catch (error) {
        console.error('\nError en la ejecucion:', error);
    }
})();
