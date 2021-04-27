/* Employs the 'chaos game' algorithm on a polygon
 * with pre-chosen number of sides.
 */

// Display parameters
var cnv = {w : screen.height,  h : screen.height};

// Globally accessible vectors
var _verts = [];
var _edges = [];
var _pt;

// The constants
const PI = Math.PI;
const sides = 4;
const rad = 0.4*cnv.h;
const angle = 2.0*PI/sides;
const init_angle  = PI/4.0;
const frac = 0.4;

// // setup capture
// let framerate = 60;
// var capturer = new CCapture( {format: 'png',  framerate,  name: 'frames',  quality: 100, verbose: true, autoSaveTime: 30} );
// let canvas;

function isOutside(x,y) {
  console.log(x,y);
  let cnt = 0;
  for(let i = 0; i < sides; i++) {
    let m = _edges[i][0];
    let c = _edges[i][1];
    if((y < (m*x + c) && c >= 0) || (y > (m*x + c) && c < 0)) {
      console.log("Here",m,c);
      cnt++; 
    }
  }
  if(cnt == sides) return false;
  else return true;
}

function setup() {

  // put setup code here
  var cnvs = createCanvas(cnv.w,cnv.h);
  // canvas = cnvs.canvas;

  background(0);
  stroke(255);
  strokeWeight(1);
  
  // Draw the polygon with 'sides'
  translate(cnv.w/2,cnv.h/2);
  scale(1.0,-1.0);
  rotate(init_angle);
  for(let i = 0; i < sides; i++) {
    _verts.push(createVector(rad*cos(i*angle),rad*sin(i*angle)));
    point(_verts[i]);
  }
  for(let i = 0; i < sides; i++) {
    let m = (_verts[(i+1)%(sides-1)].y - _verts[i].y)/(_verts[(i+1)%(sides-1)].x - _verts[i].x);
    let c = _verts[i].y - m*_verts[i].x;
    _edges.push([m,c]);
  }

  // Choose an initial point within
  var randr,randt,randx,randy;
  var itercnt = 0;
  while(true) {
    if(itercnt++ > 50) {
      console.log("Terminating execution: limit reached while generating the initial point [50]");
      remove();
    }
    randr = random(0,rad);
    randt = random(0,TWO_PI);

    randx = randr*cos(randt);
    randy = randr*sin(randt);
    // console.log(randx,randy);
    if(!isOutside(randx,randy)) break;
  }
  _pt = createVector(randx,randy);

  // // Start the capturer
  // capturer.start();
  // draw();
}

function draw() {
  translate(cnv.w/2,cnv.h/2);
  scale(1.0,-1.0);
  rotate(init_angle);
  // Choose a vertex at random
  let rand_vert = parseInt(random(sides));
  let _vert = _verts[rand_vert];

  let mid = p5.Vector.add(_vert,p5.Vector.mult(p5.Vector.sub(_pt,_vert),frac));
  point(mid);
  
  _pt = mid.copy();
  
  // if(frameCount >= 12600) {
  //   capturer.stop();
  //   capturer.save();
  //   noLoop();
  // }
  // else capturer.capture(canvas);
}
