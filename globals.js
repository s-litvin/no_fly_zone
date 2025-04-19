const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const RADAR_RADIUS = 240;
const RADAR_CENTER = new Vector2(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

const DEFAULT_TARGET_COUNT = 5;

let trailLayer;

function map(value, inMin, inMax, outMin, outMax) {
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

function renderTrailDot(x, y, alpha) {
    fill(0, 255, 0, alpha);
    noStroke();
    circle(x, y, 2);
}