async function loadWasm() {
    let loadingElement = document.getElementById('loading');
    let wasmCanvas = document.getElementById('wasm-canvas');
    try {
        // noinspection JSFileReferences
        let wasmModule = await import('./wasm_module.js');
        let joystickModule = await import('./joystick.js');
        await wasmModule.default('./assets/wasm/wasm_module_bg.wasm');
        loadingElement.textContent = 'App loaded successfully!';
        setTimeout(() => loadingElement.textContent = '', 2000);
        wasmModule.setDebugMode(false);
        wasmModule.setCameraMode(true);
        window.addEventListener('keydown', e => {
            if (wasmModule.keyDown(e.key)) {
                e.preventDefault();
            }
        });
        window.addEventListener('keyup', e => {
            if (wasmModule.keyUp(e.key)) {
                e.preventDefault();
            }
        });

        let ctx = wasmCanvas.getContext('2d');
        // Apply nearest-neighbor scaling
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        // fullscreen
        document.getElementById('fs-button').addEventListener('click', () => {
            wasmCanvas.requestFullscreen?.() || wasmCanvas.webkitRequestFullscreen?.()
        });
        joystickModule.initJoystick(wasmModule);
    } catch (error) {
        loadingElement.textContent = 'Failed to load app: ' + error.message;
        loadingElement.style.color = 'orange';
    }
}

document.addEventListener('DOMContentLoaded', loadWasm);