var root;

function setup() {
  createCanvas(400, 400);
  root = new Node();
  root.set(50, 0);
  let sub = newNode(root, 30, 10);
  newNode(sub, 40, -45);
  newNode(sub, 70,  30);
  newNode(root, 50, -80);
}

function newNode(pa, len, deg) {
  let node = new Node();
  node.setParent(pa);
  node.set(len, radians(deg));
  return node;
}

function draw() {
  background(200);
  stroke(250, 50, 50);
  fill(200, 200, 255);
  rect(10, 350, 380, 40);
  translate(200, 350);
  root.draw();
  root.grow();
}

class Node {
  constructor() {
    this.pa = null;
    this.childs = [];
    this.length = 10.0;
    this.heading = 0.0;
    this.nutri = true;
  }

  setParent(its_pa) {
    if(its_pa !== this) {
      this.pa = its_pa;
      this.pa.addChild(this);
      return true;
    } else {
      return false;
    }
  }

  set(length, direction) {
    this.length = length;
    this.heading = direction;
  }

  addChild(child) {
    if(child !== this) {
      append(this.childs, child);
      return true;
    } else {
      return false;
    }
  }


  grow() {
    this.length += 0.05;
    if (this.childs.length > 0) {
      let sun = 0;
      for(let i=0; i<this.childs.length; i++) {
        sun += this.childs[i].grow();
      }
      return sun;
   } else {
      return 1;
    }
  }

  draw() {
    push();
    rotate(this.heading);
    beginShape();
    vertex(0, 0);
    vertex(0, -this.length);
    endShape();
    translate(0, -this.length);
    circle(0, 0, 5);
    this.childs.forEach((child) => {child.draw()});
    pop();
  }
}


