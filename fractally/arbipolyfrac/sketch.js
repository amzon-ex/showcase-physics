/* Employs the 'chaos game' algorithm on a polygon
 * with pre-chosen number of sides.
 */

// Display parameters
var sizeCtrl = (window.innerHeight > window.innerWidth)?window.innerWidth:window.innerHeight;
var cnv = {w : 0.9*sizeCtrl,  h : 0.9*sizeCtrl};
var fracslider;

// Globally accessible vectors
var _verts = [];
var _pt;
var frac;

var isActive = false;

// // setup capture
// let framerate = 60;
// var capturer = new CCapture( {format: 'png',  framerate,  name: 'frames',  quality: 100, autoSaveTime: 30} );
// let canvas;

function setup() {
  // put setup code here
  var cnvs = createCanvas(cnv.w,cnv.h);
  // canvas = cnvs.canvas;
  // console.log("Autosave set at every ",capturer.settings.autoSaveTime," seconds.");

  createElement("br");  // newline
  var loopbutt = createButton("Generate!");
  var resetbutt = createButton("Reset");

  loopbutt.style("width",(0.495*cnv.w)+"px");
  loopbutt.style("height",(0.1*cnv.h)+"px");
  loopbutt.style("margin-right",(0.01*cnv.w)+"px");
  resetbutt.style("width",(0.495*cnv.w)+"px");
  resetbutt.style("height",(0.1*cnv.h)+"px");

  background(0);
  stroke(255);
  cnvs.mousePressed(addPoint);
  loopbutt.mousePressed(toggleDraw);
  resetbutt.mousePressed(resetCanvas);
  // Choose the center of the canvas as the initial point
  _pt = createVector(cnv.w/2,cnv.h/2);

  handleLocalDOM();
  
  // // Start the capturer
  // capturer.start();
  // draw();
  noLoop();
}

function draw() {
  if(isActive) {
    frac = fracslider.value/100.0;
    // Choose a vertex at random
    let rand_vert = parseInt(random(_verts.length));
    let _vert = _verts[rand_vert];

    let mid = p5.Vector.add(_vert,p5.Vector.mult(p5.Vector.sub(_pt,_vert),frac));
    point(mid);

    _pt = mid.copy();
    
    // // Stop an ongoing canvas capture and exit
    // if(frameCount >= 30000) {
    //   console.log("Frames captured = ",frameCount);
    //   capturer.stop();
    //   capturer.save();
    //   noLoop();
    // }
    // else capturer.capture(canvas);
  }
}

function addPoint() {
  if(!isActive) {
    let vert = createVector(mouseX,mouseY);
    console.log(vert);
    _verts.push(vert);
    ellipse(vert.x,vert.y,4);
  }
}

// What happens when you click the 'Generate/Stop' button
function toggleDraw() {
  if(_verts.length > 1) {
    isActive = !isActive;
    if(isActive) {
      this.html("Stop.");
      loop();
    }
    else {
      this.html("Generate!");
      noLoop();
    }
  }
}

function resetCanvas() {
  if(_verts.length > 0) 
    location.reload(true);  // forceGet = true loads page from server instead of cache
}

function handleLocalDOM() {
  let descdiv = document.getElementById("desc");
  descdiv.style.position = "absolute";
  if(window.innerHeight < window.innerWidth) {
    descdiv.style.left = 1.01*cnv.w+"px";
    descdiv.style.width = (window.innerWidth - 1.08*cnv.w)+"px";
  }
  else {
    descdiv.style.top = 1.15*cnv.h+"px";
    descdiv.style.width = 0.93*cnv.w+"px";
  }
  
  fracslider = document.getElementById("fracslider");
  let sliderval = document.getElementById("sliderval");
  sliderval.innerHTML = fracslider.value/100.0;
  fracslider.oninput = function() { sliderval.innerHTML = fracslider.value/100.0; }
}