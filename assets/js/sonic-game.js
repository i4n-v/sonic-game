// data`s objects
const sonicMap = document.querySelector('#sonic-map');
const divGameOver = document.querySelector('#game-over');
let type = 1;

const sonic = {
    currentScore: 0,
    previosScore: 0,
    keyToJump: 32,
    isJumping: false,
    position: 150,
    gameOver: false,
    character: () => document.querySelector('.sonic'),
    setPreviosScore (score) {
        if(score > this.previosScore){
            this.previosScore = score;
        }
    }
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
    } else {
        sonic.position -= 20;
        sonic.character().style.bottom = sonic.position + 'px';
    }
}

function jump(e) {
    if (verifyKeyCode(e) && !sonic.isJumping && !sonic.gameOver) {
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



// enemy`s methods
function createEnemy(enemy) {
    enemy.character = document.createElement('div');
    enemy.character.classList.add('enemy');
    enemy.character.style.left = enemy.position + 'px';
    sonicMap.appendChild(enemy.character);

    if(type === 1){
        type = 2;
        enemy.character.style.backgroundImage = "url('../../images/game-objects/robotnic-2.gif')";
    }else {
        type = 1;
        enemy.character.style.backgroundImage = "url('../../images/game-objects/robotnic-1.png')";
    }
}

function enemyWin(interval) {
    clearInterval(interval);
    sonic.gameOver = true;
}

function deleteEnemy(enemy, interval) {
    clearInterval(interval)
    sonicMap.removeChild(enemy.character);
}

function setMoveEnemy(enemy) {
    enemy.position -= 10;
    enemy.character.style.left = enemy.position + 'px';
}

function moveEnemy() {
    if (sonic.gameOver) {
        return
    }

    const enemy = {
        position: 1280,
        character: '',
    }

    let randomTime = Math.random() * 6000;

    createEnemy(enemy);

    let interval = setInterval(() => {
        if (enemy.position < -75) {
            deleteEnemy(enemy, interval);
        } else if (enemy.position > 0 && enemy.position < 65 && sonic.position < 225) {
            enemyWin(interval);
        } else {
            setMoveEnemy(enemy);
        }
    }, 20);

    setTimeout(moveEnemy, randomTime);
}

moveEnemy();

// game functions
function cleanEnemys(enemy) {
    sonicMap.removeChild(enemy);
}

function restartGame () {
    sonic.gameOver = false;
    sonic.currentScore = 0;

    let enemys = document.querySelectorAll('.enemy');
    enemys.forEach(cleanEnemys);
    
    sonicMap.style.animation = 'slideright 600s infinite linear';
    divGameOver.style.display = 'none';

    moveEnemy();
    score();
}

function verifyGameOver() {
    sonicMap.style.animation = 'none';
    divGameOver.style.display = 'flex';

    let previosScore = document.querySelector('#previos-score');
    previosScore.innerHTML = 'Pontuação máxima: ' + sonic.previosScore;

    let currentScore = document.querySelector('#current-score');
    currentScore.innerHTML = 'Pontuação atual: ' + sonic.currentScore;

    let restartBtn = document.querySelector('.fas');
    restartBtn.addEventListener('click', restartGame);
}

function score() {
    let points = document.querySelector('.points');
    
    let addScore = setInterval(()=>{
        if(!sonic.gameOver){
            sonic.currentScore += 1;
            points.innerHTML = sonic.currentScore;
        }else{
            clearInterval(addScore)
            sonic.setPreviosScore(sonic.currentScore);
            verifyGameOver();
        }
    }, 150)
}

score();

// events
document.addEventListener('keyup', jump);