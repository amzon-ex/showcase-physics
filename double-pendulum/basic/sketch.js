var cnv = {
  w: 500,
  h: 500
};
var pivot = {
  x: cnv.w / 2,
  y: cnv.h / 2
};
var fr = 60;
var loops = 60;

var tracer;

// The parameters of the problem
const g = 9.8;
const l1 = 1;
const l2 = 1;
const m1 = 1;
const m2 = 1;
const a1_i = 1.57;
const a2_i = -1.5;
const p1_i = 0;
const p2_i = 0;
const dt = 1.0 / fr / loops;
const Lscale = 0.4 * cnv.h / (l1 + l2);
const L1 = Lscale * l1;
const L2 = Lscale * l2;

// The variables of the problem 
var t, a;
var x2p, y2p;

function setup() {
  // put setup code here
  createCanvas(cnv.w, cnv.h);
  frameRate(fr);

  tracer = createGraphics(cnv.w, cnv.h);

  // The initial conditions of the problem
  t = 0;
  a = [a1_i, a2_i, p1_i, p2_i];

  x2p = pivot.x + L1 * sin(a1_i) + L2 * sin(a2_i);
  y2p = pivot.y + L1 * cos(a1_i) + L2 * cos(a2_i);
}

function draw() {
  for (let i = 0; i < loops; i++) {
    background(220);

    text("Scale: 1 m is " + Lscale + " px", 5, 15);

    let a1 = a[0];
    let a2 = a[1];

    // Convert solutions to Cartesian
    x1 = pivot.x + L1 * sin(a1);
    y1 = pivot.y + L1 * cos(a1);
    x2 = x1 + L2 * sin(a2);
    y2 = y1 + L2 * cos(a2);

    // tracer
    let w = 1.9 * exp(-(a[3] ** 2) / 10) + 0.7
    tracer.strokeCap(SQUARE);
    tracer.strokeWeight(w);
    tracer.stroke(100, 100);
    // tracer.point(x2, y2);
    tracer.line(x2p, y2p, x2, y2);
    image(tracer, 0, 0);

    // The pivot and the pendulum
    paint(x1, y1, x2, y2);

    // step the solver
    a = step(t, a);
    t += dt;

    x2p = x2;
    y2p = y2;
  }
}

function evolve(t, a) {
  let a1 = a[0];
  let a2 = a[1];
  let p1 = a[2];
  let p2 = a[3];

  let da = a1 - a2;

  let h1 = (p1 * p2 * sin(da)) / (l1 * l2 * (m1 + m2 * (sin(da)) ** 2));
  let h2 = (m2 * l2 * l2 * p1 * p1 + (m1 + m2) * l1 * l1 * p2 * p2 - 2 * m2 * l1 * l2 * p1 * p2 * cos(da)) / (2 * l1 * l1 * l2 * l2 * (m1 + m2 * (sin(da)) ** 2) ** 2);

  let da1 = (l2 * p1 - l1 * p2 * cos(da)) / (l1 * l1 * l2 * (m1 + m2 * (sin(da)) ** 2));
  let da2 = (-m2 * l2 * p1 * cos(da) + (m1 + m2) * l1 * p2) / (m2 * l1 * l2 * l2 * (m1 + m2 * (sin(da)) ** 2));
  let dp1 = -((m1 + m2) * g * l1 * sin(a1) + h1 - h2 * sin(2 * da));
  let dp2 = -(m2 * g * l2 * sin(a2) - h1 + h2 * sin(2 * da));

  return [da1, da2, dp1, dp2];
}

function step(t, a) {
  // Euler method
  let a_ = [];

  let da = evolve(t, a);
  for (let i = 0; i < a.length; i++) {
    a_.push(a[i] + dt * da[i]);
  }

  return a_;
}

function paint(x1, y1, x2, y2) {
  fill(5);
  ellipse(pivot.x, pivot.y, 6, 6);
  stroke(20);
  fill(5);
  line(pivot.x, pivot.y, x1, y1);
  ellipse(x1, y1, 12);
  fill(80);
  line(x1, y1, x2, y2);
  ellipse(x2, y2, 12);
}