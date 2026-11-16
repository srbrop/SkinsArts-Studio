const puppeteer = require('puppeteer');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

(async () => {
    const username = 'TU_USUARIO';

    const urlNameMC = `https://es.namemc.com/profile/${username}`;
    const letras = ['c', 'b', 'a'];
    const skinsCompletas = [];

    for (let letra of letras) {
        for (let i = 9; i >= 1; i--) {
            skinsCompletas.push(`${letra}(${i}).png`);
        }
    }

    console.log('\n===============================================');
    console.log("MODO GUIADO CON LA TECLA 'Z'");
    console.log('===============================================');

    rl.question('En que skin quieres iniciar o retomar? (Ejemplo: c(9), b(3), a(5)): ', async (respuesta) => {
        const inputUsuario = (respuesta.trim() || 'c(9)').toLowerCase();
        const skinBuscada = inputUsuario.endsWith('.png') ? inputUsuario : `${inputUsuario}.png`;
        const indice = skinsCompletas.indexOf(skinBuscada);

        if (indice === -1) {
            console.log(`\nError: No se encontro "${skinBuscada}" en la lista de 27 skins.`);
            process.exit(1);
        }

        const skinsFaltantes = skinsCompletas.slice(indice);
        rl.close();

        let saltarManual = false;
        let dispararFreno = null;

        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', (key) => {
            if (key.toLowerCase() === 'z') {
                saltarManual = true;
                if (dispararFreno) dispararFreno();
            }
            if (key === '\u0003') {
                console.log('\nDeteniendo el script manualmente...');
                process.exit();
            }
        });

        console.log(`\nIniciando desde: ${skinsFaltantes[0]}`);
        console.log(`Skins restantes en este lote: ${skinsFaltantes.length}\n`);

        try {
            console.log('Conectando a tu navegador...');
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

            console.log('Pestanas detectadas. Iniciando subida...\n');

            for (let skin of skinsFaltantes) {
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
                            await tabMinecraft.goto('https://www.minecraft.net/msaprofile/mygames/editskin', { waitUntil: 'domcontentloaded', timeout: 60000 });
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
                            await tabMinecraft.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
                            await new Promise(r => setTimeout(r, 15000));
                            intentos++;
                        }
                    } catch (innerError) {
                        console.log(`   [ERROR DE NAVEGADOR] ${innerError.message}`);
                        console.log('   [RECUPERACION] Forzando recarga (15s)...');
                        try { await tabMinecraft.reload({ waitUntil: 'domcontentloaded', timeout: 60000 }); } catch (e) {}
                        await new Promise(r => setTimeout(r, 15000));
                        intentos++;
                    }
                }

                console.log('Pasando a NameMC...');
                try { await tabNameMC.bringToFront(); } catch (e) {}

                saltarManual = false;
                console.log('   [ATENCION] Cuando veas que la skin se actualizo, presiona la tecla "Z" para continuar.');

                for (let ciclo = 1; ciclo <= 10; ciclo++) {
                    if (saltarManual) {
                        console.log('   [SALTO CON TECLA Z] Pasando a la siguiente skin...');
                        break;
                    }

                    console.log(`   Ciclo #${ciclo} de 10... (Recargando)`);

                    try {
                        const promesaRecarga = tabNameMC.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
                        const promesaEscape = new Promise(resolve => { dispararFreno = resolve; });

                        await Promise.race([promesaRecarga, promesaEscape]);
                        dispararFreno = null;
                    } catch (nameMcError) {
                        console.log('   [AVISO] NameMC demoro en responder. Continuando...');
                    }

                    if (saltarManual) {
                        console.log('   [SALTO CON TECLA Z] Pasando a la siguiente skin...');
                        break;
                    }

                    if (ciclo < 10) {
                        process.stdout.write('   Esperando 6s... (Presiona la tecla Z para saltar) ');
                        for (let m = 0; m < 60; m++) {
                            if (saltarManual) break;
                            await new Promise(r => setTimeout(r, 100));
                        }
                        console.log();
                    }
                }

                console.log('Enfriando sistema 4s...\n');
                await new Promise(r => setTimeout(r, 4000));
            }

            browser.disconnect();
            console.log('\nPROCESO COMPLETADO. Todas las skins seleccionadas fueron subidas.');
            process.exit(0);
        } catch (error) {
            console.error('\nError en la ejecucion:', error);
            process.exit(1);
        }
    });
})();
