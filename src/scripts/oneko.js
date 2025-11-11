// oneko.js: https://github.com/adryd325/oneko.js

(function oneko() {
    const isReducedMotion =
        window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
        window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    if (isReducedMotion) return;

    const nekoEl = document.createElement("div");

    let nekoPosX = 32;
    let nekoPosY = 32;

    let mousePosX = 0;
    let mousePosY = 0;

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;

    // NEW: Manual sleep state
    let forceSleep = false;

    // NEW: Proximity action state
    let lastProximityAction = 0;
    let isInProximity = false;
    let proximityStartTime = 0;
    const proximityActionInterval = 3500; // 3.5 seconds between actions
    const proximityThreshold = 120; // pixels

    const nekoSpeed = 10;
    const spriteSets = {
        idle: [[-3, -3]],
        alert: [[-7, -3]],
        scratchSelf: [
            [-5, 0],
            [-6, 0],
            [-7, 0],
        ],
        scratchWallN: [
            [0, 0],
            [0, -1],
        ],
        scratchWallS: [
            [-7, -1],
            [-6, -2],
        ],
        scratchWallE: [
            [-2, -2],
            [-2, -3],
        ],
        scratchWallW: [
            [-4, 0],
            [-4, -1],
        ],
        tired: [[-3, -2]],
        sleeping: [
            [-2, 0],
            [-2, -1],
        ],
        N: [
            [-1, -2],
            [-1, -3],
        ],
        NE: [
            [0, -2],
            [0, -3],
        ],
        E: [
            [-3, 0],
            [-3, -1],
        ],
        SE: [
            [-5, -1],
            [-5, -2],
        ],
        S: [
            [-6, -3],
            [-7, -2],
        ],
        SW: [
            [-5, -3],
            [-6, -1],
        ],
        W: [
            [-4, -2],
            [-4, -3],
        ],
        NW: [
            [-1, 0],
            [-1, -1],
        ],
    };

    function init() {
        nekoEl.id = "oneko";
        nekoEl.ariaHidden = true;
        nekoEl.style.width = "32px";
        nekoEl.style.height = "32px";
        nekoEl.style.position = "fixed";
        nekoEl.style.pointerEvents = "auto";
        nekoEl.style.imageRendering = "pixelated";
        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
        nekoEl.style.zIndex = 2147483647;
        nekoEl.style.cursor = "pointer";

        let nekoFile = "/oneko.gif" // Changed from "./oneko.gif" to "/oneko.gif"
        const curScript = document.currentScript
        if (curScript && curScript.dataset.cat) {
            nekoFile = curScript.dataset.cat
        }
        nekoEl.style.backgroundImage = `url(${nekoFile})`;

        document.body.appendChild(nekoEl);

        document.addEventListener("mousemove", function (event) {
            mousePosX = event.clientX;
            mousePosY = event.clientY;
        });

        // Double-click to toggle sleep
        nekoEl.addEventListener("dblclick", function (event) {
            event.preventDefault();
            forceSleep = !forceSleep;

            if (forceSleep) {
                idleAnimation = "sleeping";
                idleAnimationFrame = 8;
                isInProximity = false;
            } else {
                resetIdleAnimation();
                idleTime = 0;
            }
        });

        window.requestAnimationFrame(onAnimationFrame);
    }

    let lastFrameTimestamp;

    function onAnimationFrame(timestamp) {
        if (!nekoEl.isConnected) {
            return;
        }
        if (!lastFrameTimestamp) {
            lastFrameTimestamp = timestamp;
        }
        if (timestamp - lastFrameTimestamp > 100) {
            lastFrameTimestamp = timestamp
            frame()
        }
        window.requestAnimationFrame(onAnimationFrame);
    }

    function setSprite(name, frame) {
        const sprite = spriteSets[name][frame % spriteSets[name].length];
        nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    }

    function resetIdleAnimation() {
        idleAnimation = null;
        idleAnimationFrame = 0;
    }

    // Get random action based on cat position - NOW WITH ALL ANIMATIONS!
    function getRandomProximityAction() {
        let availableActions = [
            "alert",
            "scratchSelf",
            "tired",
            "N",    // Look up
            "NE",   // Look up-right
            "E",    // Look right
            "SE",   // Look down-right
            "S",    // Look down
            "SW",   // Look down-left
            "W",    // Look left
            "NW"    // Look up-left
        ];

        // Add wall scratching if near edges
        if (nekoPosX < 48) {
            availableActions.push("scratchWallW");
        }
        if (nekoPosY < 48) {
            availableActions.push("scratchWallN");
        }
        if (nekoPosX > window.innerWidth - 48) {
            availableActions.push("scratchWallE");
        }
        if (nekoPosY > window.innerHeight - 48) {
            availableActions.push("scratchWallS");
        }

        return availableActions[Math.floor(Math.random() * availableActions.length)];
    }

    // Continuous random actions when cursor stays close
    function checkProximityAction() {
        if (forceSleep) return;

        const diffX = nekoPosX - mousePosX;
        const diffY = nekoPosY - mousePosY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        const now = Date.now();
        const wasInProximity = isInProximity;

        // Check if cursor is within proximity range (but not too close)
        isInProximity = distance < proximityThreshold && distance > 48;

        if (isInProximity) {
            // Just entered proximity
            if (!wasInProximity) {
                proximityStartTime = now;
                lastProximityAction = now;
                // Trigger immediate action when entering proximity
                if (idleAnimation === null) {
                    idleAnimation = getRandomProximityAction();
                    idleAnimationFrame = 0;
                }
            }
            // Still in proximity - check if it's time for next action
            else if (idleAnimation === null && now - lastProximityAction >= proximityActionInterval) {
                lastProximityAction = now;
                idleAnimation = getRandomProximityAction();
                idleAnimationFrame = 0;
            }
        } else {
            // Exited proximity
            if (wasInProximity) {
                proximityStartTime = 0;
            }
        }
    }

    function idle() {
        idleTime += 1;

        // Regular idle animations (only if not in proximity or sleeping)
        if (
            idleTime > 10 &&
            Math.floor(Math.random() * 200) == 0 &&
            idleAnimation == null &&
            !forceSleep &&
            !isInProximity
        ) {
            let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
            if (nekoPosX < 32) {
                avalibleIdleAnimations.push("scratchWallW");
            }
            if (nekoPosY < 32) {
                avalibleIdleAnimations.push("scratchWallN");
            }
            if (nekoPosX > window.innerWidth - 32) {
                avalibleIdleAnimations.push("scratchWallE");
            }
            if (nekoPosY > window.innerHeight - 32) {
                avalibleIdleAnimations.push("scratchWallS");
            }
            idleAnimation =
                avalibleIdleAnimations[
                Math.floor(Math.random() * avalibleIdleAnimations.length)
                ];
        }

        switch (idleAnimation) {
            case "sleeping":
                if (idleAnimationFrame < 8) {
                    setSprite("tired", 0);
                    break;
                }
                setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
                if (idleAnimationFrame > 192 && !forceSleep) {
                    resetIdleAnimation();
                }
                break;
            case "scratchWallN":
            case "scratchWallS":
            case "scratchWallE":
            case "scratchWallW":
            case "scratchSelf":
                setSprite(idleAnimation, idleAnimationFrame);
                if (idleAnimationFrame > 9) {
                    resetIdleAnimation();
                }
                break;
            case "alert":
                setSprite("alert", 0);
                if (idleAnimationFrame > 12) {
                    resetIdleAnimation();
                }
                break;
            case "tired":
                setSprite("tired", 0);
                if (idleAnimationFrame > 15) {
                    resetIdleAnimation();
                }
                break;
            // NEW: Handle directional looks (cat looking in different directions)
            case "N":
            case "NE":
            case "E":
            case "SE":
            case "S":
            case "SW":
            case "W":
            case "NW":
                setSprite(idleAnimation, Math.floor(idleAnimationFrame / 3));
                if (idleAnimationFrame > 18) {
                    resetIdleAnimation();
                }
                break;
            default:
                setSprite("idle", 0);
                return;
        }
        idleAnimationFrame += 1;
    }

    function frame() {
        frameCount += 1;

        // If manually sleeping, stay asleep and don't follow mouse
        if (forceSleep) {
            idle();
            return;
        }

        // Check for proximity actions continuously
        checkProximityAction();

        const diffX = nekoPosX - mousePosX;
        const diffY = nekoPosY - mousePosY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        if (distance < nekoSpeed || distance < 48) {
            idle();
            return;
        }

        idleAnimation = null;
        idleAnimationFrame = 0;

        if (idleTime > 1) {
            setSprite("alert", 0);
            idleTime = Math.min(idleTime, 7);
            idleTime -= 1;
            return;
        }

        let direction;
        direction = diffY / distance > 0.5 ? "N" : "";
        direction += diffY / distance < -0.5 ? "S" : "";
        direction += diffX / distance > 0.5 ? "W" : "";
        direction += diffX / distance < -0.5 ? "E" : "";
        setSprite(direction, frameCount);

        nekoPosX -= (diffX / distance) * nekoSpeed;
        nekoPosY -= (diffY / distance) * nekoSpeed;

        nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
        nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
    }

    init();
})();