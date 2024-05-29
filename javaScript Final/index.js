"use strict";


window.onload = function () {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const collisionsMap = [];
    for (let i = 0; i < collisions.length; i += 100) {
        collisionsMap.push(collisions.slice(i, 100 + i));
    }

    class Boundary {
        static height = 16;
        static width = 16;
        constructor({ position }) {
            this.position = position;
            this.width = 16;
            this.height = 16;
        }
        draw() {
            context.fillStyle = "rgba(255,0,0,0.0)";
            // context.fillStyle = "red";
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    const boundaries = [];
    const offset = {
        x: -120,
        y: -200
    };

    collisionsMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol != 0)
                boundaries.push(new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                }));
        });
    });

    const image = new Image();
    // image.src = 'javascript game.png';
    image.src = 'NYCU final game.png';
    const playerDownImage = new Image();
    playerDownImage.src = './img/playerDown.png';
    const playerUpImage = new Image();
    playerUpImage.src = './img/playerUp.png';
    const playerLeftImage = new Image();
    playerLeftImage.src = './img/playerLeft.png';
    const playerRightImage = new Image();
    playerRightImage.src = './img/playerRight.png';
    const coinImage = new Image();
    coinImage.src = './img/coin.png';
    const fireballImage = new Image();
    fireballImage.src = './img/fireball (1).png';
    const idleImage = new Image();
    idleImage.src = './img/Idle.png';

    let imagesLoaded = 0;

    function onLoadImage() {
        imagesLoaded++;
        if (imagesLoaded === 1) {
            // drawImages();
            animate();
        }
    }

    image.onload = onLoadImage;
    playerUpImage.onload = onLoadImage;
    coinImage.onload = onLoadImage;

    // function drawImages() {
    //     context.drawImage(image, 0, offset.y);
    //     context.drawImage(
    //         playerUpImage,
    //         0, 0,
    //         playerUpImage.width / 4, playerUpImage.height,
    //         canvas.width / 2 - playerUpImage.width / 8, canvas.height / 2 - playerUpImage.height / 2,
    //         playerUpImage.width / 4, playerUpImage.height
    //     );
    // }

    class Sprite {
        constructor({ position, image, frames = { max: 1, hold: 10, long: 48 }, direction, velocity }) {
            this.position = position;
            this.image = image;
            this.frames = { ...frames, val: 0, elapsed: 0 };
            this.width = image.width / this.frames.max;
            this.height = image.height;
            this.moving = false;
            this.direction = direction;
            this.velocity = velocity || { x: 0, y: 0 };
        }
        draw() {
            context.drawImage(
                this.image,
                this.frames.val * this.frames.long,
                0,
                this.image.width / this.frames.max,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width / this.frames.max,
                this.image.height
            );
            if (this.moving) {
                if (this.frames.max > 1) {
                    this.frames.elapsed++;
                    if (this.frames.elapsed % this.frames.hold === 0) {
                        this.frames.val = (this.frames.val + 1) % this.frames.max;
                    }
                }
            }
            // if (this.animate) {
            //     if (this.frames.val < this.frames.max - 1) this.frames.val++
            //     else this.frames.val = 0

            // }
        }
        updatePosition() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }

    }

    const player = new Sprite({
        position: {
            x: canvas.width / 2,
            y: canvas.height / 2,
        },
        image: playerDownImage,
        frames: { max: 4, hold: 10, long: 36 },
        direction: {
            up: playerUpImage,
            left: playerLeftImage,
            down: playerDownImage,
            right: playerRightImage

        }
    });
    const fireballs = []

    function shootFireball(direction) {
        let velocity;
        switch (direction) {
            case 'w':
                velocity = { x: 0, y: -5 };
                break;
            case 'a':
                velocity = { x: -5, y: 0 };
                break;
            case 's':
                velocity = { x: 0, y: 5 };
                break;
            case 'd':
                velocity = { x: 5, y: 0 };
                break;
        }
        const fireball = new Sprite({
            position: {
                x: player.position.x,
                y: player.position.y,
            },
            image: fireballImage,
            frames: { max: 4, hold: 12, long: 43 },
            velocity: velocity
        });
        fireballs.push(fireball);
    }




    const coin = new Sprite({
        position: {
            x: 600,  // Updated position for the coin
            y: 500
        },
        image: coinImage,
    });
    const monster = new Sprite({
        position: {
            x: 700,  // Updated position for the coin
            y: 500
        },
        frames: { max: 5, hold: 10, long: 32 },
        image: idleImage,
    });

    const background = new Sprite({
        position: {
            x: offset.x,
            y: offset.y
        },
        image: image
    });

    const keys = {
        w: { pressed: false },
        a: { pressed: false },
        s: { pressed: false },
        d: { pressed: false }
    };

    const movables = [background, ...boundaries, coin, monster];
    let score = 0;

    function recCollision({ rectangle1, rectangle2 }) {
        return (
            rectangle1.position.x + rectangle1.width + 15 >= rectangle2.position.x &&
            rectangle1.position.x + 5 <= rectangle2.position.x + rectangle2.width &&
            rectangle1.position.y + 5 <= rectangle2.position.y + rectangle2.height &&
            rectangle1.position.y + rectangle1.height + 35 >= rectangle2.position.y
        );
    }



    function coin_recCollision({ rectangle1, rectangle2 }) {
        return (
            rectangle1.position.x + rectangle1.width + 30 >= rectangle2.position.x
            &&
            rectangle1.position.x - 28 <= rectangle2.position.x + rectangle2.width
            &&
            rectangle1.position.y - 35 <= rectangle2.position.y + rectangle2.height
            &&
            rectangle1.position.y + rectangle1.height + 50 >= rectangle2.position.y
        );
    }
    function checkCoinCollision() {
        return coin_recCollision({ rectangle1: player, rectangle2: coin });
    }

    function getRandomPosition() {

        let x = [500, 550]
        let y = [500, 550]
        // const r = Math.floor(Math.random() * 2);
        return { x: x[0], y: y[0] };

    }
    let walk_x = 0
    let walk_y = 0



    function animate() {
        window.requestAnimationFrame(animate);
        context.clearRect(0, 0, canvas.width, canvas.height);
        background.draw();
        boundaries.forEach(boundary => {
            boundary.draw();
        });
        if (!coinCollected) {
            coin.draw();
        }
        player.draw();
        monster.draw();
        monster.moving = true;

        let moving = true;
        player.moving = false;
        fireballs.forEach((fireball, index) => {

            fireball.updatePosition();
            fireball.draw(context);
            fireball.moving = true;// 繪製火球

            // 移除超出畫布的火球

            if (fireball.position.x > player.position.x + 480 + walk_x || fireball.position.y > player.position.y + 800 + walk_y || fireball.position.x < player.position.x - 500 + walk_x || fireball.position.y < player.position.y - 180 + walk_y) {
                fireballs.splice(index, 1);
            }
        });

        if (keys.w.pressed && lastKey === 'w') {
            player.moving = true;
            player.image = player.direction.up;
            for (const boundary of boundaries) {
                if (recCollision({
                    rectangle1: player,
                    rectangle2: { ...boundary, position: { x: boundary.position.x, y: boundary.position.y + 3 } }
                })) {
                    moving = false;
                    break;
                }
            }
            if (moving) {
                movables.forEach(movable => movable.position.y += 3);
                walk_y += 3;
            }
        } else if (keys.a.pressed && lastKey === 'a') {
            player.moving = true;
            player.image = player.direction.left;
            for (const boundary of boundaries) {
                if (recCollision({
                    rectangle1: player,
                    rectangle2: { ...boundary, position: { x: boundary.position.x + 3, y: boundary.position.y } }
                })) {
                    moving = false;
                    break;
                }
            }
            if (moving) {
                movables.forEach(movable => movable.position.x += 3);
                walk_x += 3;

            }
        } else if (keys.s.pressed && lastKey === 's') {
            player.moving = true;
            player.image = player.direction.down;
            for (const boundary of boundaries) {
                if (recCollision({
                    rectangle1: player,
                    rectangle2: { ...boundary, position: { x: boundary.position.x, y: boundary.position.y - 3 } }
                })) {
                    moving = false;
                    break;
                }
            }
            if (moving) {
                movables.forEach(movable => movable.position.y -= 3);
                walk_y -= 3;

            }
        } else if (keys.d.pressed && lastKey === 'd') {
            player.moving = true;
            player.image = player.direction.right;
            for (const boundary of boundaries) {
                if (recCollision({
                    rectangle1: player,
                    rectangle2: { ...boundary, position: { x: boundary.position.x - 3, y: boundary.position.y } }
                })) {
                    moving = false;
                    break;
                }
            }
            if (moving) {
                movables.forEach(movable => movable.position.x -= 3);
                walk_x -= 3;

            }
        }
        if (checkCoinCollision()) {
            coinCollected = true;

            score += 1;
            document.getElementById('coin').innerText = `Score: ${score}`;
            // const newPosition = getRandomPosition();
            // coin.position.x = newPosition.x;
            // coin.position.y = newPosition.y;
            // coinCollected = false;
            setTimeout(() => {
                coinCollected = false;
            }, 3000);


            // console.log(coin.position.y)


        }
    }

    let lastKey = '';
    let coinCollected = false;
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case 'w':
                keys.w.pressed = true;
                lastKey = 'w';
                break;
            case 'a':
                keys.a.pressed = true;
                lastKey = 'a';
                break;
            case 's':
                keys.s.pressed = true;
                lastKey = 's';
                break;
            case 'd':
                keys.d.pressed = true;
                lastKey = 'd';
                break;
        }
    });

    window.addEventListener("keyup", (e) => {
        switch (e.key) {
            case 'w':
                keys.w.pressed = false;
                break;
            case 'a':
                keys.a.pressed = false;
                break;
            case 's':
                keys.s.pressed = false;
                break;
            case 'd':
                keys.d.pressed = false;
                break;
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            shootFireball(lastKey);
        }
    });
};
