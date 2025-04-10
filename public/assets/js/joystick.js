export function initJoystick(wasmModule) {
    let simulateWithMouse = true;

    let canvas = document.getElementById('wasm-canvas');
    canvas.addEventListener('touchstart', inputStart);

    /**
     * @param {TouchEvent|MouseEvent} event
     */
    function inputPosition(event) {
        let x = event.clientX;
        let y = event.clientY;
        let isTouch = false;
        if (event.touches && event.touches.length > 0) {
            let touch = event.touches[0];
            x = touch.clientX;
            y = touch.clientY;

            isTouch = true;
        }

        const rect = canvas.getBoundingClientRect();
        if (document.fullscreenElement === canvas || document.webkitFullscreenElement === canvas) {
            let scaleFactor = canvas.width / rect.width;
            if (rect.width > rect.height) {
                let verticalOffset = (rect.height * scaleFactor - canvas.height) / 2;
                if (isTouch) {
                    return {
                        x: (x - rect.left) * scaleFactor,
                        y: (y - rect.top) * scaleFactor - verticalOffset,
                    };
                }
                return {
                    x: x * scaleFactor,
                    y: y * scaleFactor - verticalOffset,
                };
            }
            // else if (rect.width > rect.height) {
            //     let horizontalOffset = (rect.width * scaleFactor - canvas.width) / 2;
            //     if (isTouch) {
            //         return {
            //             x: (x - rect.left) * scaleFactor - horizontalOffset,
            //             y: (y - rect.top) * scaleFactor,
            //         };
            //     }
            //     return {
            //         x: x * scaleFactor - horizontalOffset,
            //         y: y * scaleFactor,
            //     };
            // }
            else {
                return {
                    x: x * scaleFactor,
                    y: y * scaleFactor,
                };
            }
        }

        if (isTouch) {
            return {
                x: (x - rect.left) * canvas.width / rect.width,
                y: (y - rect.top) * canvas.height / rect.height
            };
        } else {
            return {
                x: x - rect.left,
                y: y - rect.top,
            };
        }

    }

    /**
     * @param {TouchEvent | MouseEvent} inputEvent
     */
    function inputStart(inputEvent) {
        inputEvent.preventDefault();
        let {x, y} = inputPosition(inputEvent);
        wasmModule.setJoystickOrigin(x, y);
        wasmModule.setJoystickIsShown(1);
    }

    /**
     * @param {TouchEvent | MouseEvent} inputEvent
     */
    function inputMove(inputEvent) {
        inputEvent.preventDefault();
        if (wasmModule.joystickIsShown()) {
            let {x, y} = inputPosition(inputEvent);
            wasmModule.setJoystickStick(x, y);
        }
    }

    /**
     * @param {TouchEvent | MouseEvent} inputEvent
     */
    function inputEnd(inputEvent) {
        inputEvent.preventDefault();
        wasmModule.setJoystickIsShown(0);
    }

    canvas.addEventListener('touchstart', inputStart);
    canvas.addEventListener('touchmove', inputMove);
    canvas.addEventListener('touchend', inputEnd);

    if (simulateWithMouse) {
        canvas.addEventListener('mousedown', inputStart);
        canvas.addEventListener('mousemove', inputMove);
        canvas.addEventListener('mouseup', inputEnd);
        canvas.addEventListener('mouseleave', inputEnd);
    }
}