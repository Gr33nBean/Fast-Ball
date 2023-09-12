
let game = {
    square: 0,
    paddingX: 0,
    paddingY: 0,
    board: {
        obj: null,
        def_width: 0,
        def_height: 0
    },
    context: null,
    ball: {
        obj: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        },
        def_x: 0,
        def_y: 0,
        def_width: 0,
        def_height: 0,
        img: null,
        vX: 0,
        vY: 0,
        direct: null, // up/down
        side: null, // left/right
        index: null, // 1/2/3/4/5
        timeToMove: 0
    },
    grayRect: {
        obj_array: [], // {x,y,width,height,hide}
        def_x: 0,
        def_y: 0,
        def_width: 0,
        def_height: 0,
        img: null,
        spaceX: 0,
        spaceY: 0
    },
    whiteRect: {
        obj: {
            x: 0,
            y: 0,
            index: 1,
            side: 'right',
            width: 0,
            height: 0,
            hide: false
        },
        def_x: 0,
        def_y: 0,
        def_width: 0,
        def_height: 0,
        img: null,
    },
    blackSquare: {
        obj_array: [], // {x,y,width,height,side}
        def_x: 0,
        def_y: 0,
        def_width: 0,
        def_height: 0,
        img: null,
        vX: 0,
    },
    score: 0,
    gameOver: false
}

window.onload = function () {

    game.square = 24;
    game.paddingX = game.square * 2;
    game.paddingY = game.square / 3 + 4 * game.square;

    game.board.def_width = game.square * 20; //360
    game.board.def_height = 640;
    game.board.obj = document.getElementById("board");
    game.board.obj.height = game.board.def_height;
    game.board.obj.width = game.board.def_width;

    game.context = game.board.obj.getContext("2d");

    game.ball.def_width = game.square;
    game.ball.def_height = game.square;
    game.ball.def_x = game.paddingX + 3 * game.square;
    game.ball.def_y = game.paddingY;
    game.ball.vY = 0;
    game.ball.direct = 'up';
    game.ball.side = 'left';
    game.ball.index = 1;
    game.ball.timeToMove = 48;
    game.ball.vX = game.paddingX / 12;

    game.ball.obj = {
        x: game.ball.def_x,
        y: game.ball.def_y,
        width: game.ball.def_width,
        height: game.ball.def_height
    }

    game.ball.img = new Image();
    game.ball.img.src = "./greenCircle.png";

    game.ball.img.onload = function () {
        game.context.drawImage(game.ball.img, game.ball.obj.x, game.ball.obj.y, game.ball.obj.width, game.ball.obj.height);
    }

    game.grayRect.obj_array = [];
    game.grayRect.def_x = game.paddingX;
    game.grayRect.def_y = game.paddingY;
    game.grayRect.def_width = 3 * game.square;
    game.grayRect.def_height = game.square;
    game.grayRect.spaceX = 10 * game.square;
    game.grayRect.spaceY = 3 * game.square;
    game.grayRect.img = new Image();
    game.grayRect.img.src = "./graySquare.jpg";
    addGrayRect();
    game.grayRect.img.onload = function () {
        for (let i = 0; i < game.grayRect.obj_array.length; i++) {
            if (!game.grayRect.obj_array[i].hide) {
                game.context.drawImage(game.grayRect.img, game.grayRect.obj_array[i].x, game.grayRect.obj_array[i].y, game.grayRect.obj_array[i].width, game.grayRect.obj_array[i].height);
            }
        }
    }

    let defWhiteRect_index = game.grayRect.obj_array.findIndex(item => item.index == 1 && item.side == 'right');
    game.grayRect.obj_array[defWhiteRect_index].hide = true;

    game.whiteRect.def_x = game.grayRect.obj_array[defWhiteRect_index].x;
    game.whiteRect.def_y = game.grayRect.obj_array[defWhiteRect_index].y;
    game.whiteRect.def_width = game.grayRect.def_width;
    game.whiteRect.def_height = game.grayRect.def_height;

    game.whiteRect.obj = {
        x: game.whiteRect.def_x,
        y: game.whiteRect.def_y,
        width: game.whiteRect.def_width,
        height: game.whiteRect.def_height,
        hide: false,
        index: 1,
        side: 'right'
    }
    game.whiteRect.img = new Image();
    game.whiteRect.img.src = "./whitesquare.jpg";

    game.whiteRect.img.onload = function () {
        game.context.drawImage(game.whiteRect.img, game.whiteRect.obj.x, game.whiteRect.obj.y, game.whiteRect.obj.width, game.whiteRect.obj.height);
    }

    game.blackSquare.obj_array = [];
    game.blackSquare.def_x = 0;
    game.blackSquare.def_y = game.paddingY + 2 * game.square;
    game.blackSquare.def_width = game.square;
    game.blackSquare.def_height = game.square;
    game.blackSquare.vX = 6;
    game.blackSquare.img = new Image();
    game.blackSquare.img.src = "./blacksquare.jpg";

    game.score = 0;
    game.gameOver = false;


    requestAnimationFrame(update);
    setInterval(placeBlackSquare, 1500); //every 1.5 seconds
    document.addEventListener("keydown", moveBall);
    // document.addEventListener("keyup", stopGreenSquare);



}

