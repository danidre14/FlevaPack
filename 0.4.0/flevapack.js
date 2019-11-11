/*!
 * FlevaPack v0.4.0
 * (c) 2019 Danidre
 * Released under the MIT License.
 */
const FPEngine = function (gameAreaId, options) {
    let defaultCW = options ? options.dimensions ? options.dimensions.width || 400 : 400 : 400;
    let defaultCH = options ? options.dimensions ? options.dimensions.height || 400 : 400 : 400;
    let WIDTH = defaultCW;
    let HEIGHT = defaultCH;
    let LEFT = 0;
    let TOP = 0;
    let PAD = 40;
    let PANELHIDDEN = options ? options.panelHidden !== undefined ? options.panelHidden : false : false;
    let FILLSCREEN = options ? options.fillScreen !== undefined ? options.fillScreen : false : false;
    const LOCKSIZE = options ? options.dimensions ? options.dimensions.lock !== undefined ? options.dimensions.lock : true : true : true;
    const index = options ? options.index ? options.index || 0 : 0 : 0;
    const showLogs = options ? options.showLogs !== undefined ? options.showLogs : true : true;
    const gameName = options ? options.name ? options.name || "Game" : "Game" : "Game";
    const safeRender = options ? options.safeRender !== undefined ? options.safeRender : true : true;
    const renderOnMouse = options ? options.renderOn !== undefined ? options.renderOn.mouse : false : false;
    const startEmpty = options ? options.startEmpty !== undefined ? options.startEmpty : false : false;
    const SELECTION = options ? options.selection !== undefined ? options.selection : true : true;
    let renderCallBack = options ? options.renderMethod ? options.renderMethod || 'render' : 'render' : 'render';

    let mouseX = 0;
    let mouseY = 0;
    let movementX = 0;
    let movementY = 0;

    //object stuff
    const defaultObjectPadding = 0;

    //btn stuff
    const defaultBtnW = 100; //btn width
    const defaultBtnH = 30; //height
    const defaultBtnS = 18; //fontsize (3/5 of height)
    const defaultBtnL = "Button"; //button label
    const defaultBtnB = "solid #367530 2px"; //border
    const defaultBtnBR = 0; //border radius
    const defaultBtnBC = "#4CAF50"; //background color
    const defaultBtnTC = "white"; //text colour
    const defaultBtnBCH = "#46a049"; //background color: hover
    const defaultBtnTCH = "white"; //text color: hover
    const defaultBtnBCA = "#408039"; //background color: active
    const defaultBtnTCA = "white"; //text color: active

    //img stuff
    const defaultImgW = 100; //img width
    const defaultImgH = 100; //height

    //text field all stuff
    const defaultTfaBC = "#efe5e9"; //background color
    const defaultTfaTC = "#101915"; //text colour
    const defaultTfaB = "solid #cccccc 2px"; //border colour
    const defaultTfaBR = 3; //border radius
    const defaultTfaPadding = 2;

    //singleline stuff
    const defaultTfsW = 150; //img width
    const defaultTfsH = 30; //height
    const defaultTfsS = 18; //fontsize

    //multiline stuff
    const defaultTfmW = 150; //img width
    const defaultTfmH = 120; //height
    const defaultTfmS = 18; //fontsize

    let defaultFont = "Arial";
    const emptyFunc = () => { };

    const getStage = function () {
        return gameCanvas;
    }
    const getRoot = function () {
        return gameCanvasDiv;
    }
    const getViewport = function (name) {
        if (!name) return console.error(`No viewport specified.`);
        else if (!viewports[name]) return console.error(`Cannot get "${name}": Viewport does not exist.`);
        else return viewports[name].object;
    }
    const getObject = function (name) {
        if (!name) return console.error(`No object specified.`);
        else if (!gameobjects[name]) return console.error(`Cannot get "${name}": Object does not exist.`);
        else return gameobjects[name].object;
    }
    const getViewportContext = function (name) {
        if (name && viewports[name]) return viewports[name].object.stage;
        else if (name && !viewports[name]) return console.error(`Cannot get "${name}" context: Viewport does not exist.`);
        else return stage;

    }

    const getViewportWidth = function (name) {
        if (name && viewports[name]) return viewports[name].object.width;
        else if (name && !viewports[name]) return console.error(`Cannot get "${name}" width: Viewport does not exist.`);
        else return gameCanvas.width;
    }
    const getWidth = function () {
        if (PANELHIDDEN) return gameCanvasDiv.clientWidth || gameCanvasDiv.offsetWidth || defaultCW;
        else return gamePanel.clientWidth || gamePanel.offsetWidth || gamePanel.style.width || defaultCW;
    }
    const setWidth = function (width, name) {
        if (name && viewports[name]) {
            viewports[name].WIDTH = width !== undefined ? width : viewports[name].WIDTH;
            viewports[name].object.width = viewports[name].WIDTH + "px";
        }
        else if (name && !viewports[name]) {
            return console.error(`Cannot set "${name}" width: Viewport does not exist.`);
        } else {
            defaultCW = width !== undefined ? width : defaultCW;
            gameCanvasDiv.style.width = defaultCW + "px";
            WIDTH = getWidth();
        }
        resizeCanvas();
    }

    const getViewportHeight = function (name) {
        if (name && viewports[name]) return viewports[name].object.height;
        else if (name && !viewports[name]) return console.error(`Cannot get "${name}" height: Viewport does not exist.`);
        else return gameCanvas.height;
    }
    const getHeight = function () {
        if (PANELHIDDEN) return gameCanvasDiv.clientHeight || gameCanvasDiv.offsetHeight || defaultCH;
        else return gamePanel.clientHeight || gamePanel.offsetHeight || gamePanel.style.height || defaultCH;
    }
    const setHeight = function (height, name) {
        if (name && viewports[name]) {
            viewports[name].HEIGHT = height !== undefined ? height : viewports[name].HEIGHT;
            viewports[name].object.height = viewports[name].HEIGHT + "px";
        }
        else if (name && !viewports[name]) {
            return console.error(`Cannot set "${name}" height: Viewport does not exist.`);
        } else {
            defaultCH = height !== undefined ? height : defaultCH;
            gameCanvasDiv.style.height = defaultCH + "px";
            HEIGHT = getHeight();
        }
        resizeCanvas();
    }

    const setProperties = function (options, name) {
        if (!options) return console.warn(`No properties declared: setProperties().`);
        if (name && viewports[name]) {
            if (options.x) setX(options.x, name);
            if (options.y) setY(options.y, name);
            if (options.width) setWidth(options.width, name);
            if (options.height) setHeight(options.height, name);
            if (options.id) setId(options.id, name);
            return;
        }
        else if (name && !viewports[name]) {
            return console.error(`Cannot set "${name}" dimensions: Viewport does not exist.`);
        } else {
            if (options.width) setWidth(options.width);
            if (options.height) setHeight(options.height);
        }
    }
    const getProperties = function () {

        const propsList = {
            width: getWidth(),
            height: getHeight(),
            viewports: getViewports(),
            objects: getObjects()
        }
        if (typeof returns !== "string") return propsList;
        return getSerializedProperties(propsList, returns);
    }

    const getViewports = function () {
        return Object.keys(viewports);
    }
    const getObjects = function () {
        return Object.keys(gameobjects);
    }

    const setX = function (x, name) {
        if (name && viewports[name]) {
            viewports[name].LEFT = x !== undefined ? x : viewports[name].LEFT;
            viewports[name].object.style.left = viewports[name].LEFT + "px";
        }
        else if (name && !viewports[name]) {
            return console.error(`Cannot set "${name}" x: Viewport does not exist.`);
        }
    }
    const setY = function (y, name) {
        if (name && viewports[name]) {
            viewports[name].TOP = y !== undefined ? y : viewports[name].TOP;
            viewports[name].object.style.top = viewports[name].TOP + "px";
        }
        else if (name && !viewports[name]) {
            return console.error(`Cannot set "${name}" y: Viewport does not exist.`);
        }
    }
    const setId = function (id, name) {
        if (name && viewports[name]) {
            viewports[name].object.id = id;
        }
        else if (name && !viewports[name]) {
            return console.error(`Cannot set "${name}" id: Viewport does not exist.`);
        }
    }
    // const resetCanvas = function () {
    //     stage.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    // }

    const getMouseX = function () {
        return mouseX;
    }
    const getMouseY = function () {
        return mouseY;
    }
    const getMouse = function () {
        return { x: mouseX, y: mouseY };
    }
    const getViewportSize = function () {
        var w = document.documentElement.clientWidth || window.innerWidth || 0;
        var h = document.documentElement.clientHeight || window.innerHeight || window.outerHeight || 0;

        w = Math.min(document.documentElement.clientWidth, window.outerWidth, window.innerWidth) || 0;
        // console.log(document.documentElement.clientWidth, window.outerWidth, window.innerWidth);
        return { w: w, h: h }
    }
    const resizeCanvas = function (dontRender) {
        const vp = getViewportSize();
        if (!isFullscreen()) {
            if (FILLSCREEN) {
                gameCanvasDiv.style.width = vp.w + 'px';
                gameCanvasDiv.style.height = vp.h + 'px';
            } else if (!LOCKSIZE) {
                const pad = getPadded();
                gameCanvasDiv.style.width = Math.min(defaultCW, vp.w) - pad.width + 'px';
                gameCanvasDiv.style.height = Math.min(defaultCH, vp.h) - pad.height + 'px';
            } else if (LOCKSIZE) {
                getPadded();
                // const pad = 2;
                if (vp.w - PAD < WIDTH) {
                    const newW = vp.w - PAD;
                    const newH = defaultCW / defaultCH;
                    gameCanvasDiv.style.width = (newW) + 'px';
                    gameCanvasDiv.style.height = (newW / newH) + 'px';
                } else {
                    gameCanvasDiv.style.width = defaultCW + "px";
                    gameCanvasDiv.style.height = defaultCH + "px";
                }
            }
            gameCanvas.width = gameCanvasDiv.clientWidth || gameCanvasDiv.offsetWidth || defaultCW; //refactor soon (make vars for these)
            gameCanvas.height = gameCanvasDiv.clientHeight || gameCanvasDiv.offsetHeight || defaultCH;
            LEFT = 0;
            TOP = 0;
        }

        let width = gameCanvasDiv.clientWidth || gameCanvasDiv.offsetWidth || defaultCW; //refactor soon (make vars for these)
        let height = gameCanvasDiv.clientHeight || gameCanvasDiv.offsetHeight || defaultCH;
        if (LOCKSIZE) {
            // const vp = getViewportSize();
            const canvRatio = defaultCW / defaultCH;
            const viewRatio = width / height;
            if (viewRatio < canvRatio) {
                const heightRatio = defaultCW / defaultCH;
                const newW = width;
                const newH = width / heightRatio;
                gameCanvas.width = newW;
                gameCanvas.height = newH;
                LEFT = 0;
                TOP = ((height - newH) / 2);
            } else if (viewRatio > canvRatio) {
                const widthRatio = defaultCH / defaultCW;
                const newW = height / widthRatio;
                const newH = height;
                gameCanvas.width = newW;
                gameCanvas.height = newH;
                LEFT = ((width - newW) / 2);
                TOP = 0;
            } else {
                gameCanvas.width = gameCanvasDiv.clientWidth || gameCanvasDiv.offsetWidth || defaultCW;
                gameCanvas.height = gameCanvasDiv.clientHeight || gameCanvasDiv.offsetHeight || defaultCH;
                LEFT = 0;
                TOP = 0;
            }
        } else {
            gameCanvas.width = gameCanvasDiv.clientWidth || gameCanvasDiv.offsetWidth || defaultCW;
            gameCanvas.height = gameCanvasDiv.clientHeight || gameCanvasDiv.offsetHeight || defaultCH;
            LEFT = 0;
            TOP = 0;
        }
        for (const name in viewports) {
            if (viewports[name].STRETCHSIZE) {
                //this is stretch size
                viewports[name].object.width = viewports[name].WIDTH / defaultCW * gameCanvas.width;
                viewports[name].object.height = viewports[name].HEIGHT / defaultCH * gameCanvas.height;
                viewports[name].object.style.left = viewports[name].LEFT / defaultCW * gameCanvas.width + LEFT + "px";
                viewports[name].object.style.top = viewports[name].TOP / defaultCH * gameCanvas.height + TOP + "px";
            } else {
                viewports[name].object.width = viewports[name].WIDTH;
                viewports[name].object.height = viewports[name].HEIGHT;
                if (viewports[name].ALIGNH === "right") {
                    viewports[name].object.style.left = gameCanvas.width - ((defaultCW - (viewports[name].LEFT + viewports[name].WIDTH)) * (viewports[name].POSITIONH === "relative" ? gameCanvas.width / defaultCW : 1) + viewports[name].WIDTH) + LEFT + "px";
                } else if (viewports[name].ALIGNH === "center") {
                    viewports[name].object.style.left = gameCanvas.width / 2 - ((defaultCW / 2 - (viewports[name].LEFT + viewports[name].WIDTH / 2)) * (viewports[name].POSITIONH === "relative" ? gameCanvas.width / defaultCW : 1) + viewports[name].WIDTH / 2) + LEFT + "px";
                } else {
                    viewports[name].object.style.left = viewports[name].LEFT * (viewports[name].POSITIONH === "relative" ? gameCanvas.width / defaultCW : 1) + LEFT + "px";
                }
                if (viewports[name].ALIGNV === "bottom") {
                    viewports[name].object.style.top = gameCanvas.height - ((defaultCH - (viewports[name].TOP + viewports[name].HEIGHT)) * (viewports[name].POSITIONV === "relative" ? gameCanvas.height / defaultCH : 1) + viewports[name].HEIGHT) + TOP + "px";
                } else if (viewports[name].ALIGNV === "center") {
                    viewports[name].object.style.top = gameCanvas.height / 2 - ((defaultCH / 2 - (viewports[name].TOP + viewports[name].HEIGHT / 2)) * (viewports[name].POSITIONHV === "relative" ? gameCanvas.height / defaultCH : 1) + viewports[name].HEIGHT / 2) + TOP + "px";
                } else {
                    viewports[name].object.style.top = viewports[name].TOP * (viewports[name].POSITIONV === "relative" ? gameCanvas.height / defaultCH : 1) + TOP + "px";
                }
            }
            viewports[name].object.stage.imageSmoothingEnabled = false;
        }
        for (const name in gameobjects) {
            if (gameobjects[name].STRETCHSIZE) {
                //this is stretch size
                gameobjects[name].object.style.width = gameobjects[name].WIDTH / defaultCW * gameCanvas.width + "px";
                gameobjects[name].object.style.height = gameobjects[name].HEIGHT / defaultCH * gameCanvas.height + "px";
                gameobjects[name].object.style.left = gameobjects[name].LEFT / defaultCW * gameCanvas.width + LEFT + "px";
                gameobjects[name].object.style.top = gameobjects[name].TOP / defaultCH * gameCanvas.height + TOP + "px";
                gameobjects[name].object.style.fontSize = gameobjects[name].SIZE / defaultCH * gameCanvas.height + "px";
                gameobjects[name].object.style.borderTopRightRadius = gameobjects[name].CURVE_TR / defaultCW * gameCanvas.width + "px";
                gameobjects[name].object.style.borderBottomRightRadius = gameobjects[name].CURVE_BR / defaultCW * gameCanvas.width + "px";
                gameobjects[name].object.style.borderBottomLeftRadius = gameobjects[name].CURVE_BL / defaultCW * gameCanvas.width + "px";
                gameobjects[name].object.style.borderTopLeftRadius = gameobjects[name].CURVE_TL / defaultCW * gameCanvas.width + "px";
            } else {
                gameobjects[name].object.style.width = gameobjects[name].WIDTH + "px";
                gameobjects[name].object.style.height = gameobjects[name].HEIGHT + "px";
                if (gameobjects[name].ALIGNH === "right") {
                    gameobjects[name].object.style.left = gameCanvas.width - ((defaultCW - (gameobjects[name].LEFT + gameobjects[name].WIDTH)) * (gameobjects[name].POSITIONH === "relative" ? gameCanvas.width / defaultCW : 1) + gameobjects[name].WIDTH) + LEFT + "px";
                } else if (gameobjects[name].ALIGNH === "center") {
                    gameobjects[name].object.style.left = gameCanvas.width / 2 - ((defaultCW / 2 - (gameobjects[name].LEFT + gameobjects[name].WIDTH / 2)) * (gameobjects[name].POSITIONH === "relative" ? gameCanvas.width / defaultCW : 1) + gameobjects[name].WIDTH / 2) + LEFT + "px";
                } else {
                    gameobjects[name].object.style.left = gameobjects[name].LEFT * (gameobjects[name].POSITIONH === "relative" ? gameCanvas.width / defaultCW : 1) + LEFT + "px";
                }
                if (gameobjects[name].ALIGNV === "bottom") {
                    gameobjects[name].object.style.top = gameCanvas.height - ((defaultCH - (gameobjects[name].TOP + gameobjects[name].HEIGHT)) * (gameobjects[name].POSITIONV === "relative" ? gameCanvas.height / defaultCH : 1) + gameobjects[name].HEIGHT) + TOP + "px";
                } else if (gameobjects[name].ALIGNV === "center") {
                    gameobjects[name].object.style.top = gameCanvas.height / 2 - ((defaultCH / 2 - (gameobjects[name].TOP + gameobjects[name].HEIGHT / 2)) * (gameobjects[name].POSITIONHV === "relative" ? gameCanvas.height / defaultCH : 1) + gameobjects[name].HEIGHT / 2) + TOP + "px";
                } else {
                    gameobjects[name].object.style.top = gameobjects[name].TOP * (gameobjects[name].POSITIONV === "relative" ? gameCanvas.height / defaultCH : 1) + TOP + "px";
                }
                gameobjects[name].object.style.fontSize = gameobjects[name].SIZE + "px";
                gameobjects[name].object.style.borderTopRightRadius = gameobjects[name].CURVE_TR + "px";
                gameobjects[name].object.style.borderBottomRightRadius = gameobjects[name].CURVE_BR + "px";
                gameobjects[name].object.style.borderBottomLeftRadius = gameobjects[name].CURVE_BL + "px";
                gameobjects[name].object.style.borderTopLeftRadius = gameobjects[name].CURVE_TL + "px";
            }
        }
        gameCanvas.style.left = LEFT + "px";
        gameCanvas.style.top = TOP + "px";
        stage.imageSmoothingEnabled = false;
        if (dontRender === "true") return;
        render();
    }

    const clearCanvas = function (name) {
        if (name && viewports[name]) {
            viewports[name].object.stage.clearRect(0, 0, viewports[name].object.width, viewports[name].object.height);
        }
        else if (name && !viewports[name]) {
            return console.error(`Cannot clear "${name}": Viewport does not exist.`);
        } else {
            stage.fillStyle = "white";
            stage.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        }
    };
    const renderNoMethod = function () {
        stage.fillStyle = "white";
        stage.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        stage.fillStyle = "black";
        stage.font = '20px Arial';
        stage.fillText("No render method found.", 0, gameCanvas.height);
    };
    const renderError = function (message) {
        if (message)
            console.error("Render error: ", message)

        stage.fillStyle = "white";
        stage.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        stage.fillStyle = "black";
        stage.font = '20px Arial';
        stage.fillText(`Check Logs> Render error${message ? ': ' + message + '!' : '!'}`.toUpperCase(), 0, 20);
        stage.fillText(`Check Logs> Render error${message ? ': ' + message + '!' : '!'}`.toUpperCase(), 0, gameCanvas.height);
    };
    const renderNothing = function () {
        stage.fillStyle = "white";
        stage.fillRect(0, 0, gameCanvas.width / 2, gameCanvas.height / 2);
        stage.fillStyle = "grey";
        stage.fillRect(gameCanvas.width / 2, 0, gameCanvas.width / 2, gameCanvas.height / 2);
        stage.fillStyle = "grey";
        stage.fillRect(0, gameCanvas.height / 2, gameCanvas.width / 2, gameCanvas.height / 2);
        stage.fillStyle = "white";
        stage.fillRect(gameCanvas.width / 2, gameCanvas.height / 2, gameCanvas.width / 2, gameCanvas.height / 2);
    };

    const getPadded = function () {
        //PAD = (parseInt(window.getComputedStyle(gameCanvasDiv, null).getPropertyValue('margin-left')) +
        //parseInt(window.getComputedStyle(document.getElementById('main'), null).getPropertyValue('padding-left')) +
        //parseInt(window.getComputedStyle(gameCanvasDiv, null).getPropertyValue('border-left-width'))) * 2;
        if (PANELHIDDEN) {
            PAD = 0;
            return { width: 0, height: 0 }
        } else {
            const stageW = parseInt(window.getComputedStyle(gameCanvasDiv, null).getPropertyValue('width'));
            const stageH = parseInt(window.getComputedStyle(gameCanvasDiv, null).getPropertyValue('height'));
            const panelW = parseInt(window.getComputedStyle(gamePanel, null).getPropertyValue('width'));
            const panelH = parseInt(window.getComputedStyle(gamePanel, null).getPropertyValue('height'));
            const pad = {
                width: panelW - stageW + 20, height: panelH - stageH + 20
            }
            PAD = pad.width;
            return pad;
        }
    }

    const setMousePosition = function (event) {
        if (!isPointerlock()) {
            const rect = gameCanvas.getBoundingClientRect(),
                scaleX = gameCanvas.width / rect.width,
                scaleY = gameCanvas.height / rect.height;

            movementX = parseInt((event.clientX - rect.left) * scaleX);
            movementY = parseInt((event.clientY - rect.top) * scaleY);
            mouseX = movementX;
            mouseY = movementY;
        } else {

            movementX += event.movementX;
            movementY += event.movementY;
            if (pointerLockType === "loop") {
                if (movementX > gameCanvas.width) {
                    movementX = 0;
                }
                if (movementY > gameCanvas.height) {
                    movementY = 0;
                }
                if (movementX < 0) {
                    movementX = gameCanvas.width;
                }
                if (movementY < 0) {
                    movementY = gameCanvas.height;
                }
            } else {//its default is "lock"

                if (movementX > gameCanvas.width) {
                    movementX = gameCanvas.width;
                }
                if (movementY > gameCanvas.height) {
                    movementY = gameCanvas.height;
                }
                if (movementX < 0) {
                    movementX = 0;
                }
                if (movementY < 0) {
                    movementY = 0;
                }
            }
            mouseX = movementX;
            mouseY = movementY;
        }

        if (LOCKSIZE) {
            const scale = defaultCW / getViewportWidth();
            mouseX *= scale;
            mouseY *= scale;

            mouseX = parseInt(mouseX);
            mouseY = parseInt(mouseY);
        }

        if (renderOnMouse)
            render();
    }


    const paint = function (method, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
        stage[method](a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
    }
    const prop = function (prop, val) {
        stage[prop] = val;
    }

    const renderMethod = function (renderMethod) {
        renderCallBack = renderMethod;
    }
    let remMem = [];
    const render = function () {
        if (safeRender) {
            renderNothing(); return;
        }
        try {
            if (typeof renderCallBack === 'string')
                window[renderCallBack]();
            else
                renderCallBack();
        } catch (e) {
            if (showLogs) console.error('Render attempt failed: ', e.message);
            renderMethod(renderError);
            return renderError(e.message);
        }
        if (arguments.length > 0) {
            remMem = [];
            for (const i in arguments) {
                try {
                    if (typeof arguments[i] === 'string') {
                        window[arguments[i]]();
                    } else {
                        arguments[i]();
                    }
                    remMem.push(arguments[i]);
                } catch (e) {
                    if (showLogs) console.error('Render attempt failed: ', e.message);
                    renderMethod(renderError);
                    return renderError(e.message);
                }
            }
        } else {
            for (const i in remMem) {
                try {
                    if (typeof remMem[i] === 'string') {
                        window[remMem[i]]();
                    } else {
                        remMem[i]();
                    }
                } catch (e) {
                    if (showLogs) console.error('Render attempt failed: ', e.message);
                    renderMethod(renderError);
                    return renderError(e.message);
                }
            }
        }
    }

    let pointerLockType = "lock";
    const setPointerLockType = function (type) {
        pointerLockType = type;
    }
    const pointerlockHandler = function () {
        // console.log(isPointerlock())
    }

    const isPointerlock = function () {
        const pointerLockElement = document.pointerLockElement || document.mozPointerLockElement;
        return pointerLockElement === gameCanvasDiv;
    }
    const openPointerlock = function (type) {
        if (type) setPointerLockType(type);
        try {
            if (!isPointerlock()) {
                gameCanvasDiv.requestPointerLock = gameCanvasDiv.requestPointerLock ||
                    gameCanvasDiv.mozRequestPointerLock;

                gameCanvasDiv.requestPointerLock();
            }
        } catch{ }
    }
    const closePointerlock = function () {
        try {
            document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
            document.exitPointerLock();
        } catch{ }
    }
    const setPointerlock = function (cond, type) {
        if (cond === false) closePointerlock();
        else openPointerlock(type);
    }
    const togglePointerlock = function () {
        if (isPointerlock()) {
            closePointerlock();
        } else {
            openPointerlock();
        }
    }

    const fullscreenHandler = function () {
        if (!isFullscreen()) {
            gamePanel.scrollIntoView();
        }
    }

    const isFullscreen = function () {
        const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        return fullscreenElement === gameCanvasDiv
    }


    const openFullscreen = async function () {
        try {
            if (!isFullscreen()) {
                gameCanvasDiv.requestFullscreen = gameCanvasDiv.requestFullscreen || gameCanvasDiv.mozRequestFullScreen || gameCanvasDiv.webkitRequestFullscreen || gameCanvasDiv.msRequestFullscreen;
                await gameCanvasDiv.requestFullscreen();
            }
        } catch{ }
    }

    const closeFullscreen = async function () {
        try {
            document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
            await document.exitFullscreen();
        } catch{ }
    }

    const toggleFullscreen = function (cond) {
        if (cond === true) openFullscreen();
        else if (cond === false) closeFullscreen();
        else {
            if (isFullscreen()) {
                closeFullscreen();
            } else {
                openFullscreen();
            }
        }
    }



    const gameArea = document.getElementById(gameAreaId);
    const gamePanel = document.createElement("div");
    gamePanel.className = "gamePanel";
    gameArea.appendChild(gamePanel);

    const gamePanelHTML = `
        <div class="gameName">${gameName}</div>
        <div class="gameCanvasDiv" id="gameCanvasDiv" tabindex="0" style="width:${defaultCW}px;height:${defaultCH}px;position:relative;text-align:left;">
            <canvas id="gameCanvas" width="${defaultCW}" height="${defaultCH}" style="position:absolute;"></canvas>
        </div>
        <div class="gamePanelButtonsDiv">
            <button class="gamePanelButton btn btn-primary" id="fsBtn">Full Screen</button>
            <button class="gamePanelButton btn btn-primary" id="shBtn">Share</button>
        </div>
    `;
    gamePanel.innerHTML = gamePanelHTML;

    const gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.removeAttribute('id');

    document.getElementById('fsBtn').onclick = openFullscreen;
    document.getElementById('fsBtn').removeAttribute('id');

    document.getElementById('shBtn').onclick = () => { alert("Share link of game: " + window.location.href); };
    document.getElementById('shBtn').removeAttribute('id');

    const gameCanvasDiv = document.getElementById('gameCanvasDiv');
    gameCanvasDiv.removeAttribute('id');
    gameCanvasDiv.style.overflow = "hidden";
    gameCanvasDiv.focus();
    gameCanvasDiv.style.outline = "none";

    if (PANELHIDDEN) {
        gamePanel.style.visibility = "hidden";
        gameCanvasDiv.style.border = 'none';
        gameCanvasDiv.style.position = 'fixed';
        gameCanvasDiv.style.visibility = 'visible';
    }

    const stage = gameCanvas.getContext('2d');
    stage.imageSmoothingEnabled = false;


    WIDTH = getWidth();
    HEIGHT = getHeight();
    getPadded();

    const gameobjects = {};
    const getSerializedProperties = function (obj, retrieve) {
        return Object.fromEntries(Object.entries(obj).filter(val => retrieve.split(" ").includes(val[0])));
    }
    const objectInheritance = function (options, elem, type) {
        const defBtnOR = type === "textfield" ? defaultTfaBR : defaultBtnBR;
        const defAlignH = type === "button" ? "center" : "left";
        const tempObject = {};
        tempObject.SELECTION = options ? options.selection !== undefined ? options.selection : SELECTION : SELECTION;
        tempObject.defaultOX = options ? options.x ? options.x || 0 : 0 : 0;
        tempObject.defaultOY = options ? options.y ? options.y || 0 : 0 : 0;
        tempObject.defaultOAH = options ? options.alignH ? options.alignH : "left" : "left";
        tempObject.defaultOAV = options ? options.alignV ? options.alignV : "top" : "top";
        tempObject.defaultOAT = options ? options.alignT ? options.alignT : defAlignH : defAlignH;
        tempObject.defaultOPH = options ? options.positionH ? options.positionH : "absolute" : "absolute";
        tempObject.defaultOPV = options ? options.positionV ? options.positionV : "absolute" : "absolute";
        tempObject.defaultOB = options ? options.border ? options.border || defaultTfaB : defaultTfaB : defaultTfaB;
        tempObject.defaultOBR = {
            all: defBtnOR,
            topRight: defBtnOR,
            bottomRight: defBtnOR,
            bottomLeft: defBtnOR,
            topLeft: defBtnOR
        };
        if (options && options.curve) {
            if (typeof options.curve === "number") {
                tempObject.defaultOBR.all = options.curve || defBtnOR;
                tempObject.defaultOBR.topRight = options.curve || defBtnOR;
                tempObject.defaultOBR.bottomRight = options.curve || defBtnOR;
                tempObject.defaultOBR.bottomLeft = options.curve || defBtnOR;
                tempObject.defaultOBR.topLeft = options.curve || defBtnOR;
            } else {
                const defBtnORA = options.curve.all !== undefined ? options.curve.all : defBtnOR;
                tempObject.defaultOBR.all = defBtnORA;
                tempObject.defaultOBR.topRight = options.curve.topRight !== undefined ? options.curve.topRight : defBtnORA;
                tempObject.defaultOBR.bottomRight = options.curve.bottomRight !== undefined ? options.curve.bottomRight : defBtnORA;
                tempObject.defaultOBR.bottomLeft = options.curve.bottomLeft !== undefined ? options.curve.bottomLeft : defBtnORA;
                tempObject.defaultOBR.topLeft = options.curve.topLeft !== undefined ? options.curve.topLeft : defBtnORA;
            }
        }

        tempObject.STRETCHSIZE = options ? options.stretch !== undefined ? options.stretch : LOCKSIZE : LOCKSIZE;

        tempObject.LEFT = tempObject.defaultOX;
        tempObject.TOP = tempObject.defaultOY;
        tempObject.ALIGNH = tempObject.defaultOAH;
        tempObject.ALIGNV = tempObject.defaultOAV;
        tempObject.ALIGNT = tempObject.defaultOAT;
        tempObject.BORDER = tempObject.defaultOB;
        tempObject.CURVE_TR = tempObject.defaultOBR.topRight;
        tempObject.CURVE_BR = tempObject.defaultOBR.bottomRight;
        tempObject.CURVE_BL = tempObject.defaultOBR.bottomLeft;
        tempObject.CURVE_TL = tempObject.defaultOBR.topLeft;
        tempObject.POSITIONH = tempObject.defaultOPH;
        tempObject.POSITIONV = tempObject.defaultOPV;

        tempObject.object = document.createElement(elem);
        tempObject.object.style.left = tempObject.LEFT + "px";
        tempObject.object.style.top = tempObject.TOP + "px";
        tempObject.object.style.border = tempObject.BORDER;
        tempObject.object.style.borderTopRightRadius = tempObject.CURVE_TR + "px";
        tempObject.object.style.borderBottomRightRadius = tempObject.CURVE_BR + "px";
        tempObject.object.style.borderBottomLeftRadius = tempObject.CURVE_BL + "px";
        tempObject.object.style.borderTopLeftRadius = tempObject.CURVE_TL + "px";

        tempObject.object.style.textAlign = tempObject.ALIGNT;
        tempObject.object.style.position = "absolute";
        tempObject.object.style.margin = 0;
        tempObject.object.style.padding = defaultObjectPadding + "px";


        tempObject.object.remove = undefined;
        tempObject.object.delete = function () {
            let parent = this.parentNode;
            if (parent) {
                this.parentNode.removeChild(this);
                delete tempObject;
            } else {
                console.error(`Cannot remove "${name}": Object does not exist.`);
            }
        }

        tempObject.object.setX = function (x) {
            tempObject.LEFT = x !== undefined ? x : tempObject.LEFT;
            this.style.left = tempObject.LEFT + "px";
            resizeCanvas();
        }
        tempObject.object.getX = function () {
            return tempObject.LEFT;
        }

        tempObject.object.setY = function (y) {
            tempObject.TOP = y !== undefined ? y : tempObject.TOP;
            this.style.top = tempObject.TOP + "px";
            resizeCanvas();
        }
        tempObject.object.getY = function () {
            return tempObject.TOP;
        }

        tempObject.object.setWidth = function (width) {
            tempObject.WIDTH = width !== undefined ? width : tempObject.WIDTH;
            this.width = tempObject.WIDTH;
            resizeCanvas();
        }
        tempObject.object.getWidth = function () {
            return tempObject.WIDTH;
        }

        tempObject.object.setHeight = function (height) {
            tempObject.HEIGHT = height !== undefined ? height : tempObject.HEIGHT;
            this.height = tempObject.HEIGHT;
            resizeCanvas();
        }
        tempObject.object.getHeight = function () {
            return tempObject.HEIGHT;
        }

        tempObject.object.setAlignH = function (align) {
            tempObject.ALIGNH = align !== undefined ? align : tempObject.ALIGNH;
            resizeCanvas();
        }
        tempObject.object.getAlignH = function () {
            return tempObject.ALIGNH;
        }

        tempObject.object.setAlignV = function (align) {
            tempObject.ALIGNV = align !== undefined ? align : tempObject.ALIGNV;
            resizeCanvas();
        }
        tempObject.object.getAlignV = function () {
            return tempObject.ALIGNV;
        }

        tempObject.object.setAlignT = function (align) {
            tempObject.ALIGNT = align !== undefined ? align : tempObject.ALIGNT;
            this.style.textAlign = tempObject.ALIGNT;
            resizeCanvas();
        }
        tempObject.object.getAlignT = function () {
            return tempObject.ALIGNT;
        }

        tempObject.object.setAlign = function (options) {
            if (options.h) this.setAlignH(options.h);
            if (options.v) this.setAlignV(options.v);
            if (options.t) this.setAlignT(options.t);
        }
        tempObject.object.getAlign = function () {
            return {
                h: this.getAlignH(),
                v: this.getAlignV(),
                t: this.getAlignT()
            }
        }

        tempObject.object.setPositionH = function (position) {
            tempObject.POSITIONH = position !== undefined ? position : tempObject.POSITIONH;
            resizeCanvas();
        }
        tempObject.object.getPositionH = function () {
            return tempObject.POSITIONH;
        }

        tempObject.object.setPositionV = function (position) {
            tempObject.POSITIONV = position !== undefined ? position : tempObject.POSITIONV;
            resizeCanvas();
        }
        tempObject.object.getPositionV = function () {
            return tempObject.POSITIONV;
        }

        tempObject.object.setPosition = function (options) {
            if (options.h) this.setPositionH(options.h);
            if (options.v) this.setPositionV(options.v);
        }
        tempObject.object.getPosition = function () {
            return {
                h: this.getPositionH(),
                v: this.getPositionV()
            }
        }

        tempObject.object.setBorder = function (border) {
            tempObject.BORDER = border !== undefined ? border : tempObject.BORDER;
            this.style.border = tempObject.BORDER;
        }
        tempObject.object.getBorder = function () {
            return tempObject.BORDER;
        }

        tempObject.object.setVisible = function (visible) {
            if (visible === true) {
                this.style.display = "block";
            } else {
                this.style.display = "none";
            }
        }
        tempObject.object.getVisible = function () {
            if (this.style.display === "none") {
                return false;
            }
            return true;
        }

        tempObject.object.setCurve = function (curve) {

            if (typeof curve === "number") {
                tempObject.CURVE_TR = curve >= 0 ? curve : tempObject.CURVE_TR;
                tempObject.CURVE_BR = curve >= 0 ? curve : tempObject.CURVE_BR;
                tempObject.CURVE_BL = curve >= 0 ? curve : tempObject.CURVE_BL;
                tempObject.CURVE_TL = curve >= 0 ? curve : tempObject.CURVE_TL;
            } else {
                const defBtnORA = curve.all !== undefined ? curve.all : undefined;
                tempObject.CURVE_TR = curve.topRight !== undefined ? curve.topRight : defBtnORA !== undefined ? defBtnORA : tempObject.CURVE_TR;
                tempObject.CURVE_BR = curve.bottomRight !== undefined ? curve.bottomRight : defBtnORA !== undefined ? defBtnORA : tempObject.CURVE_BR;
                tempObject.CURVE_BL = curve.bottomLeft !== undefined ? curve.bottomLeft : defBtnORA !== undefined ? defBtnORA : tempObject.CURVE_BL;
                tempObject.CURVE_TL = curve.topLeft !== undefined ? curve.topLeft : defBtnORA !== undefined ? defBtnORA : tempObject.CURVE_TL;
            }
            this.style.borderTopRightRadius = tempObject.CURVE_TR + "px";
            this.style.borderBottomRightRadius = tempObject.CURVE_BR + "px";
            this.style.borderBottomLeftRadius = tempObject.CURVE_BL + "px";
            this.style.borderTopLeftRadius = tempObject.CURVE_TL + "px";
        }
        tempObject.object.getCurve = function () {
            if ([tempObject.CURVE_TR, tempObject.CURVE_BR, tempObject.CURVE_BL, tempObject.CURVE_TL].every((val, i, arr) => val === arr[0]))
                return tempObject.CURVE_TR;
            else return { topRight: tempObject.CURVE_TR, bottomRight: tempObject.CURVE_BR, bottomLeft: tempObject.CURVE_BL, topLeft: tempObject.CURVE_TL }
        }

        tempObject.object.toggleVisible = function () {
            if (this.style.display === "none") {
                this.style.display = "block";
            } else {
                this.style.display = "none";
            }
        }
        tempObject.object.hide = function () {
            this.style.display = "none";
        }
        tempObject.object.show = function () {
            this.style.display = "block";
        }

        return tempObject
    }

    let objectAutoAdder = 0;
    const getObjectName = function () {
        const serializedID = String(Math.random()).substr(2);
        return `__obj_${objectAutoAdder++}_${serializedID}`;
    }
    const createObject = function (/*name, */type, ...rest) {
        // if (!name) return console.error(`Cannot create object with no name.`);
        // if (gameobjects[name]) return console.error(`Cannot create "${name}": Object already exists.`);

        const options = Object.assign({}, ...rest);
        const name = getObjectName();
        if (type === "button") {
            return createButton(name, options);
        } else if (type === "viewport") {
            return createViewport(name, options);
        } else if (type === "textfield") {
            return createTextfield(name, options);
        } else if (type === "image") {
            return createImage(name, options);
        } else if (type !== undefined) {
            return console.error(`Cannot create object: Type unknown (${type}).`);
        } else {
            return console.error(`Cannot create object: Type unspecified.`);
        }
    }
    const createObjectV = function (name, type, ...rest) {//verification
        if (!name) return console.error(`Cannot create object with no name.`);
        if (name.substr(0, 6) === "__obj_") return console.error(`Reserved keyword prohobited: "__obj_".`);
        if (gameobjects[name]) return console.error(`Cannot create "${name}": Object already exists.`);
        const options = Object.assign({}, ...rest);
        type(name, options);
    }
    const createViewPortV = function (name, type, ...rest) {//verification
        if (!name) return console.error(`Cannot create viewport with no name.`);
        if (viewports[name]) return console.error(`Cannot create "${name}": Viewport already exists.`);
        if (name.substr(0, 6) === "__obj_") return console.error(`Reserved keyword prohobited: "__obj_".`);
        const options = Object.assign({}, ...rest);
        type(name, options);
    }
    const createImage = function (name, ...rest) {
        if (!name) return console.error(`Cannot create textfield with no name.`);
        if (gameobjects[name]) return console.error(`Cannot create "${name}": Object already exists.`);

        const options = Object.assign({}, ...rest);


        gameobjects[name] = objectInheritance(options, "img");

        gameobjects[name].defaultOW = options ? options.width ? options.width || defaultImgW : defaultImgW : defaultImgW;
        gameobjects[name].defaultOH = options ? options.height ? options.height || defaultImgH : defaultImgH : defaultImgH;
        gameobjects[name].defaultOSrc = options ? options.src ? options.src || "" : "" : "";


        gameobjects[name].WIDTH = gameobjects[name].defaultOW;
        gameobjects[name].HEIGHT = gameobjects[name].defaultOH;
        gameobjects[name].SOURCE = gameobjects[name].defaultOSrc;

        gameobjects[name].object.width = gameobjects[name].WIDTH;
        gameobjects[name].object.height = gameobjects[name].HEIGHT;
        gameobjects[name].object.src = gameobjects[name].SOURCE;


        gameobjects[name].object.setSrc = function (src) {
            gameobjects[name].SOURCE = src !== undefined ? src : gameobjects[name].SOURCE;
            this.src = gameobjects[name].SOURCE;
        }
        gameobjects[name].object.getSrc = function () {
            return gameobjects[name].SOURCE;
        }

        gameobjects[name].object.setProperties = function (options) {
            if (!options) return console.warn(`No properties declared: ${name}.setProperties().`);
            if (options.x) this.setX(options.x);
            if (options.y) this.setY(options.y);
            if (options.width) this.setWidth(options.width);
            if (options.height) this.setHeight(options.height);
            if (options.alignH) this.setAlignH(options.alignH);
            if (options.alignV) this.setAlignV(options.alignV);
            if (options.alignT) this.setAlignT(options.alignT);
            if (options.align) this.setAlign(options.align);
            if (options.positionH) this.setPositionH(options.positionH);
            if (options.positionV) this.setPositionV(options.positionV);
            if (options.position) this.setPosition(options.position);

            if (options.visible) this.setVisible(options.visible);
            if (options.border) this.setBorder(options.border);
            if (options.curve) this.setCurve(options.curve);
            if (options.src) this.setSrc(options.src);
            // if (options.id) this.setId(options.id);
        }
        gameobjects[name].object.getProperties = function (returns) {
            const propsList = {
                x: this.getX(),
                y: this.getY(),
                width: this.getWidth(),
                height: this.getHeight(),
                src: this.getSrc(),
                curve: this.getCurve(),
                visible: this.getVisible(),
                border: this.getBorder(),
                align: this.getAlign(),
                position: this.getPosition()
            }
            if (typeof returns !== "string") return propsList;
            return getSerializedProperties(propsList, returns);
        }
        gameobjects[name].object.restore = function () {
            this.setX(gameobjects[name].defaultCX);
            this.setY(gameobjects[name].defaultCY);
            this.setWidth(gameobjects[name].defaultCW);
            this.setHeight(gameobjects[name].defaultCH);
            this.setSrc(gameobjects[name].defaultOSrc);
            this.setBorder(gameobjects[name].defaultOB);
            this.setCurve(gameobjects[name].defaultOBR);
            this.setAlign({ h: defaultOAH, v: defaultOAV, t: defaultOAT });
            this.setPosition({ h: defaultOPH, v: defaultOPV });
            this.show();
            resizeCanvas();
        }


        gameCanvasDiv.appendChild(gameobjects[name].object);
        resizeCanvas();
        return gameobjects[name].object;
    }
    const createTextfield = function (name, ...rest) {
        if (!name) return console.error(`Cannot create textfield with no name.`);
        if (gameobjects[name]) return console.error(`Cannot create "${name}": Object already exists.`);

        const options = Object.assign({}, ...rest);
        const type = options ? options.multiline === false ? "input" : "textarea" : "textarea";
        const tfW = type === "input" ? defaultTfsW : defaultTfmW;
        const tfH = type === "input" ? defaultTfsH : defaultTfmH;
        const tfS = type === "input" ? defaultTfsS : defaultTfmS;

        gameobjects[name] = objectInheritance(options, type, "textfield");

        gameobjects[name].defaultOW = options ? options.width ? options.width || tfW : tfW : tfW;
        gameobjects[name].defaultOH = options ? options.height ? options.height || tfH : tfH : tfH;
        gameobjects[name].defaultOS = options ? options.size ? options.size || tfS : tfS : tfS;
        gameobjects[name].defaultOT = options ? options.text ? options.text : "" : "";
        gameobjects[name].defaultOP = options ? options.placeholder ? options.placeholder : "" : "";
        gameobjects[name].defaultOTC = options ? options.color ? options.color.text || defaultTfaTC : defaultTfaTC : defaultTfaTC;
        gameobjects[name].defaultOBC = options ? options.color ? options.color.background || defaultTfaBC : defaultTfaBC : defaultTfaBC;


        gameobjects[name].WIDTH = gameobjects[name].defaultOW;
        gameobjects[name].HEIGHT = gameobjects[name].defaultOH;
        gameobjects[name].TEXT = gameobjects[name].defaultOT;
        gameobjects[name].PLACEHOLDER = gameobjects[name].defaultOP;
        gameobjects[name].SIZE = gameobjects[name].defaultOS;
        gameobjects[name].COLOR = gameobjects[name].defaultOTC;
        gameobjects[name].BACKGROUND = gameobjects[name].defaultOBC;


        // gameobjects[name].object = document.createElement('button');
        gameobjects[name].object.value = gameobjects[name].TEXT;

        gameobjects[name].object.placeholder = gameobjects[name].PLACEHOLDER;
        gameobjects[name].object.style.outline = "none";
        gameobjects[name].object.style.width = gameobjects[name].WIDTH + "px";
        gameobjects[name].object.style.height = gameobjects[name].HEIGHT + "px";
        // gameobjects[name].object.style.overflow = "hidden";
        gameobjects[name].object.style.resize = "none";
        gameobjects[name].object.style.color = gameobjects[name].COLOR;
        gameobjects[name].object.style.background = gameobjects[name].BACKGROUND;
        gameobjects[name].object.style.fontSize = gameobjects[name].SIZE + "px";
        gameobjects[name].object.style.fontFamily = defaultFont;
        gameobjects[name].object.style.padding = defaultTfaPadding + "px";
        if (options && options.selectable === false) {
            gameobjects[name].object.disabled = true;
        }

        gameobjects[name].object.clearText = function () {
            gameobjects[name].TEXT = "";
            this.value = gameobjects[name].TEXT;
        }
        gameobjects[name].object.addText = function () {
            const text = [...arguments].join(" ");
            gameobjects[name].TEXT += text !== undefined ? text : "";
            this.value = gameobjects[name].TEXT;
        }
        gameobjects[name].object.addTextLn = function () {
            const text = [...arguments].join("\n");
            gameobjects[name].TEXT += text !== undefined ? text + "\n" : "";
            this.value = gameobjects[name].TEXT;
        }
        gameobjects[name].object.removeTextLn = function (lines) {
            const text = gameobjects[name].TEXT.split('\n').slice(0, -(Math.abs(lines) || 1)).join("\n");
            gameobjects[name].TEXT = text !== undefined ? text : "";
            this.value = gameobjects[name].TEXT;
        }

        gameobjects[name].object.setActive = function (condition) {
            if (condition === false)
                gameCanvasDiv.focus();
            else
                this.focus();
        }
        gameobjects[name].object.getActive = function () {
            return this === document.activeElement;
        }

        gameobjects[name].object.setText = function (text) {
            gameobjects[name].TEXT = text !== undefined ? text : gameobjects[name].TEXT;
            this.value = gameobjects[name].TEXT;
        }
        gameobjects[name].object.getText = function () {
            return this.value || "";
        }

        gameobjects[name].object.setPlaceholder = function (placeholder) {
            gameobjects[name].PLACEHOLDER = placeholder !== undefined ? placeholder : gameobjects[name].PLACEHOLDER;
            this.placeholder = gameobjects[name].PLACEHOLDER;
        }
        gameobjects[name].object.getPlaceholder = function () {
            return gameobjects[name].PLACEHOLDER;
        }

        gameobjects[name].object.setSize = function (size) {
            gameobjects[name].SIZE = size !== undefined ? size : gameobjects[name].SIZE;
            this.style.fontSize = gameobjects[name].SIZE + "px";
        }
        gameobjects[name].object.getSize = function () {
            return gameobjects[name].SIZE;
        }

        gameobjects[name].object.setTextColor = function (color) {
            gameobjects[name].COLOR = color !== undefined ? color : gameobjects[name].COLOR;
            this.style.color = gameobjects[name].COLOR;
        }
        gameobjects[name].object.getTextColor = function () {
            return gameobjects[name].COLOR;
        }

        gameobjects[name].object.setBackgroundColor = function (color) {
            gameobjects[name].BACKGROUND = color !== undefined ? color : gameobjects[name].BACKGROUND;
            this.style.background = gameobjects[name].BACKGROUND;
        }
        gameobjects[name].object.getBackgroundColor = function () {
            return gameobjects[name].BACKGROUND;
        }

        gameobjects[name].object.setStyle = function (options) {
            if (options.text) this.setTextColor(options.text);
            if (options.background) this.setBackgroundColor(options.background);
        }
        gameobjects[name].object.getStyle = function () {
            return {
                text: this.getTextColor(),
                background: this.getBackgroundColor()
            }
        }

        gameobjects[name].object.setProperties = function (options) {
            if (!options) return console.warn(`No properties declared: ${name}.setProperties().`);
            if (options.x) this.setX(options.x);
            if (options.y) this.setY(options.y);
            if (options.width) this.setWidth(options.width);
            if (options.height) this.setHeight(options.height);
            if (options.alignH) this.setAlignH(options.alignH);
            if (options.alignV) this.setAlignV(options.alignV);
            if (options.alignT) this.setAlignT(options.alignT);
            if (options.align) this.setAlign(options.align);
            if (options.positionH) this.setPositionH(options.positionH);
            if (options.positionV) this.setPositionV(options.positionV);
            if (options.position) this.setPosition(options.position);
            if (options.visible) this.setVisible(options.visible);
            if (options.text) this.setText(options.text);
            if (options.border) this.setBorder(options.border);
            if (options.curve) this.setCurve(options.curve);
            if (options.active) this.setActive(options.active);

            if (options.placeholder) this.setPlaceholder(options.placeholder);
            if (options.style) this.setStyle(options.style);
            if (options.color) this.setTextColor(options.curve);
            if (options.background) this.setBackgroundColor(options.background);
            if (options.size) this.setSize(options.size);

            // if (options.id) this.setId(options.id);
        }
        gameobjects[name].object.getProperties = function (returns) {
            const propsList = {
                x: this.getX(),
                y: this.getY(),
                width: this.getWidth(),
                height: this.getHeight(),
                text: this.getText(),
                size: this.getSize(),
                style: this.getStyle(),
                curve: this.getCurve(),
                visible: this.getVisible(),
                border: this.getBorder(),
                align: this.getAlign(),
                position: this.getPosition(),
                active: this.getActive(),
                placeholder: this.getPlaceholder(),
                style: this.getStyle(),
                color: this.getTextColor(),
                background: this.getBackgroundColor()
            }
            if (typeof returns !== "string") return propsList;
            return getSerializedProperties(propsList, returns);
        }
        gameobjects[name].object.restore = function () {
            this.setX(gameobjects[name].defaultCX);
            this.setY(gameobjects[name].defaultCY);
            this.setWidth(gameobjects[name].defaultCW);
            this.setHeight(gameobjects[name].defaultCH);
            this.setText(gameobjects[name].defaultOT);
            this.setBorder(gameobjects[name].defaultOB);
            this.setCurve(gameobjects[name].defaultOBR);
            this.setAlign({ h: defaultOAH, v: defaultOAV, t: defaultOAT });
            this.setPosition({ h: defaultOPH, v: defaultOPV });
            this.setStyle({ text: defaultOTC, background: defaultOBC });
            this.setSize(gameobjects[name].defaultOS);
            this.setPlaceholder(gameobjects[name].defaultOP);

            this.show();
            resizeCanvas();
        }

        gameCanvasDiv.appendChild(gameobjects[name].object);
        resizeCanvas();
        return gameobjects[name].object;

    }
    const createButton = function (name, ...rest) {
        if (!name) return console.error(`Cannot create button with no name.`);
        if (gameobjects[name]) return console.error(`Cannot create "${name}": Object already exists.`);

        const options = Object.assign({}, ...rest);

        gameobjects[name] = objectInheritance(options, 'button', "button");

        //dealing with options

        //constants
        gameobjects[name].defaultOW = options ? options.width ? options.width || defaultBtnW : defaultBtnW : defaultBtnW;
        gameobjects[name].defaultOH = options ? options.height ? options.height || defaultBtnH : defaultBtnH : defaultBtnH;
        gameobjects[name].defaultOS = options ? options.size ? options.size || defaultBtnS : defaultBtnS : defaultBtnS;
        gameobjects[name].defaultOL = options ? options.label ? options.label : defaultBtnL : defaultBtnL;
        gameobjects[name].defaultOOC = options ? options.click ? options.click : emptyFunc : emptyFunc;
        gameobjects[name].defaultOB = options ? options.border ? options.border || defaultBtnB : defaultBtnB : defaultBtnB;
        gameobjects[name].defaultOTC = options ? options.color ? options.color.text || defaultBtnTC : defaultBtnTC : defaultBtnTC;
        gameobjects[name].defaultOBC = options ? options.color ? options.color.background || defaultBtnBC : defaultBtnBC : defaultBtnBC;
        gameobjects[name].defaultOTCH = options ? options.colorHover ? options.colorHover.text || defaultBtnTCH : defaultBtnTCH : defaultBtnTCH;
        gameobjects[name].defaultOBCH = options ? options.colorHover ? options.colorHover.background || defaultBtnBCH : defaultBtnBCH : defaultBtnBCH;
        gameobjects[name].defaultOTCA = options ? options.colorActive ? options.colorActive.text || defaultBtnTCA : defaultBtnTCA : defaultBtnTCA;
        gameobjects[name].defaultOBCA = options ? options.colorActive ? options.colorActive.background || defaultBtnBCA : defaultBtnBCA : defaultBtnBCA;

        // viewports[name].object.id = options.name ? options.name : name;

        //vars
        gameobjects[name].WIDTH = gameobjects[name].defaultOW;
        gameobjects[name].HEIGHT = gameobjects[name].defaultOH;
        gameobjects[name].LABEL = gameobjects[name].defaultOL;
        gameobjects[name].SIZE = gameobjects[name].defaultOS;
        gameobjects[name].BORDER = gameobjects[name].defaultOB;
        gameobjects[name].COLOR = gameobjects[name].defaultOTC;
        gameobjects[name].BACKGROUND = gameobjects[name].defaultOBC;
        gameobjects[name].COLOR_HOVER = gameobjects[name].defaultOTCH;
        gameobjects[name].BACKGROUND_HOVER = gameobjects[name].defaultOBCH;
        gameobjects[name].COLOR_ACTIVE = gameobjects[name].defaultOTCA;
        gameobjects[name].BACKGROUND_ACTIVE = gameobjects[name].defaultOBCA;

        // gameobjects[name].object = document.createElement('button');
        gameobjects[name].object.innerText = gameobjects[name].LABEL;
        gameobjects[name].object.onclick = gameobjects[name].defaultOOC;
        gameobjects[name].object.style.outline = "none";
        gameobjects[name].object.style.width = gameobjects[name].WIDTH + "px";
        gameobjects[name].object.style.height = gameobjects[name].HEIGHT + "px";
        gameobjects[name].object.style.overflow = "hidden";
        gameobjects[name].object.style.border = gameobjects[name].BORDER;
        gameobjects[name].object.style.color = gameobjects[name].COLOR;
        gameobjects[name].object.style.background = gameobjects[name].BACKGROUND;
        // gameobjects[name].object.style.transitionDuration = "0.1s";
        gameobjects[name].object.style.fontSize = gameobjects[name].SIZE + "px";
        gameobjects[name].object.style.fontFamily = defaultFont;
        // gameobjects[name].object.style.lineHeight = 20 + "px";
        // gameobjects[name].object.style.pointerEvents = "none";
        // gameobjects[name].object.style.position = "absolute";
        // gameobjects[name].object.classList.add('game-button');
        if (!gameobjects[name].SELECTION)
            gameobjects[name].object.classList.add('gameObjectSelection');


        gameobjects[name].object.setLabel = function (label) {
            gameobjects[name].LABEL = label !== undefined ? label : gameobjects[name].LABEL;
            this.innerText = gameobjects[name].LABEL;
        }
        gameobjects[name].object.getLabel = function () {
            return this.innerText || "";
        }

        gameobjects[name].object.setSize = function (size) {
            gameobjects[name].SIZE = size !== undefined ? size : gameobjects[name].SIZE;
            this.style.fontSize = gameobjects[name].SIZE + "px";
        }
        gameobjects[name].object.getSize = function () {
            return gameobjects[name].SIZE;
        }

        gameobjects[name].object.setTextColor = function (color) {
            gameobjects[name].COLOR = color !== undefined ? color : gameobjects[name].COLOR;
            this.style.color = gameobjects[name].COLOR;
        }
        gameobjects[name].object.getTextColor = function () {
            return gameobjects[name].COLOR;
        }

        gameobjects[name].object.setTextColorHover = function (color) {
            gameobjects[name].COLOR_HOVER = color !== undefined ? color : gameobjects[name].COLOR_HOVER;
        }
        gameobjects[name].object.getTextColorHover = function () {
            return gameobjects[name].COLOR_HOVER;
        }

        gameobjects[name].object.setTextColorActive = function (color) {
            gameobjects[name].COLOR_ACTIVE = color !== undefined ? color : gameobjects[name].COLOR_ACTIVE;
        }
        gameobjects[name].object.getTextColorActive = function () {
            return gameobjects[name].COLOR_ACTIVE;
        }

        gameobjects[name].object.setBackgroundColor = function (color) {
            gameobjects[name].BACKGROUND = color !== undefined ? color : gameobjects[name].BACKGROUND;
            this.style.background = gameobjects[name].BACKGROUND;
        }
        gameobjects[name].object.getBackgroundColor = function () {
            return gameobjects[name].BACKGROUND;
        }

        gameobjects[name].object.setBackgroundColorHover = function (color) {
            gameobjects[name].BACKGROUND_HOVER = color !== undefined ? color : gameobjects[name].BACKGROUND_HOVER;
        }
        gameobjects[name].object.getBackgroundColorHover = function () {
            return gameobjects[name].BACKGROUND_HOVER;
        }

        gameobjects[name].object.setBackgroundColorActive = function (color) {
            gameobjects[name].BACKGROUND_ACTIVE = color !== undefined ? color : gameobjects[name].BACKGROUND_ACTIVE;
        }
        gameobjects[name].object.getBackgroundColorActive = function () {
            return gameobjects[name].BACKGROUND_ACTIVE;
        }

        gameobjects[name].object.setTextStyle = function (options) {
            if (options.color) this.setTextColor(options.color);
            if (options.hover) this.setTextColorHover(options.hover);
            if (options.active) this.setTextColorActive(options.active);
        }
        gameobjects[name].object.getTextStyle = function () {
            return {
                color: this.getTextColor(),
                hover: this.getTextColorHover(),
                active: this.getTextColorActive()
            }
        }

        gameobjects[name].object.setBackgroundStyle = function (options) {
            if (options.color) this.setBackgroundColor(options.color);
            if (options.hover) this.setBackgroundColorHover(options.hover);
            if (options.active) this.setBackgroundColorActive(options.active);
        }
        gameobjects[name].object.getBackgroundStyle = function () {
            return {
                color: this.getBackgroundColor(),
                hover: this.getBackgroundColorHover(),
                active: this.getBackgroundColorActive()
            }
        }

        gameobjects[name].object.setStyle = function (options) {
            if (options.text) this.setTextStyle(options.text);
            if (options.background) this.setBackgroundStyle(options.background);
        }
        gameobjects[name].object.getStyle = function () {
            return {
                text: this.getTextStyle(),
                background: this.getBackgroundStyle()
            }
        }

        gameobjects[name].object.setProperties = function (options) {
            if (!options) return console.warn(`No properties declared: ${name}.setProperties().`);
            if (options.x) this.setX(options.x);
            if (options.y) this.setY(options.y);
            if (options.width) this.setWidth(options.width);
            if (options.height) this.setHeight(options.height);
            if (options.alignH) this.setAlignH(options.alignH);
            if (options.alignV) this.setAlignV(options.alignV);
            if (options.alignT) this.setAlignT(options.alignT);
            if (options.align) this.setAlign(options.align);
            if (options.positionH) this.setPositionH(options.positionH);
            if (options.positionV) this.setPositionV(options.positionV);
            if (options.position) this.setPosition(options.position);
            if (options.visible) this.setVisible(options.visible);
            if (options.label) this.setLabel(options.label);
            if (options.border) this.setBorder(options.border);
            if (options.curve) this.setCurve(options.curve);

            if (options.style) this.setStyle(options.style);
            if (options.color) this.setTextColor(options.curve);
            if (options.background) this.setBackgroundColor(options.background);
            if (options.size) this.setSize(options.size);
            // if (options.id) this.setId(options.id);
        }
        gameobjects[name].object.getProperties = function (returns) {
            const propsList = {
                x: this.getX(),
                y: this.getY(),
                width: this.getWidth(),
                height: this.getHeight(),
                label: this.getLabel(),
                curve: this.getCurve(),
                size: this.getSize(),
                visible: this.getVisible(),
                border: this.getBorder(),
                align: this.getAlign(),
                position: this.getPosition(),
                style: this.getStyle(),
                color: this.getTextColor(),
                background: this.getBackgroundColor()
            }
            if (typeof returns !== "string") return propsList;
            return getSerializedProperties(propsList, returns);
        }

        gameobjects[name].object.restore = function () {
            this.setX(gameobjects[name].defaultCX);
            this.setY(gameobjects[name].defaultCY);
            this.setWidth(gameobjects[name].defaultCW);
            this.setHeight(gameobjects[name].defaultCH);
            this.setLabel(gameobjects[name].defaultOL);
            this.setBorder(gameobjects[name].defaultOB);
            this.setCurve(gameobjects[name].defaultOBR);
            this.setAlign({ h: defaultOAH, v: defaultOAV, t: defaultOAT });
            this.setPosition({ h: defaultOPH, v: defaultOPV });
            this.setStyle({ text: { color: defaultOTC, hover: defaultOTCH, active: defaultOTCA }, background: { color: defaultOBC, hover: defaultOBCH, active: defaultOBCA } });
            this.setSize(gameobjects[name].defaultOS);
            this.show();
            resizeCanvas();
        }

        gameCanvasDiv.appendChild(gameobjects[name].object);
        resizeCanvas();
        gameobjects[name].object.addEventListener("keydown", setKeyUp, false);
        gameobjects[name].object.addEventListener("mouseleave", function () {
            this.style.background = gameobjects[name].BACKGROUND;
            this.style.color = gameobjects[name].COLOR;
        }, false);
        gameobjects[name].object.addEventListener("mouseenter", function () {
            this.style.background = gameobjects[name].BACKGROUND_HOVER;
            this.style.color = gameobjects[name].COLOR_HOVER;
        }, false);
        gameobjects[name].object.addEventListener("mousedown", function () {
            this.style.background = gameobjects[name].BACKGROUND_ACTIVE;
            this.style.color = gameobjects[name].COLOR_ACTIVE;
        }, false);
        gameobjects[name].object.addEventListener("mouseup", function () {
            this.style.background = gameobjects[name].BACKGROUND_HOVER;
            this.style.color = gameobjects[name].COLOR_HOVER;
        }, false);
        return gameobjects[name].object;
    }

    const viewports = {};
    const createViewport = function (name, ...rest) {
        if (!name) return console.error(`Cannot create viewport with no name.`);
        if (viewports[name]) return console.error(`Cannot create "${name}": Viewport already exists.`);

        const options = Object.assign({}, ...rest);

        viewports[name] = objectInheritance(options, 'canvas');


        //dealing with options
        viewports[name].defaultCW = options ? options.width ? options.width || defaultCW : defaultCW : defaultCW;
        viewports[name].defaultCH = options ? options.height ? options.height || defaultCH : defaultCH : defaultCH;

        viewports[name].WIDTH = viewports[name].defaultCW;
        viewports[name].HEIGHT = viewports[name].defaultCH;

        if (options && options.id) {
            viewports[name].object.id = options.id || name;
        }

        viewports[name].object.width = viewports[name].WIDTH;
        viewports[name].object.height = viewports[name].HEIGHT;
        viewports[name].object.style.pointerEvents = "none";


        viewports[name].object.stage = viewports[name].object.getContext('2d');
        viewports[name].object.stage.imageSmoothingEnabled = false;

        viewports[name].object.clear = function () {
            this.stage.clearRect(0, 0, this.width, this.height);
        }
        viewports[name].object.fill = function (color) {
            this.stage.fillStyle = color;
            this.stage.fillRect(0, 0, this.width, this.height);
        }
        viewports[name].object.setId = function (id) {
            this.id = id;
        }
        viewports[name].object.setProperties = function (options) {
            if (!options) return console.warn(`No properties declared: ${name}.setProperties().`);
            if (options.x) this.setX(options.x);
            if (options.y) this.setY(options.y);
            if (options.width) this.setWidth(options.width);
            if (options.height) this.setHeight(options.height);
            if (options.alignH) this.setAlignH(options.alignH);
            if (options.alignV) this.setAlignV(options.alignV);
            if (options.alignT) this.setAlignT(options.alignT);
            if (options.align) this.setAlign(options.align);
            if (options.positionH) this.setPositionH(options.positionH);
            if (options.positionV) this.setPositionV(options.positionV);
            if (options.position) this.setPosition(options.position);
            if (options.visible) this.setVisible(options.visible);
            if (options.id) this.setId(options.id);
        }
        viewports[name].object.restore = function () {
            this.setX(viewports[name].defaultCX);
            this.setY(viewports[name].defaultCY);
            this.setWidth(viewports[name].defaultCW);
            this.setHeight(viewports[name].defaultCH);
            this.setAlign({ h: defaultOAH, v: defaultOAV, t: defaultOAT });
            this.setPosition({ h: defaultOPH, v: defaultOPV });
            resizeCanvas();
        }
        viewports[name].object.getId = function () {
            return this.id || undefined;
        }
        viewports[name].object.getProperties = function (returns) {
            const propsList = {
                x: this.getX(),
                y: this.getY(),
                width: this.getWidth(),
                height: this.getHeight(),
                id: this.getId(),
                align: this.getAlign(),
                position: this.getPosition()
            }
            if (typeof returns !== "string") return propsList;
            return getSerializedProperties(propsList, returns);
        }

        gameCanvasDiv.appendChild(viewports[name].object);
        resizeCanvas();
        return viewports[name].object;
    }
    const removeViewport = function (name) {
        if (!name) return console.error(`No viewport specified.`);
        if (!viewports[name]) return console.error(`Cannot remove "${name}": Viewport does not exist.`);
        viewports[name].object.delete();
    }
    const removeObject = function (name) {
        if (!name) return console.error(`No object specified.`);
        if (!gameobjects[name]) return console.error(`Cannot remove "${name}": Object does not exist.`);
        gameobjects[name].object.delete();
    }
    const setKeyDown = function (event) {
        // event.preventDefault();
        keyslist['code_' + event.keyCode] = true;
        keyslist['name_' + event.key.toLowerCase()] = true;
    }
    const setKeyUp = function (event) {
        // event.preventDefault();
        delete keyslist['code_' + event.keyCode];
        delete keyslist['name_' + event.key.toLowerCase()];
    }
    const keyslist = {};
    const KeyTypes = function () {
        const LEFT = 37;
        const RIGHT = 39;
        const UP = 38;
        const DOWN = 40;
        const SPACE = 32;
        const BACKSPACE = 8;
        const TAB = 9;
        const ENTER = 13;
        const SHIFT = 16;
        const CONTROL = 17;
        const CTRL = 17;
        const ALTERNATE = 18;
        const ALT = 18;
        const MAP = {
            'space': ' ',
            'left': 'arrowleft',
            'up': 'arrowup',
            'right': 'arrowright',
            'down': 'arrowdown',
            'ctrl': 'control',
            'alternate': 'alt'
        }
        const isDown = function (key) {
            for (const i in MAP)
                if (typeof key === "string" && key.toLowerCase() === i) key = MAP[i];
            return keyslist['code_' + key] || keyslist['name_' + key] || false;
        }
        const isUp = function (key) {
            return !isDown(key);
        }
        return {
            isDown, isUp,
            LEFT, RIGHT, UP, DOWN,
            SPACE, BACKSPACE, ENTER,
            TAB, SHIFT, CONTROL, CTRL, ALTERNATE, ALT
        }
    }()

    const Audios = new FPAudioManager();
    const Audio = function (audio) {
        return Audios.get(audio);
    }
    const Textures = new FPTextureManager();
    const Texture = function (texture) {
        return Textures.get(texture);
    }
    const Util = FPUtil;

    window.addEventListener('resize', resizeCanvas, false);
    gameCanvasDiv.addEventListener('fullscreenchange', fullscreenHandler, false);
    gameCanvasDiv.addEventListener('mozfullscreenchange', fullscreenHandler, false);
    gameCanvasDiv.addEventListener('MSFullscreenChange', fullscreenHandler, false);
    gameCanvasDiv.addEventListener('webkitfullscreenchange', fullscreenHandler, false);

    document.addEventListener('pointerlockchange', pointerlockHandler, false);
    document.addEventListener('mozpointerlockchange', pointerlockHandler, false);

    gameCanvasDiv.addEventListener("keydown", setKeyDown, true);
    gameCanvasDiv.addEventListener("keyup", setKeyUp, false);
    gameCanvasDiv.onselectstart = function () { return false; }
    gameCanvasDiv.addEventListener('contextmenu', function (e) { e.preventDefault(); e.stopPropagation(); });
    gameCanvasDiv.addEventListener('mousemove', setMousePosition, false);

    resizeCanvas('true');
    if (!startEmpty)
        renderNothing();

    return {
        viewportWidth: getViewportWidth,
        viewportHeight: getViewportHeight,
        createButton: (name, ...rest) => createObjectV(name, createButton, ...rest),
        createImage: (name, ...rest) => createObjectV(name, createImage, ...rest),
        createObject,
        createTextfield: (name, ...rest) => createObjectV(name, createTextfield, ...rest),
        createViewport: (name, ...rest) => createViewPortV(name, createViewport, ...rest),
        clearViewport: clearCanvas,
        getContext: getViewportContext,
        getObject,
        getProperties,
        getRoot,
        getStage,
        getViewport,
        height: getHeight,
        isFullscreen,
        isPointerlock,
        lockMouse: (type) => setPointerlock(true, type),
        Mouse: getMouse,
        mouseX: getMouseX,
        mouseY: getMouseY,
        paint,
        prop,
        removeObject,
        removeViewport,
        render,
        renderMethod,
        // reset: resetCanvas,
        setHeight,
        setId,
        setProperties,
        // setSize: setProperties,
        setWidth,
        setX,
        setY,
        toggleFullscreen,
        toggleMouseLock: togglePointerlock,
        unlockMouse: () => setPointerlock(false),
        width: getWidth,
        //big properties now
        Audio,
        Audios,
        Key: KeyTypes,
        Texture,
        Textures,
        Util
    }
}



//===========================================================================================================
/*
Functions we want
Object FPAudioManager has:

audios={};

defaultSourceFolder='audio/'
--where it will look for audio if none stated
defaultFileType = 'mp3';
--file extension if none stated

setDefaultSourceFolder(source)
setDefaultFileType(source)
setDefaults({source, type})

create(audioName, audioSrc) //adds audio
--make it default to look for audio in default audio folder variable or 'audio/' folder if none found- if no source specified
--use audioName as the audio name in src if no src specified
--make it default to look for extension in default src folder variable or 'mp3' folder if none found- if no source specified

get(audioName) //returns audio object to root folder for raw accessing

play(audioName)
pause(audioName)
stop(audioName)
restart(audioName)

playLoop(audioName) //play audio in loop

playOnce(audioName) //play audio once

mute(audioName) //unmute one
unmute(audioName) //unmute one
togglemute(audioName) //toggle mute one

muteAll() //mutes all
unmuteAll() //unmutes all
togglemuteAll() //toggle mutes all

pauseAll() //pauses all
stopAll() //stops all

setVolume(audioName, [1-100]) or setVolume(audioName, vol, max)
//sets volume of one to either val between 100, or val in max range stated (relative to master volume)
setVolumeAll([1-100]) or setVolumeAll(vol, max)
//sets volume of all to either val between 100, or val in max range stated (relative to master volume)
setVolume([1-100]) or setVolume(vol, max)
//sets volume of master volume (when no name is identified)
getVolume(audioName) //gets volume of one
getVolume() //gets master volume (when no name is identified)
getLoop(audioName) //gets if audio is looped
setLoop(audioName, [true/false]) //sets audio loop
getTime(audioName) //gets current time of audio
setTime(audioName, [true/false]) //sets current time of audio

return:
    setDefaultSourceFolder
    setDefaultFileType
    setDefaults
    create
    get
    play
    pause
    stop
    restart
    playLoop
    playOnce  
    mute
    unmute
    togglemute
    muteAll
    unmuteAll
    togglemuteAll
    pauseAll
    stopAll
    getVolume
    setVolume
    setVolumeAll
    getLoop
    setLoop
    getTime
    setTime

*/

const FPAudioManager = function (options) {
    /*options can have
        source; type
    */
    let audios = {};
    let volume = 1;

    let defaultSourceFolder = options ? options.source ? options.source : 'audio' : 'audio';
    let defaultFileType = options ? options.type ? options.type : 'mp3' : 'mp3';

    const setDefaultSourceFolder = function (source) {
        defaultSourceFolder = source;
    }
    const setDefaultFileType = function (type) {
        defaultFileType = type;
    }
    const setDefaults = function (options) {
        //options would be {source:'source', type:'type'}
        if (options.source) setDefaultSourceFolder(options.source);
        if (options.type) setDefaultFileType(options.type);
    }

    const create = function () {
        return new Promise(async (resolve, reject) => {
            for (const i in arguments)
                await innerCreate(arguments[i]);
            resolve();
        });
    }
    const innerCreate = function (currStack) {
        return new Promise((resolve, reject) => {
            let audioName;
            let audioSrc;

            if (typeof currStack === 'string') {
                audioName = currStack;
            } else if (typeof currStack === 'object') {
                audioName = currStack[0];
                audioSrc = currStack[1];
            }
            //if already exists
            if (audios[audioName]) {
                console.error(`Cannot create "${audioName}": Audio file already exists.`);
                return resolve();
            }

            const src = audioSrc ? audioSrc : `${defaultSourceFolder}/${audioName}.${defaultFileType}`;
            const audio = new Audio(src);
            audio.onloadeddata = function () {
                audios[audioName] = {};
                audios[audioName].audioObj = audio;
                audios[audioName].volume = 1;
                resolve();
            }
            audio.onerror = function () {
                if (audios[audioName])
                    delete audios[audioName];
                resolve();
            }
        });
    }

    const get = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot get "${audioName}": Audio file does not exists.`);
        }
        return audios[audioName].audioObj;
    }


    const play = async function (audioName) {
        try {
            //if does not exist
            if (!audios[audioName]) {
                return console.error(`Cannot play "${audioName}": Audio file does not exists.`);
            }

            await audios[audioName].audioObj.play();
        } catch { }
    }


    const pause = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot pause "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.pause();
    }


    const stop = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot stop "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.pause();
        audios[audioName].audioObj.currentTime = 0;
        audios[audioName].audioObj.loop = false;
    }


    const restart = async function (audioName) {
        try {
            //if does not exist
            if (!audios[audioName]) {
                return console.error(`Cannot restart "${audioName}": Audio file does not exists.`);
            }

            audios[audioName].audioObj.pause();
            audios[audioName].audioObj.currentTime = 0;
            await audios[audioName].audioObj.play();
        } catch { }
    }


    const playLoop = async function (audioName) {
        try {
            //if does not exist
            if (!audios[audioName]) {
                return console.error(`Cannot play "${audioName}": Audio file does not exists.`);
            }

            await audios[audioName].audioObj.play();
            audios[audioName].audioObj.loop = true;
        } catch { }
    }


    const playOnce = async function (audioName) {
        try {
            //if does not exist
            if (!audios[audioName]) {
                return console.error(`Cannot play "${audioName}": Audio file does not exists.`);
            }

            audios[audioName].audioObj.pause();
            audios[audioName].audioObj.currentTime = 0;
            await audios[audioName].audioObj.play();
            audios[audioName].audioObj.loop = false;
        } catch { }
    }


    const mute = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot mute "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.muted = true;
    }


    const unmute = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot unmute "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.muted = false;
    }


    const togglemute = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot toggle mute "${audioName}": Audio file does not exists.`);
        }

        audios[audioName].audioObj.muted = !audios[audioName].audioObj.muted;
    }


    const muteAll = function () {
        for (const audioName in audios)
            audios[audioName].audioObj.muted = true;
    }


    const unmuteAll = function () {
        for (const audioName in audios)
            audios[audioName].audioObj.muted = false;
    }


    const togglemuteAll = function () {
        for (const audioName in audios)
            audios[audioName].audioObj.muted = !audios[audioName].audioObj.muted;
    }


    const pauseAll = function () {
        for (const audioName in audios)
            audios[audioName].audioObj.pause();
    }


    const stopAll = function () {
        for (const audioName in audios) {
            audios[audioName].audioObj.pause();
            audios[audioName].audioObj.currentTime = 0;
        }
    }

    const getVolume = function (audioName) {  //gets volume of one, or master volume (when no name is identified)
        if (!audioName) {
            return volume;
        } else {
            //if does not exist
            if (!audios[audioName]) {
                return console.error(`Cannot set volume of "${audioName}": Audio file does not exists.`);
            }
            return audios[audioName].audioObj.volume;
        }
    }


    const setVolume = function (audioName, par1, par2) {
        let range;
        let max;
        let tempVolume;
        if (typeof audioName !== "string") {
            tempVolume = volume * 100;
            range = audioName || tempVolume;
            max = par1 || 100;

            tempVolume = range / max || volume;

            if (tempVolume > 1) tempVolume = 1;
            if (tempVolume < 0) tempVolume = 0;
            volume = tempVolume;


            for (const audioNames in audios)
                audios[audioNames].audioObj.volume = audios[audioNames].volume * volume;
        } else {
            //if does not exist
            if (!audios[audioName]) {
                return console.error(`Cannot set volume of "${audioName}": Audio file does not exists.`);
            }
            tempVolume = audios[audioName].volume * 100;
            range = par1 || tempVolume;
            max = par2 || 100;

            tempVolume = range / max || volume;

            if (tempVolume > 1) tempVolume = 1;
            if (tempVolume < 0) tempVolume = 0;
            audios[audioName].volume = tempVolume;

            audios[audioName].audioObj.volume = audios[audioName].volume * volume;
        }
    }


    const setVolumeAll = function (par1, par2) {
        let range;
        let max;
        let tempVolume;

        for (const audioName in audios) {
            tempVolume = audios[audioName].volume * 100;
            range = par1 || tempVolume;
            max = par2 || 100;

            tempVolume = range / max || volume;

            if (tempVolume > 1) tempVolume = 1;
            if (tempVolume < 0) tempVolume = 0;
            audios[audioName].volume = tempVolume;

            audios[audioName].audioObj.volume = audios[audioName].volume * volume;
        }
    }

    const getLoop = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot get loop for "${audioName}": Audio file does not exists.`);
        }

        return audios[audioName].audioObj.loop;
    }
    const setLoop = function (audioName, value) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot set loop for "${audioName}": Audio file does not exists.`);
        }

        return audios[audioName].audioObj.loop = value;
    }

    const getTime = function (audioName) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot get time for "${audioName}": Audio file does not exists.`);
        }

        return audios[audioName].audioObj.currentTime;
    }
    const setTime = function (audioName, value) {
        //if does not exist
        if (!audios[audioName]) {
            return console.error(`Cannot set time for "${audioName}": Audio file does not exists.`);
        }

        return audios[audioName].audioObj.currentTime = value;
    }

    return {
        setDefaultSourceFolder,
        setDefaultFileType,
        setDefaults,
        create,
        get,
        play,
        pause,
        stop,
        restart,
        playLoop,
        playOnce,
        mute,
        unmute,
        togglemute,
        muteAll,
        unmuteAll,
        togglemuteAll,
        pauseAll,
        stopAll,
        getVolume,
        setVolume,
        setVolumeAll,
        getLoop,
        setLoop,
        getTime,
        setTime
    }
}
//===========================================================================================================
/*
Functions we want
Object FPTextureManager has:

textures={};

defaultSourceFolder='texture/'
--where it will look for texture if none stated
defaultFileType = 'mp3';
--file extension if none stated

setDefaultSourceFolder(source)
setDefaultFileType(source)
setDefaults({source, type})

create(textureName, textureSrc) //adds texture
--make it default to look for texture in default texture folder variable or 'texture/' folder if none found- if no source specified
--use textureName as the texture name in src if no src specified
--make it default to look for extension in default src folder variable or 'mp3' folder if none found- if no source specified

get(textureName) //returns texture object to root folder for raw accessing

return:
    setDefaultSourceFolder
    setDefaultFileType
    setDefaults
    create
    get

*/

const FPTextureManager = function (options) {
    /*options can have
        source; type
    */
    let textures = {};

    let defaultSourceFolder = options ? options.source ? options.source : 'textures' : 'textures';
    let defaultFileType = options ? options.type ? options.type : 'png' : 'png';

    const setDefaultSourceFolder = function (source) {
        defaultSourceFolder = source;
    }
    const setDefaultFileType = function (type) {
        defaultFileType = type;
    }
    const setDefaults = function (options) {
        //options would be {source:'source', type:'type'}
        if (options.source) setDefaultSourceFolder(options.source);
        if (options.type) setDefaultFileType(options.type);
    }

    const create = function () {
        return new Promise(async (resolve, reject) => {
            for (const i in arguments)
                await innerCreate(arguments[i]);
            resolve();
        });
    }
    const innerCreate = function (currStack) {
        return new Promise((resolve, reject) => {
            let textureName;
            let textureSrc;

            if (typeof currStack === 'string') {
                textureName = currStack;
            } else if (typeof currStack === 'object') {
                textureName = currStack[0];
                textureSrc = currStack[1];
            }
            //if already exists
            if (textures[textureName]) {
                console.error(`Cannot create "${textureName}": Texture file already exists.`);
                return resolve();
            }

            const src = textureSrc ? textureSrc : `${defaultSourceFolder}/${textureName}.${defaultFileType}`;
            const texture = new Image();
            texture.onload = function () {
                textures[textureName] = {};
                textures[textureName].textureObj = texture;
                resolve();
            }
            texture.onerror = function () {
                if (textures[textureName])
                    delete textures[textureName];
                resolve();
            }
            texture.src = src;
        });
    }

    const get = function (textureName) {
        //if does not exist
        if (!textures[textureName]) {
            return console.error(`Cannot get "${textureName}": Texture file does not exists.`);
        }
        return textures[textureName].textureObj;
    }
    return {
        setDefaultSourceFolder,
        setDefaultFileType,
        setDefaults,
        create,
        get
    }
}
//===========================================================================================================
const FPUtil = function () {
    const time = (name, func, times) => {
        console.time(name);
        loop(func, times);
        console.timeEnd(name);
    }
    const loop = (func, times) => {
        for (let i = 0; i < Math.abs(times); i++)
            func();
    }
    const sum = (...digits) => {
        return [...digits].reduce((total, val) => total + val, 0);
    }
    const difference = (first, ...digits) => {
        return [...digits].reduce((total, val) => total - val, first);
    }
    const product = (first, ...digits) => {
        return [...digits].reduce((total, val) => total * val, first);
    }
    const quotient = (first, ...digits) => {
        return [...digits].reduce((total, val) => total / val, first);
    }
    const remainder = (first, ...digits) => {
        return [...digits].reduce((total, val) => total % val, first);
    }
    const random = (a, b) => {
        var result;
        var random = Math.random();
        if (a !== null && typeof a === "object") {
            //treat as list
            if (b === 1)
                result = a[random(a.length - 1)];
            else
                result = cloneObject(a).sort(function () {
                    return random > .5 ? -1 : 1;
                });
        } else if (typeof a === "string") {
            //treat as string
            if (b === 1)
                result = a.split("")[random(a.length - 1)];
            else
                result = a.split("").sort(function () {
                    return random > .5 ? -1 : 1;
                }).join("");
        } else if (typeof a === "number") {
            //treat as number
            if (typeof b === "number") {
                //treat as range
                result = Math.round(random * (b - a)) + a;
            } else {
                //treat as number
                result = Math.round(random * a);
            }
        } else {
            //treat as val between 0 and 1
            result = random;
        }
        return result;
    }
    const cloneObject = (obj) => {
        if (obj === null || typeof (obj) !== 'object')
            return obj;

        var temp = new obj.constructor();
        for (var key in obj)
            temp[key] = cloneObject(obj[key]);

        return temp;
    }
    return {
        createTimer: time, loop,
        sum, difference, product, quotient, remainder,
        random, clone: cloneObject
    }
}()
