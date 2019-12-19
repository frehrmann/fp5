var triOsc;
var env;
let freq;

const ATTACK_TIME = 0.01;
const ATTACK_LEVEL = 1.0;
const DECAY_TIME = 0.1;
const SUSTAIN_LEVEL = 0.6;
const RELEASE_TIME = 2.0;
const RELEASE_LEVEL = 0.0;

const DURATION_MS = 300;
const STOP_MS = 200;

var noteFreq = [];
var nNotes;

var triggerNext = 0;
var triggerStop = 0;
var noteIndex = 0;

function setup() {

  let cnv = createCanvas(320, 200);
  cnv.parent('sketch-holder');

  env = new p5.Envelope();
  env.setADSR(ATTACK_TIME, DECAY_TIME, SUSTAIN_LEVEL, RELEASE_TIME);
  env.setRange(ATTACK_LEVEL, RELEASE_LEVEL);

  triOsc = new p5.Oscillator('sine');
  triOsc.amp(env);
  // triOsc.start();

  for(let midi=56; midi <= 78; midi++) {
    freq = pow(2, (midi-69)/12.0) * 440;
    noteFreq.push(freq);
  }
  nNotes = noteFreq.length;
}

function drawADSR() {

  let tot = (ATTACK_TIME + DECAY_TIME + RELEASE_TIME) * 2.0;

  push();
  translate(0, height);
  scale(1.0, -1.0);
  beginShape();
  vertex(0, 0);
  vertex(ATTACK_TIME/tot * 100, ATTACK_LEVEL * 100);
  vertex((ATTACK_TIME+DECAY_TIME)/tot * 100, SUSTAIN_LEVEL*100);
  vertex((ATTACK_TIME+DECAY_TIME+0.5*tot)/tot * 100, SUSTAIN_LEVEL*100);
  vertex(100, RELEASE_LEVEL*100);
  vertex(100, 0);
  endShape();
  pop();
}

function draw() {
  background(200);
  drawADSR();
  text(nf(freq, 3, 3), 100, 160);

  if(millis() > triggerNext) {

    freq = noteFreq[noteIndex % nNotes];
    triOsc.freq(freq);
    triOsc.start();
    env.play();
    noteIndex++;
    triggerNext = millis() + DURATION_MS;
    triggerStop = millis() + STOP_MS;
  } else if(millis() > triggerStop) {
    triOsc.stop();
  }

}