function update() {
    requestAnimationFrame(update);
    if (game.gameOver) {
        return;
    }
    game.context.clearRect(0, 0, game.board.def_width, game.board.def_height);

    // ball
    game.ball.obj.x += game.ball.vX;
    game.ball.obj.y += game.ball.vY;

    if (game.ball.obj.x > game.grayRect.def_x + game.grayRect.def_width + game.grayRect.spaceX) {
        game.ball.obj.x = game.grayRect.def_x + game.grayRect.def_width + game.grayRect.spaceX
    } else if (game.ball.obj.x < game.grayRect.def_x + game.grayRect.def_width) {
        game.ball.obj.x = game.grayRect.def_x + game.grayRect.def_width
    }
    game.context.drawImage(game.ball.img, game.ball.obj.x, game.ball.obj.y, game.ball.obj.width, game.ball.obj.height);


    // gray Rect
    for (let i = 0; i < game.grayRect.obj_array.length; i++) {
        let square = game.grayRect.obj_array[i];
        if (!square.hide) {
            game.context.drawImage(game.grayRect.img, square.x, square.y, square.width, square.height);
        }

        if (!square.hide && detectCollision(game.ball.obj, square)) {
            let direct = game.ball.direct;
            let side = game.ball.side;
            var index = game.ball.index;

            game.ball.side = side == 'left' ? 'right' : 'left';

            if (direct == 'up') {
                game.ball.direct = 'up';
                game.ball.index = index - 1;
            } else {
                game.ball.direct = 'down';
                game.ball.index = index + 1;
            }
            if (game.ball.index > 5) {
                game.ball.index = 5
                game.ball.direct = 'up';
            }
            if (game.ball.index < 1) {
                game.ball.index = 1
                game.ball.direct = 'down';
            }
            let pointA = getPoint(game.ball.side, game.ball.index);

            if (game.ball.direct == 'up') {
                direct = 'up';
                index = game.ball.index - 1;
            } else {
                direct = 'down';
                index = game.ball.index + 1;
            }
            if (index > 5) {
                index = 5
                direct = 'up';
            }
            if (index < 1) {
                index = 1
                direct = 'down';
            }
            let pointB = getPoint(side, index);

            let vX_vY = getVx_Vy(pointA, pointB, direct, side);
            game.ball.vX = vX_vY.vX;
            game.ball.vY = vX_vY.vY;
        }
    }

    //white Rect
    if (!game.whiteRect.obj.hide) {
        game.context.drawImage(game.whiteRect.img, game.whiteRect.obj.x, game.whiteRect.obj.y, game.whiteRect.obj.width, game.whiteRect.obj.height);
    }
    if (!game.whiteRect.obj.hide && detectCollision(game.ball.obj, game.whiteRect.obj)) {
        let direct = game.ball.direct;
        let side = game.ball.side;
        var index = game.ball.index;

        game.ball.side = side == 'left' ? 'right' : 'left';

        if (direct == 'up') {
            game.ball.direct = 'up';
            game.ball.index = index - 1;
        } else {
            game.ball.direct = 'down';
            game.ball.index = index + 1;
        }
        if (game.ball.index > 5) {
            game.ball.index = 5
            game.ball.direct = 'up';
        }
        if (game.ball.index < 1) {
            game.ball.index = 1
            game.ball.direct = 'down';
        }
        let pointA = getPoint(game.ball.side, game.ball.index);

        if (game.ball.direct == 'up') {
            direct = 'up';
            index = game.ball.index - 1;
        } else {
            direct = 'down';
            index = game.ball.index + 1;
        }
        if (index > 5) {
            index = 5
            direct = 'up';
        }
        if (index < 1) {
            index = 1
            direct = 'down';
        }
        let pointB = getPoint(side, index);

        let vX_vY = getVx_Vy(pointA, pointB, direct, side);
        game.ball.vX = vX_vY.vX;
        game.ball.vY = vX_vY.vY;

        game.score++;
        randomPositionWhiteRect();
    }

    // black squares
    for (let i = 0; i < game.blackSquare.obj_array.length; i++) {
        let black = game.blackSquare.obj_array[i];

        if (black.side == 'left') {
            black.x += game.blackSquare.vX;
        } else {
            black.x -= game.blackSquare.vX;
        }
        game.context.drawImage(game.blackSquare.img, black.x, black.y, black.width, black.height);
        if (detectCollision(game.ball.obj, black)) {
            game.gameOver = true;
        }
    }


    //clear black squares
    while (game.blackSquare.obj_array.length > 0 && game.blackSquare.obj_array[0].side == 'right' && game.blackSquare.obj_array[0].x <= 0 - game.blackSquare.def_width) {
        game.blackSquare.obj_array.shift(); //removes first element from the array
    }
    while (game.blackSquare.obj_array.length > 0 && game.blackSquare.obj_array[0].side == 'left' && game.blackSquare.obj_array[0].x > game.board.def_width) {
        game.blackSquare.obj_array.shift(); //removes first element from the array
    }

    //score
    game.context.fillStyle = "yellow";
    game.context.font = "45px sans-serif";
    game.context.fillText(game.score, 5, 45);

    game.context.font = "20px sans-serif";
    game.context.fillText("Press → to play!", 55, 45);

    if (game.gameOver) {
        game.context.font = "45px sans-serif";
        game.context.fillText("GAME OVER", 5, 90);
        game.context.font = "20px sans-serif";
        game.context.fillText("Press Space to play again!", 5, 120);

    }
}

