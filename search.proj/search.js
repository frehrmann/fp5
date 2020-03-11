/* Search methods */


/* A cell in the search grid.
 *
 * It stores if it is visited and from where it was visited.
 * And if it can be visited at all.
 */
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


/* A converter that converts a 2d index into a 1d index.
 *
 * If i,j is the 2d index, the 1d index idx = i*sizex + j;
 * Where sizex is ther width of the field.
 */
function Converter(sizex) {
  this.sizex = sizex;
}

Converter.prototype.ij = function(idx) {
  let i = floor(idx / this.sizex);
  let j = idx % this.sizex;

  return {i: i, j: j};
}

Converter.prototype.idx = function(i, j) {
  return i*this.sizex + j;;
}


/* The search. */
function Search(sizex, sizey, conv) {
  this.grid = [];
  for(let i=0; i<sizex*sizey; i++)
    this.grid.push(new Cell());

  this.conv = conv; // converter

  this.search_queue = new SearchList();
  this.target = undefined;
  this.current = undefined;
  this.just_visited = [];
  this.count = 0;
  this.select_fun = function(search_queue) { return search_queue.popFirst(); };
  this.visited_list = [];
}

Search.prototype.setStart = function(i, j) {
  let idx = this.conv.idx(i, j);
  this.start = idx;
  this.search_queue.push(idx);
  this.grid[idx].setVisited();
  this.visited_list.push({i: i, j: j});
}

Search.prototype.setTarget = function(i, j) {
  this.target = this.conv.idx(i, j);
}

Search.prototype.setOccupied = function(i, j) {
  let idx = this.conv.idx(i, j);
  this.grid[idx].setOccupied();
}

Search.prototype.setSelectFun = function(fun) {
  this.select_fun = fun;
}

Search.prototype.step = function() {
  if(this.target === undefined || this.grid.length == 0 || this.search_queue.length == 0)
    return {done: true, value: []};

  this.count++;

  let first = this.select_fun(this.search_queue);

  let idx;

  if(first !== undefined)
    idx = first.idx;
  else
    return {done: true, value: []};

  this.current = this.conv.ij(idx);
  this.just_visited = [];

  // visit neighbours
  for(let dir of shuffle([LEFT, RIGHT, UP, DOWN])) {

    let n = this.neighbour(this.current, dir);

    if(n !== undefined) {
      if(n.idx == this.target) {
        // collect path
        let path = []
        path.push(this.conv.ij(this.target));
        let path_idx = idx;
        while(path_idx != this.start) {
             path.push(this.conv.ij(path_idx));
             path_idx = this.grid[path_idx].getFrom();
        }
        path.push(this.conv.ij(this.start));
        return {done: true, value: path};
      } else if(!n.cell.isVisited() && !n.cell.isOccupied()) {
        // mark cell
        n.cell.setFrom(idx);
        n.cell.setVisited();
        this.search_queue.push(n.idx);
        this.just_visited.push(this.conv.ij(n.idx));
        this.visited_list.push(this.conv.ij(n.idx));
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

  let idx = this.conv.idx(i, j);

  return {idx:idx, cell:this.grid[idx]};
}

// get all visited
Search.prototype.getVisited = function() {
  return this.visited_list;
}


Search.prototype.aStarSelect = function(select_queue) {
  let min_d = undefined;
  let min_node;
  print("*");
  let it = search.search_queue.getIter();
  let elem = it.next()
  while(!elem.done) {
    let node = elem.value;
    let ij = this.conv.ij(node.idx);
    print(node.idx + "; " + ij.i + ", " + ij.j);
    let a_target = this.conv.ij(this.target);
    let sqd = (ij.i - a_target.i)**2 + (ij.j - a_target.j)**2;
    if(min_d === undefined || sqd < min_d) {
      min_d = sqd;
      min_node = node;
    }

    elem = it.next();
  }
  print("= " + min_node.idx);
  select_queue.remove(min_node);
  return min_node;
}
