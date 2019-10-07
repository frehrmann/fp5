function setup() {
  createCanvas(600, 300);
}

let i=0;
let inc=50; // pixel per second
let points = [0];
let ip = 1;


function draw() {
  background(100, 100, 200);

  strokeWeight(2);
  stroke(255);
  fill(0);
  circle(width/2, height/2, i);

  i += inc*deltaTime/1000;

  if((inc > 0 && (i > width || i > height)) ||
     (inc < 0 && i < 0))
    inc *= -1;


  if(ip > width) ip = 1
  let np = points[ip-1] + random(-5, 5);
  if(ip < points.length)
    points[ip] = np;
  else
    points.push(np);
  ip+=1;

  stroke(255, 0, 0);
  noFill();
  beginShape();
  for(let i=0; i<points.length; i++) vertex(i, points[i]+height/2);
  endShape();

}
