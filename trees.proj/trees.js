/* trees shall be a growing landscape made of ... trees!!!
 *
 * A tree consists of a root, branches and blossoms. The latter can fall down
 * and become new roots.
 */

const MAX_BRANCHES = 200;

const WORLD = {

  name: "Alpha",
  nodes: [],
  counts: {
    branches: 0,
  },

  setup: function() {
  },

  createRoot: function(x, size) {
    var r = new Root(x, size);
    this.nodes.push(r);
    return r;
  },

  update: function(dt) {
    let stack = {};
    for(node of this.nodes) {
      node.update(dt, stack);
      node.grow(0);
    }
  },

  draw: function() {
    push();
    translate(width/2, 3*height/4);
    scale(1, -1);
    stroke(255, 0, 0);
    line(50, 0, 150, 0);
    stroke(0, 255, 0);
    line(50, 0, 50, 100);
    for(let node of this.nodes) drawVisit(node);
    pop();
  },

  // How much nutritions is in the ground.
  nutrition(x, y) {
    if( y>0 ) return 0;
    else return 10;
  }
}

// This genes hold all kind of information that controls
// the growth of the plant.
const BASEGENE = {
  forkcount: 2, // how many branches from another branch
  rootfork: 1, // how many branches from a root
  maxrootsize: 20, // how big can the root be
  goup: 0.5, // tendence of branches going up
}


class Node {

  constructor() {
    this.childs = [];
  }

  update(dt, stack) {
    for(let child of this.childs) child.update(dt, stack);
  }

  draw() {}
}


function visit(node) {
  for(let child of this.childs) child.visit();
}


function drawVisit(node) {
  push();
  node.draw();
  for(let child of node.childs) drawVisit(child);
  pop();
}


class GrowVisitor {

  constructor() {
    this.nutri = 0.0;
  }

  grow(node) {
    this.nutri += node.getNutrition(this.nutri);
    this.visit(node);
  }

  visit(node) {
    for(let child of node.childs)
      this.nutri += child.getNutrition(this.nutri);

    for(let child of node.childs)
      this.visit(child);

    node.grow(this.nutri);
  }

}


class GrowingThing extends Node {

  constructor(gene) {
    super();
    if (gene===undefined)
      this.gene = BASEGENE;
    else
     this.gene = gene;
  }
}


class Root extends GrowingThing {

  constructor(x, size, gene) {
    super(gene);
    this.x = x;
    this.size = size;
  }

  update(dt, stack) {
    // TODO The first branch should be easily there.
    if(this.childs.length < this.gene.rootfork && random(10) < this.size) {
      this.childs.push(new Branch(2, 0, this.gene));
    }

    // Take as much nutrition as it can get.

    // For counting up the angle
    stack.tot_angle = 0.0;

    super.update(dt, stack);

  }

  getNutrition(nutriIn) {
    return WORLD.nutrition(this.x, -this.size) * this.size/this.gene.maxrootsize;
  }

  grow(nutri) {
    // Growth, when more nutrition is needed.
    if (nutri < 1)
      this.size++;
  }

  draw() {
    circle(this.x, -this.size/2, this.size);
    translate(this.x, 0);
  }

}

class Branch extends GrowingThing {

  constructor(length, angle, gene) {
    super(gene);
    this.length = length;
    this.angle = angle;
    this.feed = false;
    WORLD.counts.branches++;
  }

  update(dt, stack) {
    let feed = stack.nutri > 0;
    if (feed) stack.nutri--;

    stack.tot_angle+= this.angle;


    super.update(dt, stack);

    stack.tot_angle-= this.angle;
  }

  getNutrition(nutriIn) {
    if (nutri > 0) {
      this.feed = true;
      return -1;
    } else {
      this.feed = false;
    }
  }

  grow(nutri) {
    // Growth, when more nutrition is needed.
    if(this.feed && random(10) > 7 && this.length < 40) {
      this.length++;
    } else if(feed && this.length>20 && random(10) > 7 && this.childs.length < this.gene.forkcount ) {
      let new_angle = (1-this.gene.goup)*random(-100, 100)/100*PI/2 - this.gene.goup * stack.tot_angle;
      this.childs.push(new Branch(5, new_angle, this.gene));
    }
  }

  draw() {
    rotate(this.angle);
    line(0, 0, 0, this.length);
    translate(0, this.length);
  }
}
