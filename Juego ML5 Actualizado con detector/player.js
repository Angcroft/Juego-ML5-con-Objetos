class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.speed = 3;
        this.health = 100;
        this.bullets = [];
        this.bulletSpeed = 5;
        this.lastShotTime = 0;
        this.shootCooldown = 1000;  //  Representado en milisegundos, en realidad es sólo 1 segundo
        this.angle = 0;
        this.movementDirection = createVector(0, 0);    //  Se inicia la posición de movimiento del jugador a uno inicial
        this.invincible = false;
        this.invincibilityDuration = 1000;
        this.lastHitTime = 0;
        this.isAlive = true;    //  Forma de indicar que el jugador está vivo, switch a falso en caso contrario
    }

    show() {
        fill(0, 0, 255);    //  Color azul
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        ellipse(0, 0, this.size, this.size);
        pop();
    }

    move() {
        this.movementDirection.set(0, 0);

        //  Tecla "W"
        if (keyIsDown(87) && this.y - this.speed > 0) this.movementDirection.y = -1;
        //  Tecla "S"
        if (keyIsDown(83) && this.y + this.speed < height) this.movementDirection.y = 1;
        //  Tecla "A"
        if (keyIsDown(65) && this.x - this.speed > 0) this.movementDirection.x = -1;
        //  Tecla "W"
        if (keyIsDown(68) && this.x + this.speed < width) this.movementDirection.x = 1;

        this.x += this.speed * this.movementDirection.x;
        this.y += this.speed * this.movementDirection.y;
    }

    shoot() {
        const currentTime = millis();
        if (keyIsDown(32) && currentTime - this.lastShotTime > this.shootCooldown) {
            //  Movimiento y dirección de las balas dependientes de la dirección del Mouse en la pantalla.
            const angleToMouse = atan2(mouseY - this.y, mouseX - this.x);
            const bulletX = this.x + this.size / 2 * cos(angleToMouse);
            const bulletY = this.y + this.size / 2 * sin(angleToMouse);

            this.bullets.push(new Bullet(bulletX, bulletY, this.bulletSpeed, angleToMouse));
            this.lastShotTime = currentTime;
        }
    }

    showHealth() {
        const healthSpan = document.getElementById('health');
        healthSpan.innerText = this.health;
    }

    takeDamage(damage) {
        //  Siempre y cuando el jugador no se encuentre en su momento de invencibilidad sufre daño, reiniciando el contador de lastHitTime
        if (!this.invincible) {
            this.health -= damage;
            this.invincible = true;
            this.lastHitTime = millis();

            if (this.health <= 0) this.isAlive = false;
        }
    }

    handleInvincibility() {
        if (this.invincible) {
            const invincibilityTimePassed = millis() - this.lastHitTime;
            if (invincibilityTimePassed >= this.invincibilityDuration) this.invincible = false;
        }
    }

    draw() {
        this.handleInvincibility();
    }

    //  Se reconstruye al jugador una vez muerto, en la misma posición inicial que antes.
    reset() {
        player = new Player(width / 2, height / 2);
    }
}