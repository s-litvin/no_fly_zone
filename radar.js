class Radar {

    constructor(center, radius) {
        this.center = center;
        this.radius = radius;

        this.trailPoints = [];
        this.targets = [];
    }

    setTargets(targets) {
        this.targets = targets;
    }

    isWithinRange(pos) {
        let copyPos = pos.copy();
        copyPos.sub(this.center);

        return copyPos.mag() <= this.radius;
    }

    render(targets) {
        noFill();
        stroke(0, 255, 0, 150);
        strokeWeight(2);
        circle(this.center.x, this.center.y, this.radius * 2);
        noStroke();

        this.renderTargets(targets)
        this.renderTrails();
    }

    addTrailPoint(pos) {
        // Добавить точку с начальной "яркостью"
        this.trailPoints.push({
            position: pos.copy(),
            ttl: 60 // живёт 60 кадров
        });
    }

    updateTrails() {
        for (let pt of this.trailPoints) {
            pt.ttl -= 1;
        }
        this.trailPoints = this.trailPoints.filter(pt => pt.ttl > 0);
    }

    renderTrails() {
        for (let pt of this.trailPoints) {
            let alpha = map(pt.ttl, 0, 60, 0, 255);
            renderTrailDot(pt.position.x, pt.position.y, alpha)
        }
    }

    renderTargets(targets) {
        for (let target of this.targets) {
            if (!radar.isWithinRange(target.position)) continue;
            target.render();
            this.addTrailPoint(target.position);
        }
    }

    renderAltitudePanel(targets) {
        const panelX = CANVAS_WIDTH - 100;
        const panelTop = 50;
        const panelBottom = 450;
        const panelHeight = panelBottom - panelTop;
        const maxAlt = 12000;

        // Панель фона
        fill(0, 0, 0, 150);
        rect(panelX - 10, panelTop - 10, 80, panelHeight + 20, 5);

        // Шкала
        stroke(100, 255, 100);
        line(panelX, panelTop, panelX, panelBottom);

        // Подписи на шкале
        noStroke();
        fill(180);
        textSize(10);
        for (let i = 0; i <= 4; i++) {
            let alt = (i / 4) * maxAlt;
            let y = map(alt, 0, maxAlt, panelBottom, panelTop);
            text(`${Math.floor(alt)}m`, panelX + 15, y + 3);
        }

        // Цели на панели
        for (let target of targets) {
            if (!this.isWithinRange(target.position)) continue;

            let y = map(target.altitude, 0, maxAlt, panelBottom, panelTop);
            fill(0, 255, 0);
            circle(panelX, y, 6);
        }
    }

}
