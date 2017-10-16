var STATE;
(function (STATE) {
    STATE[STATE["DEAD"] = 0] = "DEAD";
    STATE[STATE["ALIVE"] = 1] = "ALIVE";
})(STATE || (STATE = {}));
var detachedContainer = document.createElement('custom');
var dataContainer = d3.select(detachedContainer);
function init() {
    var envX = 100;
    var envY = 100;
    var initAliveRate = 0.3;
    var speed = Math.floor(1000 / 60);
    var base = d3.select('#life');
    var chart = base.append('canvas')
        .attr('width', 600)
        .attr('height', 600);
    var matrix = initData(envX, envY, initAliveRate);
    grid(matrix, envX, envY);
    d3.interval(function () {
        matrix = tick(matrix, envX, envY);
        grid(matrix, envX, envY);
        drawCanvas();
    }, speed);
}
function grid(matrix, envX, envY) {
    var canvas = d3.select('canvas');
    var context = canvas.node().getContext('2d');
    var height = +canvas.attr('height');
    var width = +canvas.attr('width');
    var cellW = +(width / envX);
    var cellH = +(height / envY);
    var row = dataContainer.selectAll('.cell').data(matrix);
    row.exit().remove();
    row.enter().append('custom')
        .classed('cell', true)
        .attr('width', cellW)
        .attr('height', cellH)
        .attr('x', function (d, i) { return getX(i, envX) * cellW; })
        .attr('y', function (d, i) { return getY(i, envX) * cellH; })
        .attr('fillStyle', function (d) { return d === STATE.ALIVE ? "black" : "white"; })
        .merge(row)
        .attr('fillStyle', function (d) { return d === STATE.ALIVE ? "black" : "white"; });
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
function drawCustom(data) {
    var scale = d3.scaleLinear()
        .range([10, 390])
        .domain(d3.extent(data));
    var dataBinding = dataContainer.selectAll('custom.rect')
        .data(data, function (d) { return d; });
    dataBinding
        .attr('size', 8)
        .transition()
        .duration(1000)
        .attr('size', 15)
        .attr('fillStyle', 'green');
    dataBinding.enter()
        .append('custom')
        .classed('rect', true)
        .attr('x', scale)
        .attr('y', 100)
        .attr('fillStyle', 'red')
        .attr('size', 0)
        .transition()
        .duration(1000)
        .attr('size', 8);
    dataBinding.exit()
        .attr('size', 8)
        .transition()
        .duration(1000)
        .attr('size', 5)
        .attr('fillStyle', 'lightgrey');
    // drawCanvas();
}
function drawCanvas() {
    var canvas = d3.select('canvas');
    var context = canvas.node().getContext('2d');
    // let detachedContainer = document.createElement('custom');
    // let dataContainer = d3.select(detachedContainer);
    context.fillStyle = '#fff';
    context.rect(0, 0, canvas.attr('width'), canvas.attr('height'));
    context.fill();
    var elements = dataContainer.selectAll('custom.cell');
    elements.each(function (d) {
        var node = d3.select(this);
        // console.log(`drawing ${d}`);
        context.beginPath();
        context.fillStyle = node.attr('fillStyle');
        context.rect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
        context.fill();
        context.closePath();
    });
}
init();
//# sourceMappingURL=canvas-life.js.map