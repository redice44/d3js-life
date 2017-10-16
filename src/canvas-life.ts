enum STATE {
  DEAD = 0,
  ALIVE
}
  let detachedContainer = document.createElement('custom');
  let dataContainer = d3.select(detachedContainer);

function init() {
  const envX = 100;
  const envY = 100;
  const initAliveRate = 0.3;
  const speed = Math.floor(1000/60);

  let base = d3.select('#life');
  let chart = base.append('canvas')
    .attr('width', 600)
    .attr('height', 600);

  let matrix = initData(envX, envY, initAliveRate);

  grid(matrix, envX, envY);

  d3.interval(() => {
    matrix = tick(matrix, envX, envY);
    grid(matrix, envX, envY);
    drawCanvas()
  }, speed);
}

function grid(matrix, envX, envY) {
  const canvas = d3.select('canvas');
  let context = canvas.node().getContext('2d');


  const height = +canvas.attr('height');
  const width = +canvas.attr('width');
  const cellW = +(width/envX);
  const cellH = +(height/envY);
  let row = dataContainer.selectAll('.cell').data(matrix);
  row.exit().remove();
  row.enter().append('custom')
      // .attr('class', 'cell')
      .classed('cell', true)
      .attr('width', cellW)
      .attr('height', cellH)
      .attr('x', (d, i) => getX(i, envX)*cellW)
      .attr('y', (d, i) => getY(i, envX)*cellH)
      .attr('fillStyle', (d) => d === STATE.ALIVE ? `black` : `white`)
      // .attr('transform', (d, i) => `translate(${getX(i, envX)*cellW}, ${getY(i, envX)*cellH})`)
    .merge(row)
      .attr('fillStyle', (d) => d === STATE.ALIVE ? `black` : `white`);
}

function getX(index: number, width: number): number {
  return index - parseInt(index/width) * width;
}

function getY(index: number, width: number): number {
  return parseInt(index/width);
}

function getIndex(x: number, y: number, width: number): number {
  return y * width + x;
}

function initData(width: number, height: number, initAliveRate: number = 0.5): STATE[] {
  let env = [];
  for (let i = 0; i < height*width; i++) {
    env.push(Math.random() < initAliveRate ? STATE.ALIVE : STATE.DEAD);
  }
  return env;
}

function tick(matrix: STATE[], width: number, height: number): STATE[] {
  return matrix.map((state, i) => cellUpdate(state, sumNeighbors(matrix, i, width, height)));
}

function cellUpdate(state: STATE, aliveNeighbors: number): STATE {
  if (state === STATE.ALIVE) {
    if (aliveNeighbors === 2 || aliveNeighbors === 3) {
      return STATE.ALIVE;
    }
  } else {
    if (aliveNeighbors === 3) {
      return STATE.ALIVE;
    }
  }
  return STATE.DEAD;
}

function sumNeighbors(matrix: STATE[], i: number, width: number, height: number): number {
  return matrix[getUpLeftNeighbor(i, width, height)] +
    matrix[getUpNeighbor(i, width, height)] +
    matrix[getUpRightNeighbor(i, width, height)] +
    matrix[getLeftNeighbor(i, width, height)] +
    matrix[getRightNeightbor(i, width, height)] +
    matrix[getBottomLeftNeighbor(i, width, height)] +
    matrix[getBottomNeighbor(i, width, height)] +
    matrix[getBottomRightNeighbor(i, width, height)];
}

function getTop(i: number, width: number, height: number): number {
  let y = getY(i, width);
  return y === 0 ? height-1 : y-1;
}

function getBottom(i: number, width: number, height: number): number {
  let y = getY(i, width);
  return y === height-1 ? 0 : y+1;
}

function getLeft(i: number, width: number, height: number): number {
  let x = getX(i, width);
  return i === 0 ? width-1 : x-1;
}

function getRight(i: number, width: number, height: number): number {
  let x = getX(i, width);
  return i === width-1 ? 0 : x+1;
}

function getUpLeftNeighbor(i: number, width: number, height: number): number {
  return getIndex(getLeft(i, width, height), getTop(i, width, height), width);
}

function getUpNeighbor(i: number, width: number, height: number): number {
  return getIndex(getX(i, width), getTop(i, width, height), width);
}

function getUpRightNeighbor(i: number, width: number, height: number): number {
  return getIndex(getRight(i, width, height), getTop(i, width, height), width);
}

function getLeftNeighbor(i: number, width: number, height: number): number {
  return getIndex(getLeft(i, width, height), getY(i, width), width);
}

function getRightNeightbor(i: number, width: number, height: number): number {
  return getIndex(getRight(i, width, height), getY(i, width), width);
}

function getBottomLeftNeighbor(i: number, width: number, height: number): number {
  return getIndex(getLeft(i, width, height), getBottom(i, width, height), width);
}

function getBottomNeighbor(i: number, width: number, height: number): number {
  return getIndex(getX(i, width), getBottom(i, width, height), width);
}

function getBottomRightNeighbor(i: number, width: number, height: number): number {
  return getIndex(getRight(i, width, height), getBottom(i, width, height), width);
}

function drawCustom(data) {
  let scale = d3.scaleLinear()
    .range([10, 390])
    .domain(d3.extent(data));

  let dataBinding  = dataContainer.selectAll('custom.rect')
    .data(data, d => d);

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
  const canvas = d3.select('canvas');
  let context = canvas.node().getContext('2d');

  // let detachedContainer = document.createElement('custom');
  // let dataContainer = d3.select(detachedContainer);

  context.fillStyle = '#fff';
  context.rect(0, 0, canvas.attr('width'), canvas.attr('height'));
  context.fill();

  let elements = dataContainer.selectAll('custom.cell');
  elements.each(function(d) {
    let node = d3.select(this);
    // console.log(`drawing ${d}`);

    context.beginPath();
    context.fillStyle = node.attr('fillStyle');
    context.rect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
    context.fill();
    context.closePath();
  });
}

init();