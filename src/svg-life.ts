enum STATE {
  DEAD = 0,
  ALIVE
}

function init() {
  const envX = 100;
  const envY = 100;
  const initAliveRate = 0.3;
  const speed = 200;

  let matrix = initData(envX, envY, initAliveRate);

  grid(matrix, envX, envY);

  d3.interval(() => {
    matrix = tick(matrix, envX, envY);
    grid(matrix, envX, envY);
  }, speed);
}

function grid(matrix, envX, envY) {
  const svg = d3.select('svg');
  const height = +svg.attr('height');
  const width = +svg.attr('width');
  const cellW = +(width/envX);
  const cellH = +(height/envY);
  let row = svg.selectAll('.cell').data(matrix);
  row.exit().remove();
  row.enter().append('rect')
      .attr('class', 'cell')
      .attr('width', cellW)
      .attr('height', cellH)
      .attr('fill', (d) => d === STATE.ALIVE ? `rgb(0, 0, 0)` : `rgb(255, 255, 255)`)
      .attr('transform', (d, i) => `translate(${getX(i, envX)*cellW}, ${getY(i, envX)*cellH})`)
    .merge(row)
      .attr('fill', (d) => d === STATE.ALIVE ? `rgb(0, 0, 0)` : `rgb(255, 255, 255)`);
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

init();