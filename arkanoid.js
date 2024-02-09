let canvas = document.getElementById("CanvasElem"); //ссылка на canvas элемент
let ctx = canvas.getContext("2d"); // инструмент, для рисования на холсте (хранит контекст 2D-рендеринга)

let ballRadius = 10; // настройки мяча
let x = canvas.width/2;
let y = canvas.height-30;

let dx = 5; // скорость по x
let dy = -5; // скорость по y

let paddleHeight = 10; // настройки весла
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;

let rightPressed = false; // определение нажатий
let leftPressed = false;

let brickRowCount = 8; // настройка кирпичей
let brickColumnCount = 3; 
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let score = 0; // статистика
let lives = 3;

let bricks = []; // выставление status = 1 для отображения кирпичей
for(let i=0; i<brickColumnCount; i++) {
    bricks[i] = [];
    for(let j=0; j<brickRowCount; j++) {
         bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) { // проверка на нажатие (нажата)
    if(e.code == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.code == 'ArrowLeft') {
        leftPressed = true;
    }
}
function keyUpHandler(e) { // проверка на нажатие (отжата)
    if(e.code == 'ArrowRight') {
        rightPressed = false;
    }
    else if(e.code == 'ArrowLeft') {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {// перемещение весла мышкой
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
function collisionDetection() { // разбитие кирпичей status = 0
    for(let i=0; i<brickColumnCount; i++) {
        for(let j=0; j<brickRowCount; j++) {
            let b = bricks[i][j];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall() { // рендер мяча
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0341c7";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() { // рендер весла
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0341c7";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() { // рендер кирпичей
    for(let i=0; i<brickColumnCount; i++) {
        for(let j=0; j<brickRowCount; j++) {
            if(bricks[i][j].status == 1) {
                let brickX = (j*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (i*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0341c7";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() { // счет
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0341c7";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() { // жизни
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0341c7";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() { // функция прорисовки всего
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) { // столкновение c боковыми
        dx = -dx;
    }
    if(y + dy < ballRadius) { // столкновение c верхней
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) { 
        if(x > paddleX && x < paddleX + paddleWidth) { // столкновение c веслом
            dy = -dy;
        }
        else { // мертвая зона
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 5;
                dy = -5;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) { // перемещение весла вправо
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) { // перемещение весла влево
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();