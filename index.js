const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const player = new Fighter({
    position: {
        x: 320,
        y: 200
    },
    velocity: {
        x: 0,
        y: 0
    },
    height: 130,
    width: 50,
    movementSpeed: 5,
    jumpVelocity: -17,
    attackBox: {
        offset: {
            x: 85,
            y: 35
        },
        width: 165,
        height: 50
    },
    imageSrc: './img/samuraiMack/idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 177
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/idle.png',
            framesMax: 8,
            framesHold: 13,
        },
        run: {
            imageSrc: './img/samuraiMack/run.png',
            framesMax: 8,
            framesHold: 5
        },
        jump: {
            imageSrc: './img/samuraiMack/jump.png',
            framesMax: 2,
            framesHold: 5
        },
        fall: {
            imageSrc: './img/samuraiMack/fall.png',
            framesMax: 2,
            framesHold: 5
        },
        attack1: {
            imageSrc: './img/samuraiMack/attack1.png',
            framesMax: 6,
            activeStart: 4,
            activeEnd: 5,
            framesHold: 7
        },
        takeHit: {
            imageSrc: '/img/samuraiMack/Take Hit.png',
            framesMax: 4,
            framesHold: 5
        },
        death: {
            imageSrc: '/img/samuraiMack/Death.png',
            framesMax: 6,
            framesHold: 7
        },
    }
});

const enemy = new Fighter({
    position: {
        x: 650,
        y: 200
    },
    velocity: {
        x: 0,
        y: 0
    },
    width: 50,
    height: 140,
    movementSpeed: 4,
    jumpVelocity: -15,
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 150,
        height: 50
    },
    imageSrc: './img/kenji/idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 182
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/idle.png',
            framesMax: 4,
            framesHold: 12
        },
        run: {
            imageSrc: './img/kenji/run.png',
            framesMax: 8,
            framesHold: 6
        },
        jump: {
            imageSrc: './img/kenji/jump.png',
            framesMax: 2,
            framesHold: 5
        },
        fall: {
            imageSrc: './img/kenji/fall.png',
            framesMax: 2,
            framesHold: 5
        },
        attack1: {
            imageSrc: './img/kenji/attack1.png',
            framesMax: 4,
            activeStart: 1,
            activeEnd: 1,
            framesHold: 6
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3,
            framesHold: 5
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7,
            framesHold: 6
        }
    }
});

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 127
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
});

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.10)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }


    ///// PLAYER //////
    //Player movement
    player.velocity.x = 0;
    
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -(player.movementSpeed);
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = player.movementSpeed;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    //collision detection
    if (rectangularCollision(player, enemy) && player.isAttacking && player.frameCurrent >= player.sprites.attack1.activeStart && player.frameCurrent <= player.sprites.attack1.activeEnd) {
        console.log('Player Hit Enemy');
        enemy.takeHit();
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        });
        player.isAttacking = false;
        
    }

    //if player misses
    if (player.isAttacking && player.frameCurrent >= 4) {
        player.isAttacking = false;
    }
    
    ////// ENEMY //////
    //Enemy movement
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -(enemy.movementSpeed);
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = enemy.movementSpeed;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // Collision Detection
    if (rectangularCollision(enemy, player) && enemy.isAttacking && enemy.frameCurrent >= enemy.sprites.attack1.activeStart && enemy.frameCurrent <= enemy.sprites.attack1.activeEnd) {
        console.log('Enemy Hit Player');
        player.takeHit();
        gsap.to('#playerHealth', {
            duration: 0.5,
            width: player.health + '%'
        });
        enemy.isAttacking = false;
        
    }

    if (enemy.isAttacking && enemy.frameCurrent === 1) {
        enemy.isAttacking = false;
    }
}

animate();