function addGrayRect() {
    for (let i = 0; i < 5; i++) {
        game.grayRect.obj_array.push({
            index: i + 1,
            side: 'left',
            x: game.grayRect.def_x,
            y: game.grayRect.def_y + i * (game.grayRect.def_height + game.grayRect.spaceY),
            width: game.grayRect.def_width,
            height: game.grayRect.def_height,
            hide: false
        });
    }

    for (let i = 0; i < 5; i++) {
        game.grayRect.obj_array.push({
            index: i + 1,
            side: 'right',
            x: game.grayRect.def_x + game.grayRect.def_width + game.grayRect.spaceX,
            y: game.grayRect.def_y + i * (game.grayRect.def_height + game.grayRect.spaceY),
            width: game.grayRect.def_width,
            height: game.grayRect.def_height,
            hide: false
        });
    }

}

function randomPositionWhiteRect() {

    game.whiteRect.obj.hide = true;
    let i = game.grayRect.obj_array.findIndex(element => element.hide);
    game.grayRect.obj_array[i].hide = false;

    let randomIndex = Math.floor(Math.random() * 5) + 1;
    let randomSide = Math.floor(Math.random() * 2) == 0 ? 'left' : 'right';

    i = game.grayRect.obj_array.findIndex(element => element.index == randomIndex && element.side == randomSide);
    game.grayRect.obj_array[i].hide = true;
    game.whiteRect.obj = {
        x: game.grayRect.obj_array[i].x,
        y: game.grayRect.obj_array[i].y,
        width: game.grayRect.obj_array[i].width,
        height: game.grayRect.obj_array[i].height,
        hide: false,
        index: randomIndex,
        side: randomSide
    };
    game.whiteRect.obj.hide = false;
}

