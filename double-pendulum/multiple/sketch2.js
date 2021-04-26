// Display parameters
var cnv = {
  w: 500,
  h: 500
};
var pivot = {
  x: cnv.w / 2,
  y: cnv.h / 2
};
var fr = 90;
var tracer;

// The parameters of the problem
const g = 9.8;
const dt = 1.0 / fr;

// The variables of the problem
var dp1, dp2;
var vp1, vp2;

// setup capture
// let framerate = 90;
// var capturer = new CCapture( {format: 'webm',  framerate,  name: 'double_pendulum',  quality: 95, verbose: true} );
// let canvas;

function setup() {
  // put setup code here
  var cnvs = createCanvas(cnv.w, cnv.h);
  // canvas = cnvs.canvas;
  frameRate(fr);
  tracer = createGraphics(cnv.w, cnv.h);

  // Create double-pendulum instances
  dp1 = new DoublePendulum();
  dp2 = new DoublePendulum();

  dp1.initialize(dt, 3, 3, 0, 0);
  dp2.initialize(dt, 3, 3.0001745, 0, 0);
  
  dp1.setColor(120, 0, 0);
  dp2.setColor(0, 0, 120);

  dp1.pivot = createVector(pivot.x, pivot.y);
  dp2.pivot = createVector(pivot.x, pivot.y);

  vp1 = dp1.loc2;
  vp2 = dp2.loc2;

  // Start the capturer
  // capturer.start();
  // draw();
}

function draw() {
  // Black background, white pendulum
  background(220);

  // tracer
  let w1 = 1.9*exp(-(dp1.mom2**2)/10) + 0.7
  let w2 = 1.9*exp(-(dp2.mom2**2)/10) + 0.7
  tracer.strokeCap(SQUARE);
  tracer.stroke(150, 0, 0, 100);
  tracer.strokeWeight(w1);
  tracer.line(vp1.x, vp1.y, dp1.loc2.x, dp1.loc2.y);
  tracer.stroke(0, 0, 150, 100);
  tracer.strokeWeight(w2);
  tracer.line(vp2.x, vp2.y, dp2.loc2.x, dp2.loc2.y);
  if(frameCount%8 == 0) tracer.background(220, 4);
  image(tracer, 0, 0);
    
  vp1 = dp1.loc2;
  vp2 = dp2.loc2;

  dp1.paint();
  dp2.paint();
  
  dp1.step();
  dp2.step();
  
  dp1.integrate();
  dp2.integrate();
  
  // if(frameCount >= 3600) {
  //   capturer.stop();
  //   capturer.save();
  //   noLoop();
  // }
  // else capturer.capture(canvas);
}

function integrator(a, da) {
  // Euler method
  let a_ = a.map(function(num, idx) {
    return num + dt * da[idx];
  });

  return a_;
}

class DoublePendulum {
  constructor(len1 = 1, len2 = 1, m1 = 1, m2 = 1) {
    this.length1 = len1;
    this.length2 = len2;
    this.mass1 = m1;
    this.mass2 = m2;
    
    this.pvt = createVector(0, 0);

    this.Lscale = 0.4 * cnv.h / (len1 + len2);
  }

  initialize(dt, theta1 = 0, theta2 = 0, ptheta1 = 0, ptheta2 = 0) {
    this.dt = dt;
    this.q1 = theta1;
    this.q2 = theta2;
    this.p1 = ptheta1;
    this.p2 = ptheta2;
  }
  
  setColor(r, g, b) {
    this.bob1 = color(r, g, b);
    function lighten(clr) {
      return (255 - clr)*0.3 + clr;
    }
    this.bob2 = color(lighten(r), lighten(g), lighten(b));
  }

  set pivot(vec) {
    this.pvt = vec;
  }

  step() {
    let q1 = this.q1;
    let q2 = this.q2;
    let p1 = this.p1;
    let p2 = this.p2;
    let l1 = this.length1;
    let l2 = this.length2;
    let m1 = this.mass1;
    let m2 = this.mass2;

    let dq = q1 - q2;

    let h1 = (p1 * p2 * sin(dq)) / (l1 * l2 * (m1 + m2 * (sin(dq)) ** 2));
    let h2 = (m2 * l2 * l2 * p1 * p1 + (m1 + m2) * l1 * l1 * p2 * p2 - 2 * m2 * l1 * l2 * p1 * p2 * cos(dq)) / (2 * l1 * l1 * l2 * l2 * (m1 + m2 * (sin(dq)) ** 2) ** 2);

    this.dq1 = (l2 * p1 - l1 * p2 * cos(dq)) / (l1 * l1 * l2 * (m1 + m2 * (sin(dq)) ** 2));
    this.dq2 = (-m2 * l2 * p1 * cos(dq) + (m1 + m2) * l1 * p2) / (m2 * l1 * l2 * l2 * (m1 + m2 * (sin(dq)) ** 2));
    this.dp1 = -((m1 + m2) * g * l1 * sin(q1) + h1 - h2 * sin(2 * dq));
    this.dp2 = -(m2 * g * l2 * sin(q2) - h1 + h2 * sin(2 * dq));
  }

  integrate() {
    // Euler method
    this.q1 = this.q1 + this.dt * this.dq1;
    this.q2 = this.q2 + this.dt * this.dq2;
    this.p1 = this.p1 + this.dt * this.dp1;
    this.p2 = this.p2 + this.dt * this.dp2;
  }

  get loc1() {
    let x = this.pvt.x + this.length1 * this.Lscale * sin(this.q1);
    let y = this.pvt.y + this.length1 * this.Lscale * cos(this.q1);
    return createVector(x, y);
  }

  get loc2() {
    let x = this.loc1.x + this.length2 * this.Lscale * sin(this.q2);
    let y = this.loc1.y + this.length2 * this.Lscale * cos(this.q2);
    return createVector(x, y);
  }

  get mom1() {
    return this.p1;
  }

  get mom2() {
    return this.p2;
  }

  paint() {
    ellipseMode(CENTER);
    fill(5);
    ellipse(this.pvt.x, this.pvt.y, 5);
    stroke(20);
    fill(this.bob1);
    line(this.pvt.x, this.pvt.y, this.loc1.x, this.loc1.y);
    ellipse(this.loc1.x, this.loc1.y, 12);
    fill(this.bob2);
    line(this.loc1.x, this.loc1.y, this.loc2.x, this.loc2.y);
    ellipse(this.loc2.x, this.loc2.y, 12);
  }
}