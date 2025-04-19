class FlyingObject {
    constructor(position, velocity, mass = 100.0, cfr = 0.01, fuel = 1000) {
        this.position = position.copy();
        this.velocity = velocity;
        this.acceleration = new Vector2();
        this.orientation = new Vector2(0, -1); // вверх
        this.mass = mass;
        this.cfr = cfr;
        this.thrust = new Vector2();
        this.altitude = random(400, 12000);
        this.fuel = fuel;
        this.waypoints = [];
        this.maxSpeed = 1.0;
    }

    applyForce(force) {
        let f = force.copy();
        f.div(this.mass);
        this.acceleration.add(f);
    }

    applyEnvironmentalForces() {
        // Сопротивление воздуха (квадратичное)
        let drag = this.velocity.copy();
        drag.normalize();
        drag.mult(-1);
        let speed = this.velocity.mag();
        drag.mult(this.cfr * speed * speed);
        this.applyForce(drag);

        // waypoint force
        if (this.waypoints.length > 0) {
            const WAYPOINT_THRESHOLD = 10;

            let currentWaypoint = this.waypoints[0];
            let target = currentWaypoint.position.copy();
            let toTarget = target.copy();
            toTarget.sub(this.position);

            // Проверка на достижение точки
            if (toTarget.mag() < WAYPOINT_THRESHOLD) {
                this.executeWaypointAction(currentWaypoint);
                this.waypoints.shift();
            } else {
                let minMass = 10;
                let maxMass = 150;
                let minForce = 8;
                let maxForce = 30;

                let forceMag = map(this.mass, minMass, maxMass, maxForce, minForce);

                toTarget.normalize();
                toTarget.mult(forceMag);
                this.applyForce(toTarget);
            }
        }
    }

    update() {
        this.velocity.add(this.acceleration);

        if (this.velocity.mag() > this.maxSpeed) {
            this.velocity.normalize();
            this.velocity.mult(this.maxSpeed);
        }

        this.position.add(this.velocity);
        this.acceleration.set(0, 0);

        this.fuel -= 0.5;
    }

    rotateOrientation(degrees) {
        let angle = radians(degrees);
        let cosA = Math.cos(angle);
        let sinA = Math.sin(angle);
        let x = this.orientation.x;
        let y = this.orientation.y;

        this.orientation.x = x * cosA - y * sinA;
        this.orientation.y = x * sinA + y * cosA;
    }

    boost(thrustPower) {
        this.thrust = this.orientation.copy();
        this.thrust.normalize();
        this.thrust.mult(thrustPower);
        this.applyForce(this.thrust);
    }

    render() {
        if (this.fuel <= 0) return;

        fill(255);
        circle(this.position.x, this.position.y, 10);

        // Отладка: нарисуем вектор направления
        stroke(0, 255, 0);
        line(
            this.position.x,
            this.position.y,
            this.position.x + this.orientation.x * 20,
            this.position.y + this.orientation.y * 20
        );

        // отладочная визуализация маршрута
        stroke(0, 255, 0);
        noFill();
        for (let wp of this.waypoints) {
            circle(wp.x, wp.y, 5);
        }

        // линия до следующей точки
        if (this.waypoints.length > 0) {
            stroke(0, 200, 200);
            line(this.position.x, this.position.y, this.waypoints[0].x, this.waypoints[0].y);
        }

        noStroke();
        fill(255);
        textSize(10);
        text(
            `V: ${this.velocity.mag().toFixed(1)} | M: ${this.mass.toFixed(0)} | Fuel: ${this.fuel.toFixed(0)}`,
            this.position.x + 10,
            this.position.y
        );
    }

    executeWaypointAction(waypoint) {
        if (waypoint.actionExecuted || !waypoint.actionType) return;

        switch (waypoint.actionType) {
            case "CHANGE_ALTITUDE":
                if (waypoint.actionParams && waypoint.actionParams.value !== undefined) {
                    this.altitude = waypoint.actionParams.value;
                    console.log("New altitude!" + this.altitude);
                }
                break;

            case "DROP_PAYLOAD":
                console.log("Payload dropped!");
                break;

            case "SPLIT_WARHEAD":
                console.log("Warhead split initiated!");
                break;

            case "DEPLOY_TROOPS":
                console.log("Troops deployed!");
                break;

            default:
                break;
        }

        waypoint.actionExecuted = true;
    }

}
