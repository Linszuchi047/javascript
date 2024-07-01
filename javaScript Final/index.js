"use strict";

function reStart() {
    location.reload();
}


window.onload = function () {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    // 清理畫布
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 建立碰撞地圖
    const collisionsMap = [];

    // 使用 for 循環來遍歷 collisions 數組，每次增量為 100
    for (let i = 0; i < collisions.length; i += 100) {
        // 使用 slice 方法從 collisions 數組中提取一段長度為 100 的子數組(collisions可以看成100 X 100的矩陣，我希望切成100列為一組)
        // 並將這個子數組添加到 collisionsMap 陣列中
        collisionsMap.push(collisions.slice(i, 100 + i));
    }


    class Boundary {
        static height = 16;
        static width = 16;


        constructor({ position }) {

            this.position = position;
            this.width = Boundary.width;
            this.height = Boundary.height;
        }

        // 定義一個 draw 方法，用於繪製邊界
        draw() {
            // 設置繪圖上下文的填充樣式為透明的紅色
            context.fillStyle = "rgba(255,0,0,0.0)";
            // 繪製一個填充矩形，位置和大小由實例的 position、width 和 height 屬性決定
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }


    const boundaries = [];
    const offset = {
        x: -120,
        y: -200
    };

    collisionsMap.forEach((row, i) => { //每列
        //每行
        row.forEach((symbol, j) => {
            if (symbol != 0)
                boundaries.push(new Boundary({
                    position: {
                        //在第j行，第i列的格子填滿紅色
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                }));
        });
    });


    // 載入圖片
    const image = new Image();
    image.src = 'NYCU final game_2.png';
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
    const HitImage = new Image();
    HitImage.src = './img/Hit.png';
    let imagesLoaded = 0;

    function onLoadImage() {
        imagesLoaded++;
        if (imagesLoaded === 1) {
            // drawImages();
            animate();
            setTimeout(endGame, 30000);
        }
    }

    image.onload = onLoadImage;
    playerUpImage.onload = onLoadImage;
    coinImage.onload = onLoadImage;


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

        // 繪製
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

            // 更新Frames
            if (this.moving) {
                if (this.frames.max > 1) {
                    this.frames.elapsed++;
                    if (this.frames.elapsed % this.frames.hold === 0) {
                        this.frames.val = (this.frames.val + 1) % this.frames.max;
                    }
                }
            }
        }

        // 更新位置
        updatePosition() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }

        // 設置新圖像
        setImage(newImage) {
            this.image = newImage;
            this.width = newImage.width / this.frames.max;
            this.height = newImage.height;
        }

        // 設置Frames
        setFrames(newFrames) {
            this.frames = { ...newFrames, val: 0, elapsed: 0 };
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }
    }

    // 創建玩家
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

    const fireballs = [];

    // 發射火球
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

    const coins = []; // 儲存硬幣的陣列

    // 創建硬幣
    for (let i = 0; i < 11; i++) {
        const coin = new Sprite({
            position: getRandomPosition(i), // 獲取隨機位置
            image: coinImage,
        });
        coins.push(coin); // 添加硬幣到陣列
    }

    const monsters = []; // 儲存怪物的陣列

    // 創建怪物
    for (let i = 0; i < 5; i++) {
        const monster = new Sprite({
            position: getMonsPosition(i),
            frames: { max: 5, hold: 10, long: 32 },
            image: idleImage,
            velocity: { x: 0, y: 1 }
        });
        monsters.push(monster);
    }

    // 獲取怪物位置
    function getMonsPosition(i) {
        let x = [700, 600, 800, 450, 1100];
        let y = [500, 1000, 1000, 650, 400];
        return { x: x[i], y: y[i] };
    }

    // 創建背景
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

    const movables = [background, ...boundaries, ...monsters, ...coins];
    let score = 0;
    let gameOver = false;

    // 檢查牆壁碰撞
    function recCollision({ rectangle1, rectangle2 }) {
        return (
            rectangle1.position.x + rectangle1.width + 15 >= rectangle2.position.x &&
            rectangle1.position.x + 5 <= rectangle2.position.x + rectangle2.width &&
            rectangle1.position.y + 5 <= rectangle2.position.y + rectangle2.height &&
            rectangle1.position.y + rectangle1.height + 35 >= rectangle2.position.y
        );
    }

    // 檢查硬幣碰撞
    function coin_recCollision({ rectangle1, rectangle2 }) {
        return (
            rectangle1.position.x + rectangle1.width + 30 >= rectangle2.position.x &&
            rectangle1.position.x - 28 <= rectangle2.position.x + rectangle2.width &&
            rectangle1.position.y - 35 <= rectangle2.position.y + rectangle2.height &&
            rectangle1.position.y + rectangle1.height + 50 >= rectangle2.position.y
        );
    }

    // 檢查怪物碰撞
    function mon_recCollision({ rectangle1, rectangle2 }) {
        return (
            rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
            rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
            rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
            rectangle1.position.y + rectangle1.height >= rectangle2.position.y
        );
    }

    // 檢查硬幣碰撞並更新分數
    function checkCoinCollisions() {
        coins.forEach((coin, index) => {
            if (coin_recCollision({ rectangle1: player, rectangle2: coin })) {
                score += 1;
                document.getElementById('coin').innerText = `Score: ${score}`;
                coins.splice(index, 1);
            }
        });
    }

    // 檢查火球和怪物碰撞
    function detectMonsterCollision() {
        fireballs.forEach((fireball, fireballIndex) => {
            monsters.forEach((monster, monsterIndex) => {
                if (mon_recCollision({ rectangle1: fireball, rectangle2: monster })) {
                    score += 1;
                    document.getElementById('coin').innerText = `Score: ${score}`;
                    monsters[monsterIndex].setImage(HitImage);
                    monsters[monsterIndex].setFrames({ max: 7, hold: 5, long: 32 });
                    setTimeout(() => {
                        delete monsters[monsterIndex];
                    }, 1000);
                }
            });
        });
    }

    // 檢查玩家和怪物碰撞
    function MonsCollisions() {
        monsters.forEach((monster, index) => {
            if (coin_recCollision({ rectangle1: player, rectangle2: monster })) {
                score -= 1;
                document.getElementById('coin').innerText = `Score: ${score}`;
            }
        });
    }

    // 獲取硬幣位置
    function getRandomPosition(i) {
        let x = [500, 580, 700, 400, 1100, 1130, 1050, 350, 300, 200, 900];
        let y = [500, 550, 700, 650, 500, 600, 700, 1000, 900, 200, 1000];
        return { x: x[i], y: y[i] };
    }

    let walk_x = 0;
    let walk_y = 0;
    let time_count = 30; // 初始時間設定為30秒

    const intervalId = setInterval(() => {
        time_count -= 1;
        document.getElementById('time').innerText = `${time_count}`;

        if (time_count <= 0) {
            clearInterval(intervalId); // 停止計時器
        }
    }, 1000);

    // 結束遊戲
    function endGame() {
        gameOver = true;
        const modal = document.getElementById('myModal');
        const finalScore = document.getElementById('finalScore');
        finalScore.innerText = `Final Score: ${score}`;
        modal.style.display = 'flex';
    }




    function animate() {
        if (gameOver) return; // 如果遊戲結束則返回

        window.requestAnimationFrame(animate); // 請求下一幀動畫
        context.clearRect(0, 0, canvas.width, canvas.height); // 清除畫布
        background.draw(); // 繪製背景

        // 繪製邊界
        boundaries.forEach(boundary => {
            boundary.draw();
        });

        // 繪製金幣
        coins.forEach(coin => {
            coin.draw();
        });

        player.draw(); // 繪製玩家

        // 更新和繪製怪物
        monsters.forEach((monster, index) => {
            if (index % 2 === 0) { // 偶數index的怪物
                let direction = -1;
                let i = 1;

                setInterval(() => {
                    // 改變方向
                    direction *= -1;
                    if (direction === 1) {
                        monster.position.y += i;
                    }
                    if (direction === -1) {
                        monster.position.y -= 2;
                    }
                    i = 2;
                }, 1000); // 每隔一秒改變一次方向

            } else { // 奇數index的怪物
                let direction = -1;
                let i = 1;

                setInterval(() => {
                    // 改變方向
                    direction *= -1;
                    if (direction === 1) {
                        monster.position.x += i;
                    }
                    if (direction === -1) {
                        monster.position.x -= 2;
                    }
                    i = 2;
                }, 1000); // 每隔一秒改變一次方向
            }

            monster.draw(); // 繪製怪物
        });

        let moving = true;
        player.moving = false;

        // 更新和繪製火球
        fireballs.forEach((fireball, index) => {
            fireball.updatePosition();
            fireball.draw(context);
            fireball.moving = true; // 繪製火球

            // 移除超出畫布的火球
            if (fireball.position.x > player.position.x + 480 + walk_x ||
                fireball.position.y > player.position.y + 800 + walk_y ||
                fireball.position.x < player.position.x - 500 + walk_x ||
                fireball.position.y < player.position.y - 180 + walk_y) {
                fireballs.splice(index, 1);
            }
        });

        // 玩家移動和碰撞檢測
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

        checkCoinCollisions(); // 檢查金幣碰撞
        detectMonsterCollision(); // 檢測怪物碰撞
        MonsCollisions(); // 怪物碰撞檢測
    }

    let lastKey = '';
    let coinCollected = false;

    // 按鍵按下事件
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

    // 按鍵鬆開事件
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

    // 空格鍵事件以發射火球
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            shootFireball(lastKey);
        }
    });
}