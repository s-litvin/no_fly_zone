let manager;
let radar;

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    manager = new TargetManager();
    radar = new Radar(RADAR_CENTER, RADAR_RADIUS);

    manager.createTargets(20);
}

function draw() {
    background(10);

    radar.updateTrails();

    radar.setTargets(manager.targets);
    radar.render();
    radar.renderAltitudePanel(manager.targets);

    manager.update();
    manager.render(radar);
    manager.renderTargetPanel(radar);
}
