const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let map = [];
let figures = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1],
        [1],
        [1],
        [1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    [
        [0, 1],
        [0, 1],
        [1, 1]
    ],
    [
        [1, 1, 1],
        [0, 1, 0]
    ]
];
let figure;
let newFigure = [];
let y = 0;
let x = 0;

for (let i = 0; i < 21; i++) {
    map.push([]);
    for(let j = 0; j < 12; j++) {
        map[i].push(i === 20 || j === 0 || j === 11 ? 1 : 0);
    }
}

let cellSize = 50

function drawMap() {
    for (let i = 0; i < 21; i++) {
        for (let j = 0; j < 12; j++) {
            ctx.fillStyle = map[i][j] === 1 ? 'gray' : 'black';
            ctx.fillRect(j  * cellSize + 900, i * cellSize + 100, cellSize, cellSize);
        }
    }
    ctx.fillStyle = 'gray'

    for (let i = 0; i < figure.length; i++) {
        for (let j = 0; j < figure[i].length; j++) {
            if (figure[i][j] === 1) {            
                ctx.fillRect((x + j) * cellSize + 900, (y + i) * cellSize + 100, cellSize, cellSize);
            }
        }
    }
    
}

  
function addFigure() {
    for (let i = 0; i < figure.length; i++) {
        for (let j = 0; j < figure[i].length; j++) {
            if (figure[i][j] === 1) {
                map[y + i][x + j] = figure[i][j];
            }
        }
    }
}

function removeFigure() {
    for (let i = 0; i < figure.length; i++) {
        for (let j = 0; j < figure[i].length; j++) {
            map[y + i][x + j] = 0;
        }
    }
}

function spawnFigure(i) {
    if (i === undefined) i = Math.floor(Math.random() * figures.length);
    y = 0;
    x = 5;
    figure = figures[i];
}

function touchMap(x, y, figuree = figure) {
    for (let i = 0; i < figuree.length; i++) {
        for (let j = 0; j < figuree[0].length; j++) {
            if (figuree[i][j] === 1 && map[y + i][x + j] === 1) {
                return true;
            }
        }
    }

    return false;
}

function move(dir) {
    if (touchMap(x + dir, y)) return;

    x += dir;
}

function turn(dir) {
    for (let i = 0; i < figure[0].length; i++) {
        newFigure.push([]);
    }

    if (dir === 'right') {
        for (let i = figure.length - 1; i >= 0; i--) {
            for (let j = 0; j < figure[0].length; j++) {
                newFigure[j].push(figure[i][j]);
                
            }   
        }
    }

    if (dir === 'left') {
        for (let i = figure[0].length - 1; i >= 0; i--) {
            for (let j = 0; j < figure.length; j++) {
                newFigure[figure[0].length - 1 - i].push(figure[j][i]);
                
            }   
        }
    }

    if (!touchMap(x, y, newFigure))figure = newFigure;
    newFigure = [];
}

function deleteLine(i) {
    map.splice(i, 1);
    map.unshift([...map[0]]);
}

function tick(i) {
    if (touchMap(x, y + 1)) {
        addFigure();
        spawnFigure(i);

        for (let i = 0; i < map.length - 1; i++) {
            let sum = 0;
            for (let j = 0; j < map[i].length; j++) {
                sum += map[i][j];
                // console.log('aaaa');
            }
            console.log(map[i]);
            console.log(i, sum);
            if (sum === 12) {
                deleteLine(i);
                // break;
            }
        }

        return;
    }

    y++;
}

spawnFigure(1);

document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'a': move(-1);
            break;
        case 'd': move(1);
            break;
        case 'q': turn('left');
            break;
        case 'e': turn('right');
            break;
        case 's': tick();
            break;
    }
})

setInterval(tick, 500);

// for (let i = 0; i < 1; i++) tick();
// for (let i = 0; i < 1; i++) tick();
// for (let i = 0; i < 20; i++) move(-1);
// // for (let i = 0; i < 10; i++) move(-1);
// // for (let i = 0; i < 0; i++) move(1);
// for (let i = 0; i < 20; i++) tick();
// for (let i = 0; i < 20; i++) tick();

// console.log(map);
// deleteLine(0);

setInterval(drawMap, 100);