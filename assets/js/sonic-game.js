// data`s objects
const sonicMap = document.querySelector('#sonic-map');

const sonic = {
    keyToJump: 32,
    isJumping: false,
    position: 150,
    gameOver: false,
    character: () => document.querySelector('.sonic'),
}

//sonic`s methods 
const verifyKeyCode = event => event.keyCode === sonic.keyToJump;

function up() {
    sonic.position += 20;
    sonic.character().style.bottom = sonic.position + 'px';
    sonic.character().style.backgroundImage = 'url("../../images/game-objects/sonic-ball.gif")';
    sonic.character().style.backgroundSize = '65%';
}

function down(interval) {
    if (sonic.position <= 150) {
        clearInterval(interval);
        sonic.character().style.backgroundImage = 'url("../../images/game-objects/sonic.gif")';
        sonic.character().style.backgroundSize = '100%';
        sonic.isJumping = false;
    }else {
        sonic.position -= 20;
        sonic.character().style.bottom = sonic.position + 'px';
    }
}

function jump(e) {
    if (verifyKeyCode(e) && !sonic.isJumping) {
        sonic.isJumping = true;

        let upInterval = setInterval(() => {
            if (sonic.position >= 300) {
                clearInterval(upInterval);

                let downInterval = setInterval(() => {
                    down(downInterval);
                }, 30);
            } else {
                up();
            }
        }, 30);
    }
}

function verifyGameOver() {
    let gameOverDisplay = document.querySelector('#game-over');
    gameOverDisplay.style.display = 'block';
}

// enemy`s methods
function createEnemy(enemy) {
    enemy.character = document.createElement('div');
    enemy.character.classList.add('enemy');
    enemy.character.style.left = enemy.position + 'px';
    sonicMap.appendChild(enemy.character);
}

function deleteEnemy(enemy, interval) {
    clearInterval(interval)
    sonicMap.removeChild(enemy.character);
}

function enemyWin(interval) {
        clearInterval(interval);
        sonic.gameOver = true;
}

function setMoveEnemy(enemy) {
    enemy.position -= 10;
    enemy.character.style.left = enemy.position + 'px';
}

function moveEnemy() {
    const enemy = {
        position: 1280,
        character: '',
    }

    if(sonic.gameOver) {
        //verifyGameOver();
        console.log('fail')
        return
    } 
    
    let randomTime = Math.random() * 6000;

    createEnemy(enemy);

    let interval = setInterval(() => {
        if (enemy.position < -75) {
            deleteEnemy(enemy, interval);
        }else if (enemy.position > 0 && enemy.position < 75 && sonic.position < 75) {
            enemyWin(interval);
        }else {
            setMoveEnemy(enemy);
        }
    }, 20);

    setTimeout(moveEnemy, randomTime);
}

moveEnemy();

// events
document.addEventListener('keyup', jump);