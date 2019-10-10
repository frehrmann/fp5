let pg;

function setup() {
  createCanvas(600, 300);
  background(0);

  pg = createGraphics(600, 300);

  let c1 = color(0, 0, 255);
  let c2 = color(0, 255, 255);

  for(let i=0; i<height; i++) {
    let c = lerpColor(c1, c2, i/height);
    pg.stroke(c);
    pg.line(0, i, width, i);
  }

  pg.stroke(100, 255, 50);
  pg.strokeWeight(10);
  pg.fill(0, 200 ,0);
  pg.textFont('Georgia');
  pg.textSize(120);
  pg.textAlign(CENTER, CENTER);
  pg.text('STARTER', width/2, height/2);

  // image(pg, 0, 0);

  rectMode(CENTER);
  fill(255, 10);
  noStroke();

}


function draw() {
  let x = random(width);
  let y = random(height);
  let r = random(3, 20);

  for(let i=0; i<10; i++) {
    let c = pg.get(x, y);
    fill(red(c), green(c), blue(c), 10);
    rect(x, y, r, r);
  }
}

function mousePressed() {
  background(0);
}
