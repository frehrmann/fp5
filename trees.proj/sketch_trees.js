
const ELEMLIST = {};

function setup() {
  let canvas = createCanvas(800, 400);


  // ELEMLIST.bcnt = select('#bcnt');

  WORLD.setup();
  WORLD.createRoot(0, 10, BASEGENE);
}


function draw() {
  background(100);
  if(frameCount%10 == 0) lowDraw();
  WORLD.update(1);
  WORLD.draw();
}

function lowDraw() {
  // ELEMLIST.bcnt.html(WORLD.counts.branches);
}