function getPoint(side, index) {
    let i = game.grayRect.obj_array.findIndex(element => element.side == side && element.index == index);
    let point = {
        x: 0, y: 0
    }
    if (side == 'left') {
        point.x = game.grayRect.obj_array[i].x + game.grayRect.obj_array[i].width;
        point.y = game.grayRect.obj_array[i].y;
    } else {
        point.x = game.grayRect.obj_array[i].x - game.ball.def_width;
        point.y = game.grayRect.obj_array[i].y;
    }
    return point;
}

function getVx_Vy(pointA, pointB, direct, side) {
    let x = Math.abs(pointB.x - pointA.x);
    let y = Math.abs(pointB.y - pointA.y);
    let vx = x / game.ball.timeToMove;
    let vy = y / game.ball.timeToMove;

    if (direct == 'up') {
        vy = -1 * vy;
    }

    if (side == 'left') {
        vx = -1 * vx;
    }
    return {
        vX: vx,
        vY: vy
    }
}

function placeBlackSquare() {
    if (game.gameOver) {
        return;
    }

    let randomIndex = Math.floor(Math.random() * 3) + 1;
    let randomSide = Math.floor(Math.random() * 2);


    let blackSquare = {
        img: game.blackSquare.img,
        x: randomSide == 0 ? (-1) * game.blackSquare.def_width : game.board.def_width + game.blackSquare.def_width,
        y: game.paddingY + (4 * randomIndex - 2) * game.square,
        width: game.blackSquare.def_width,
        height: game.blackSquare.def_height,
        side: randomSide == 0 ? 'left' : 'right'
    }

    game.blackSquare.obj_array.push(blackSquare);
}

function moveBall(e) {
    //reset game
    if (game.gameOver && e.code == "Space") {

        game.ball.vX = 3;
        game.ball.vY = 0;
        game.ball.direct = 'up';
        game.ball.side = 'left';
        game.ball.index = 1;

        game.ball.obj = {
            x: game.ball.def_x,
            y: game.ball.def_y,
            width: game.ball.def_width,
            height: game.ball.def_height
        }

        game.whiteRect.obj = {
            x: game.whiteRect.def_x,
            y: game.whiteRect.def_y,
            width: game.whiteRect.def_width,
            height: game.whiteRect.def_height,
            hide: false,
            index: 1,
            side: 'right'
        }

        for (let i = 0; i < game.grayRect.obj_array.length; i++) {
            let gray = game.grayRect.obj_array[i];
            game.grayRect.obj_array[i].hide = false;
            if (gray.index == game.whiteRect.obj.index && gray.side == game.whiteRect.obj.side) {
                game.grayRect.obj_array[i].hide = true;
            }
        }

        game.blackSquare.obj_array = [];

        game.score = 0;
        game.gameOver = false;
    }
    if (e.code == 'ArrowRight') {
        let direct = game.ball.direct;
        let side = game.ball.side;
        var index = game.ball.index;

        game.ball.side = side == 'left' ? 'right' : 'left';

        if (direct == 'up') {
            game.ball.direct = 'down';
            game.ball.index = index - 1;
        } else {
            game.ball.direct = 'up';
            game.ball.index = index + 1;
        }
        if (game.ball.index > 5) {
            game.ball.index = 5
            game.ball.direct = 'down';
        }
        if (game.ball.index < 1) {
            game.ball.index = 1
            game.ball.direct = 'up';
        }
        game.ball.vX = -1 * game.ball.vX;
        game.ball.vY = -1 * game.ball.vY;
    }
}

function detectCollision(a, b) {
    return a.x <= b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width >= b.x &&   //a's top right corner passes b's top left corner
        a.y <= b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height >= b.y;    //a's bottom left corner passes b's top left corner
}