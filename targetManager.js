class TargetManager {
    constructor() {
        this.targets = [];
    }

    update() {
        for (let obj of this.targets) {
            obj.applyEnvironmentalForces();
            obj.update();
        }

        this.targets = this.targets.filter(t => t.fuel > 0);
    }

    createTargets(num) {
        for (let i = 0; i < num; i++) {
            let angle = random(TWO_PI);
            let radius = random(0, RADAR_RADIUS - 20);
            let x = RADAR_CENTER.x + radius * Math.cos(angle);
            let y = RADAR_CENTER.y + radius * Math.sin(angle);
            let pos = new Vector2(x, y);

            let velocity = new Vector2(random(-2, 2), random(-2, 2));
            let frictionCoef = random(0.01, 0.03);
            let mass = random(10, 150);
            let fuel = random(200, 1500)
            let obj = new FlyingObject(pos, velocity, mass, frictionCoef, fuel);

            // создаем 5 случайных точек маршрута
            for (let j = 0; j < 25; j++) {
                let wp = {
                    position: new Vector2(random(0, CANVAS_WIDTH), random(0, CANVAS_HEIGHT)),
                    actionType: null,
                    actionParams: null,
                    actionExecuted: false
                };

                obj.waypoints.push(wp);
            }

            this.targets.push(obj);
        }
    }

    render(radar) {

    }

    renderTargetPanel(radar) {
        const visibleTargets = this.targets.filter(t => radar.isWithinRange(t.position));

        fill(0, 0, 0, 150);
        rect(10, 10, 240, visibleTargets.length * 22 + 30, 5);

        fill(255);
        textSize(14);
        text("Targets:", 20, 30);
        textSize(12);
        for (let i = 0; i < visibleTargets.length; i++) {
            let t = visibleTargets[i];
            let speed = t.velocity.mag().toFixed(1);
            let altitude = Math.floor(t.altitude);

            let label = `#${i + 1} | SPEED: ${speed} m/s | ALT: ${altitude} m`;
            text(label, 20, 55 + i * 20);
        }

        // console.log(this.targets);
    }


}
