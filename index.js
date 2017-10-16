var STATE;
(function (STATE) {
    STATE[STATE["DEAD"] = 0] = "DEAD";
    STATE[STATE["ALIVE"] = 1] = "ALIVE";
})(STATE || (STATE = {}));
function init() {
    var envX = 100;
    var envY = 100;
    var initAliveRate = 0.3;
    var speed = 200;
    var matrix = initData(envX, envY, initAliveRate);
    grid(matrix, envX, envY);
    d3.interval(function () {
        matrix = tick(matrix, envX, envY);
        grid(matrix, envX, envY);
    }, speed);
}
function grid(matrix, envX, envY) {
    var svg = d3.select('svg');
    var height = +svg.attr('height');
    var width = +svg.attr('width');
    var cellW = +(width / envX);
    var cellH = +(height / envY);
    var row = svg.selectAll('.cell').data(matrix);
    row.exit().remove();
    row.enter().append('rect')
        .attr('class', 'cell')
        .attr('width', cellW)
        .attr('height', cellH)
        .attr('fill', function (d) { return d === STATE.ALIVE ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)"; })
        .attr('transform', function (d, i) { return "translate(" + getX(i, envX) * cellW + ", " + getY(i, envX) * cellH + ")"; })
        .merge(row)
        .attr('fill', function (d) { return d === STATE.ALIVE ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)"; });
}
function getX(index, width) {
    return index - parseInt(index / width) * width;
}
function getY(index, width) {
    return parseInt(index / width);
}
function getIndex(x, y, width) {
    return y * width + x;
}
function initData(width, height, initAliveRate) {
    if (initAliveRate === void 0) { initAliveRate = 0.5; }
    var env = [];
    for (var i = 0; i < height * width; i++) {
        env.push(Math.random() < initAliveRate ? STATE.ALIVE : STATE.DEAD);
    }
    return env;
}
function tick(matrix, width, height) {
    return matrix.map(function (state, i) { return cellUpdate(state, sumNeighbors(matrix, i, width, height)); });
}
function cellUpdate(state, aliveNeighbors) {
    if (state === STATE.ALIVE) {
        if (aliveNeighbors === 2 || aliveNeighbors === 3) {
            return STATE.ALIVE;
        }
    }
    else {
        if (aliveNeighbors === 3) {
            return STATE.ALIVE;
        }
    }
    return STATE.DEAD;
}
function sumNeighbors(matrix, i, width, height) {
    return matrix[getUpLeftNeighbor(i, width, height)] +
        matrix[getUpNeighbor(i, width, height)] +
        matrix[getUpRightNeighbor(i, width, height)] +
        matrix[getLeftNeighbor(i, width, height)] +
        matrix[getRightNeightbor(i, width, height)] +
        matrix[getBottomLeftNeighbor(i, width, height)] +
        matrix[getBottomNeighbor(i, width, height)] +
        matrix[getBottomRightNeighbor(i, width, height)];
}
function getTop(i, width, height) {
    var y = getY(i, width);
    return y === 0 ? height - 1 : y - 1;
}
function getBottom(i, width, height) {
    var y = getY(i, width);
    return y === height - 1 ? 0 : y + 1;
}
function getLeft(i, width, height) {
    var x = getX(i, width);
    return i === 0 ? width - 1 : x - 1;
}
function getRight(i, width, height) {
    var x = getX(i, width);
    return i === width - 1 ? 0 : x + 1;
}
function getUpLeftNeighbor(i, width, height) {
    return getIndex(getLeft(i, width, height), getTop(i, width, height), width);
}
function getUpNeighbor(i, width, height) {
    return getIndex(getX(i, width), getTop(i, width, height), width);
}
function getUpRightNeighbor(i, width, height) {
    return getIndex(getRight(i, width, height), getTop(i, width, height), width);
}
function getLeftNeighbor(i, width, height) {
    return getIndex(getLeft(i, width, height), getY(i, width), width);
}
function getRightNeightbor(i, width, height) {
    return getIndex(getRight(i, width, height), getY(i, width), width);
}
function getBottomLeftNeighbor(i, width, height) {
    return getIndex(getLeft(i, width, height), getBottom(i, width, height), width);
}
function getBottomNeighbor(i, width, height) {
    return getIndex(getX(i, width), getBottom(i, width, height), width);
}
function getBottomRightNeighbor(i, width, height) {
    return getIndex(getRight(i, width, height), getBottom(i, width, height), width);
}
init();
//# sourceMappingURL=index.js.map