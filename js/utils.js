function rectangularCollision(rectange1, rectangle2) {
    return (
        rectange1.attackBox.position.x + rectange1.attackBox.width >= rectangle2.position.x &&
        rectange1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectange1.attackBox.position.y + rectange1.attackBox.height >= rectangle2.position.y &&
        rectange1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector('#gameResult').style.display = 'flex';
    if (player.health === enemy.health) {
        document.querySelector('#gameResult').innerHTML = 'T I E';
    } else if (player.health > enemy.health) {
        document.querySelector('#gameResult').innerHTML = 'P1 WINS';
    } else if (player.health < enemy.health) {
        document.querySelector('#gameResult').innerHTML = 'P2 WINS';
    }
}

let timer = 60;
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer -= 1;
        document.querySelector('#timer').innerHTML = timer;
    } else {
        determineWinner({ player, enemy, timerId });
    }
}