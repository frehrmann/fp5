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
let search;
let path = [];

let obst; // obstacles

function Cell() {
  this.visited = false;
  this.occupied = false;
  this.visited_from = 0;
}

Cell.prototype.setVisited = function() {
  this.visited = true;
}

Cell.prototype.setOccupied = function() {
  this.occupied = true;
}

Cell.prototype.setFrom = function(from_idx) {
  this.visited_from = from_idx;
}

Cell.prototype.isVisited = function() {
  return this.visited;
}

Cell.prototype.isOccupied = function() {
  return this.occupied;
}

Cell.prototype.getFrom = function() {
  return this.visited_from;
}


function Node(idx) {
  this.idx = idx;
  this.pre = undefined;
  this.next = undefined;
}

function SearchList() {
  this.root = undefined;
  this.end = undefined;
  this.length = 0;
}

SearchList.prototype.push = function(idx) {
  let n = new Node(idx);
  if(this.root === undefined) {
    this.root = n;
    this.end = n;
  } else {
    this.end.next = n;
    n.pre = this.end;
    this.end = n;
  }
  this.length += 1;
}

SearchList[Symbol.iterator] = function(){
  return {
    ptr: this.root,

     next : function () {
       if(ptr === undefined) {
         return {done: true, value: undefined};
       } else {
         let value = ptr;
         ptr = ptr.next;
         return {done: false, value: value};
       }
     }
  }
}

SearchList.prototype.popFirst = function() {
  let ptr = this.root;

  if(this.root === undefined) {
    this.end = undefined;
  } else {
    this.root = ptr.next;
    this.length -= 1;
  }

  // pointer should be unconnected
  ptr.next = undefined;
  ptr.pre = undefined;

  return ptr;
}

function Search(sizex, sizey) {
  this.grid = [];
  for(let i=0; i<sizex*sizey; i++)
    this.grid.push(new Cell());

  this.sizex = sizex;

  this.search_queue = new SearchList();
  this.target = undefined;
  this.current = undefined;
  this.just_visited = [];
  this.count = 0;
  this.select_fun = function(search_queue) { return search_queue.popFirst(); };
}

Search.prototype.ij = function(idx) {
  let i = floor(idx / this.sizex);
  let j = idx % this.sizex;

  return {i: i, j: j};
}

Search.prototype.idx = function(i, j) {
  return i*this.sizex + j;;
}

Search.prototype.setStart = function(i, j) {
  let idx = this.idx(i, j);
  this.start = idx;
  this.search_queue.push(idx);
  this.grid[idx].setVisited();
}

Search.prototype.setTarget = function(i, j) {
  this.target = this.idx(i, j);
}

Search.prototype.setOccupied = function(i, j) {
  let idx = this.idx(i, j);
  this.grid[idx].setOccupied();
}

Search.prototype.setSelectFun = function(fun) {
  this.select_fun = fun;
}

Search.prototype.step = function() {
  if(this.target === undefined || this.grid.length == 0)
    return {done: true, value: []};

  this.count++;

  let first = this.select_fun(this.search_queue);

  let idx;

  if(first !== undefined)
    idx = first.idx;
  else
    return {done: true, value: []};

  this.current = this.ij(idx);
  this.just_visited = [];

  // visit neighbours
  for(let dir of shuffle([LEFT, RIGHT, UP, DOWN])) {

    let n = this.neighbour(this.current, dir);

    if(n !== undefined) {
      if(n.idx == this.target) {
        // collect path
        let path = []
        path.push(this.ij(this.target));
        let path_idx = idx;
        print(this.start);
        while(path_idx != this.start) {
             path.push(this.ij(path_idx));
             path_idx = this.grid[path_idx].getFrom();
        }
        path.push(this.ij(this.start));
        print(path);
        return {done: true, value: path};
      } else if(!n.cell.isVisited() && !n.cell.isOccupied()) {
        // mark cell
        n.cell.setFrom(idx);
        n.cell.setVisited();
        this.search_queue.push(n.idx);
        this.just_visited.push(this.ij(n.idx));
      }
    }

  }

  return {done: false}; // returns newly visited
}

// enter i,j index and return cell of <dir> neighbour.
// dir can be [LEFT|RIGHT|UP|DOWN])
Search.prototype.neighbour = function(ij, dir) {
  let i = ij.i;
  let j = ij.j;
  if(dir == LEFT &&  i > 0) {
    i--;
  } else if (dir == RIGHT && i < maxi) {
    i++;
  } else if (dir == UP && j > 0) {
    j--;
  } else if (dir == DOWN && j < maxj) {
    j++;
  } else {
    return undefined;
  }

  let idx = this.idx(i, j);

  return {idx:idx, cell:this.grid[idx]};
}

// get all visited
Search.prototype.getVisited = function() {
  let visited_list = [];
  for(let i = 0; i < this.grid.length; i++) {
    if(this.grid[i].visited()) {
      visited_list.push(this.ij(i));
    }
  }
  return visited_list;
}


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

  cursor(CROSS);

  obst = [];
  pg_o = createGraphics(width, height);
}

function draw() {
  image(pg, 0, 0);
  image(pg_o, 0, 0);

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
  search = new Search(maxi+1,maxj+1);
  search.setStart(start.i, start.j);
  search.setTarget(target.i, target.j);
  for(let o of obst) {
    search.setOccupied(o.i, o.j);
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
  text("Draw Obstacles! Press Enter to continue.", width/2, height-100);
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
    state = DRAW_ENV;
  }
}

function keyReleased() {
  if(keyCode == ENTER && state == DRAW_ENV) {
    state = SET_START;
    return false;
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