const SQ_SIZE = 15;
const FILL_SIZE = 10;

let pg;
let pg_visited;
let pg_o; // occupied fields

let maxi, maxj;

const STATE_NULL = 0;
const DRAW_ENV = 1
const SET_START = 2;
const SET_TARGET = 3;
const COMPUTING = 4;
const FINISHED = 5;

const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

let state = STATE_NULL;

let mouse_idx;

let start, traget;
let finished = false;
let convert;
let search;
let path = [];

let obst; // obstacles

const M_UNKOWN = 0;
const M_ASTAR = 1;
const M_BREADTH = 2;
let method = M_UNKOWN;


function setup() {
  createCanvas(600, 600);

  pg = createGraphics(600, 600);
  pg.background(255);

  pg.fill(0, 200, 0, 120);
  pg.noStroke();
  for(let i=0; i < width; i += SQ_SIZE) {
    pg.rect(i+FILL_SIZE/4, 0, FILL_SIZE, height);
  }
  for(let j=0; j < height; j += SQ_SIZE) {
    pg.rect(0, j+FILL_SIZE/4, width, FILL_SIZE);
  }

  maxi = floor(width / SQ_SIZE) - 1;
  maxj = floor(height / SQ_SIZE) - 1;

  convert = new Converter(maxi+1);

  cursor(CROSS);

  obst = [];
  pg_o = createGraphics(width, height);
  pg_visited = createGraphics(width, height);
}

function draw() {
  image(pg, 0, 0);
  image(pg_o, 0, 0);
  image(pg_visited, 0, 0);

  mouse_idx = getIdx(mouseX, mouseY);

  noFill();
  stroke(255, 0, 0);
  drawRect(mouse_idx.i, mouse_idx.j);

  if(state == SET_START) {
    drawStateStart();
  } else if (state == DRAW_ENV) {
    drawStateEnv();
  } else if (state == SET_TARGET) {
    drawStateTarget();
  } else if (state == COMPUTING) {
    compute();
    drawStateComputing();
  } else if (state == FINISHED) {
    drawStateFinished();
  } else {
    state = DRAW_ENV;
  }

  if (state == COMPUTING && finished) {
    state = FINISHED;
    finished = false;
  }
}

function init_search() {
  search = new Search(maxi+1,maxj+1, convert);
  search.setStart(start.i, start.j);
  search.setTarget(target.i, target.j);
  for(let o of obst) {
    search.setOccupied(o.i, o.j);
  }
  if(method == M_ASTAR) {
    let a = new A_Star(target, convert, 1000);
    search.setSelectFun(a.select);
  }
  path = [];
}

function compute() {
  result = search.step();
  if(result.done || search.count > 1600) {
    finished = true;
    if(result.value !== undefined)
      path = result.value;
    else
      path = [];
  }
}

function drawStateEnv() {
  stroke(0, 100, 255);
  noFill();
  textAlign(CENTER);
  textSize(30);
  text("Draw Obstacles!", width/2, height-100);
  text("Start Search: A - A*, B - Breadth First", width/2, height-50);
}

function drawStateStart() {
  stroke(0, 100, 255);
  noFill();
  textAlign(CENTER);
  textSize(30);
  text("Click to set start!", width/2, height-100);
}

function drawStateTarget() {
  stroke(0, 100, 255);
  noFill();
  textAlign(CENTER);
  textSize(30);
  text("Click to set target!", width/2, height-100);

  fill(255, 0, 0);
  stroke(0);
  drawRect(start.i, start.j);
}

function drawStateComputing() {
  stroke(0, 100, 255);
  noFill();
  textAlign(CENTER);
  textSize(30);
  text("Computing", width/2, height-100);
  text(search.count, width/2, height-50);

  fill(255, 0, 0);
  stroke(0);
  drawRect(start.i, start.j);
  fill(0, 0, 255);
  stroke(0);
  drawRect(target.i, target.j);

  if(search.current) {
    fill(0, 0, 255, 150);
    stroke(255, 0, 0);
    drawRect(search.current.i, search.current.j);
  }

  for(let ij of search.just_visited) {
    pg_visited.fill(255, 255, 0, 150);
    pg_visited.noStroke();
    pg_visited.rectMode(CORNER);
    pg_visited.rect(ij.i*SQ_SIZE, ij.j*SQ_SIZE, SQ_SIZE, SQ_SIZE);
  }
}

function drawStateFinished() {
  stroke(255, 100, 100);
  fill(255, 255, 0);
  textAlign(CENTER);
  textSize(30);
  text("Click to start again!", width/2, height-100);

  for(let ij of path) {
    fill(0,255,255);
    stroke(255,255,0);
    drawRect(ij.i, ij.j);
  }

  fill(255, 0, 0);
  stroke(0);
  drawRect(start.i, start.j);
  fill(0, 0, 255);
  stroke(0);
  drawRect(target.i, target.j);
}

function mouseClicked() {
  if(state == SET_START) {
    start = mouse_idx;
    state = SET_TARGET;
  } else if(state == SET_TARGET) {
    target = mouse_idx;
    state = COMPUTING;
    init_search();
  } else if (state == FINISHED) {
    pg_o = createGraphics(width, height);
    obst = [];
    pg_visited = createGraphics(width, height);
    state = DRAW_ENV;
  }
}

function keyReleased() {
  if(state == DRAW_ENV) {
    print(key);
    if(key == 'A' || key == 'a') {
      method = M_ASTAR;
    } else if(key =='B' || key == 'b') {
      method = M_BREADTH;
    } else {
      method = M_UNKOWN;
    }
    if(method != M_UNKOWN) {
      state = SET_START;
      return false;
    }
  }
}

function mouseDragged(){
  if(state == DRAW_ENV) {
    pg_o.fill(0);
    pg_o.noStroke(0);
    pg_o.rectMode(CORNER);
    pg_o.rect(mouse_idx.i*SQ_SIZE, mouse_idx.j*SQ_SIZE, SQ_SIZE, SQ_SIZE);
    obst.push(mouse_idx);
  }
}

function getIdx(x, y) {
  let i = floor(x / SQ_SIZE);
  let j = floor(y / SQ_SIZE);

  i = constrain(i, 0, maxi);
  j = constrain(j, 0, maxj);

  return { i: i, j: j};
}

function drawRect(i, j) {
  rectMode(CORNER);
  rect(i*SQ_SIZE, j*SQ_SIZE, SQ_SIZE, SQ_SIZE);
}
