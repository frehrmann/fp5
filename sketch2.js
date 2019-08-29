const NPTS = 100;
const MAXV = 10;
var points = [];

function setup() {
  let canvas = createCanvas(600, 300);
  canvas.parent('sketch-holder');
}

function draw() {
  background(50, 50, 100);
  if(points.length<NPTS)
    points.push(new Point());

  points.map(updatePoint);

}

function updatePoint(point, index, array) {

  point.draw();
  point.progress();
  if(point.out())
    array[index] = new Point();

}


class Point {

  constructor() {
    this.x = 0;
    this.y = random(height);
    this.v = random(1, MAXV);
    this.r = random(3, 10);
  }

  draw() {
    let vcol = this.v/MAXV*255;
    fill(255-vcol, vcol, vcol/2);
    stroke(0);
    circle(this.x, this.y, this.r);
  }

  progress() {
    this.x += this.v;
  }

  out() {
    return this.x > width;
  }

}

