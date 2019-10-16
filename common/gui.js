/* Library for easy gui elements. */

function widget(parent) {
  this.parent = parent;
  this.childs = [];
  if(parent !== undefined) this.parents.childs.push(this);
}

widget.prototype.render(pg) {
  for(let c in childs) c.render(pg);
}

widget.prototype.mousePressed() {
  for(let c in childs) c.mousePressed();
}

widget.prototype.mouseReleased() {
  for(let c in childs) c.mouseReleased();
}

widget.prototype.mouseDragged() {
  for(let c in childs) c.mouseDragged();
}

widget.prototype.contains(x, y) {
  return false;
}

function button(x, y, text, text_size, parent) {

  widget.call(this, parent);

  this.x = x_left;
  this.y = y_up;
  textSize(text_size);
  this.text = text;
  this.w = textWidth(text)+10;
  this.h = text_size+4;
  this.pressed = false;
}

button.prototype = Object.create(widget.prototype);
button.prototype.constructor = button;


button.prototype.mousePressed() {
  if(this.contains(mouseX, mouseY))
    this.pressed = true;
}

button.prototype.draw(pg) {
  pg.push();
  pg.translate(this.x, this.y);
  pg.stroke(50);
  if(this.pressed)
    pg.fill(200, 200, 250);
  else if(this.contains(mouseX, mouseY));
    pg.fill(150);
  else
    pg.fill(200);
  pg.rect(0, 0, this.w, this.y);
  pg.fill(0);
  pg.noStroke();
  pg.textSize(this.h-4);
  pg.textAlign(CENTER, CENTER);
  pg.text(this.text, this.w/2, this.h/2);
  pg.pop();

  widget.prototype.draw.call(this, pg);
}

button.prototype.contains(x, y) {
  let isX = x >= this.x && x <= this.x+this.w;
  let isY = y >= this.y && y <= this.y+this.h;
  return isX && isY;
}

button.prototype.mousePressed() {
  if(this.contains(mouseX, mouseY))
    this.pressed = true;

  if(this.click !== undefined) this.click();
}

button.prototype.mouseRleased() {
  if(this.contains(mouseX, mouseY))
    this.pressed = false;
}

