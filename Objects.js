

var vertices = [];


/* ----------------  RECT ---------------- */
function Rect(loc, width, height, color){
  this.color = color;
  // this.trs = mat4();
  this.width = width;
  this.height = height;
  this.loc = loc;
  // this.trs = mult( scalem(width, height, 1), translate(loc[0], loc[1], loc[2]) );
  this.trs = mult( translate(loc[0], loc[1], loc[2]), scalem(width, height, 1) );
  // this.setTrs();
}
Rect.NV = 4;
Rect.startIndex = vertices.length;
vertices.push( vec3(0, 0, 0) );
vertices.push( vec3(1, 0, 0) );
vertices.push( vec3(0, 1, 0) );
vertices.push( vec3(1, 1, 0) );

Rect.prototype.draw = function(){
  // var m = mat4(2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  var m = mat4();
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(this.trs) );
    gl.uniform4fv(colLoc, flatten(this.color));
    gl.drawArrays(gl.TRIANGLE_STRIP, Rect.startIndex, Rect.NV);
}
// Rect.prototype.setTrs = function(trs){
//   this.trs = mult( translate(this.loc[0], this.loc[1], this.loc[2]), scalem(this.width, this.height, 1) );
//   if(trs != null)
//     this.trs = mult(this.trs, trs);
//
// }

/* ----------------  CUBE ---------------- */
// loc, widht, length, height, color
function Cube(loc, width, length, height, color){
  this.color = color;
  var s = scalem(width, length, height);
  var t = translate(loc[0], loc[1], loc[2]);
  var ts = mult( t, s );
  console.log(loc);
  this.trs = ts;
}
Cube.startIndex = vertices.length;
var i = [
  vec3(0, 1, 0),
  vec3(0, 0, 0),
  vec3(1, 0, 0),
  vec3(1, 1, 0),

  vec3(0, 1, 1),
  vec3(0, 0, 1),
  vec3(1, 0, 1),
  vec3(1, 1, 1)
];
// face takes a, b, c, d in anti clockwise order
function face(a, b, c, d){
  vertices.push(i[a]);
  vertices.push(i[b]);
  vertices.push(i[c]);

  vertices.push(i[a]);
  vertices.push(i[c]);
  vertices.push(i[d]);
}
Cube.NV = 6*6;
face(0, 1, 2, 3);
face(3, 2, 6, 7);
face(7, 6, 5, 4);
face(4, 5, 1, 0);
face(4, 0, 3, 7);
face(1, 5, 6, 2);
Cube.prototype.draw = function(){
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(this.trs) );
    gl.uniform4fv(colLoc, flatten(this.color));
    gl.drawArrays(gl.TRIANGLES, Cube.startIndex, Cube.NV);
}


/* ----------------  CYLINDER ---------------- */
function Circle(color){
  this.color = color;
  this.trs = mat4();//translate(0, 0.1, 0);
}
Circle.NV = 50;
Circle.startIndex = vertices.length;
// CIRCLE VERTICES
// push on the center point
vertices.push(vec3(0.0, 0.0, 0.0));
var angle = Math.PI*2/(Circle.NV-2);
/* the line above caused a problem, now its not. but the line below fixed it weirdly, incase it starts again.*/
// var angle = Math.PI*2/Circle.NV;
for(var i = 0; i < Circle.NV-2; ++i){
  vertices.push( vec3(Math.cos(i*angle)*0.5, Math.sin(i*angle)*0.5) );
}
// push on the second point (first on outside), so that it will be re connected
vertices.push(vertices[Circle.startIndex+1])

Circle.prototype.draw = function(){
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(this.trs) );
  gl.uniform4fv(colLoc, flatten(this.color))
  gl.drawArrays(gl.TRIANGLE_FAN, Circle.startIndex, Circle.NV);
}

/* ----------------  CYLINDER ---------------- */

function Cylinder(color){
  // diameter = 1
  // height = 1
  this.color = color;
  this.trs = mat4();
  // this.bottomCircle = new Circle(vec4(0,0,0,1));
  // this.topCircle = new Circle(vec4(0,0,0,1));
}
Cylinder.startIndex = vertices.length;
Cylinder.NV = (Circle.NV-2)*2+2;
angle = Math.PI*2/((Cylinder.NV-2)/2);
for(var i = 0; i < (Cylinder.NV-2)/2; ++i){
  vertices.push( vec3(Math.cos(i*angle)*0.5, Math.sin(i*angle)*0.5, -0.5) );
  vertices.push( vec3(Math.cos(i*angle)*0.5, Math.sin(i*angle)*0.5, 0.5) );
}
vertices.push( vec3(Math.cos(0*angle)*0.5, Math.sin(0*angle)*0.5, -0.5) );
vertices.push( vec3(Math.cos(0*angle)*0.5, Math.sin(0*angle)*0.5, 0.5) );

Cylinder.prototype.draw = function(){
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(this.trs) );
  gl.uniform4fv(colLoc, flatten(this.color))
  gl.drawArrays(gl.TRIANGLE_STRIP, Cylinder.startIndex, Cylinder.NV);
  // this.bottomCircle.draw();
  // this.topCircle.draw();
}
Cylinder.prototype.setTrs = function(trs){
  this.trs = trs;
  // var bottomT = translate(0, 0, -0.5);
  // var topT = translate(0, 0, 0.5);
  // this.bottomCircle.trs = mult(trs, bottomT);
  // this.topCircle.trs = mult(trs, topT);
}

/* ----------------  CONE ---------------- */
function Cone(color){
  this.color = color;
  this.trs = mat4();
  this.circle = new Circle( color );
}
Cone.startIndex = vertices.length;
Cone.NV = 50;
var angle = Math.PI*2/(Cone.NV-1-1);
vertices.push( vec3(0, 0, 1) );
for(var i = 0; i < Cone.NV-1-1; ++i){
  vertices.push( vec3( Math.cos(i*angle)*0.5, Math.sin(i*angle)*0.5, 0) );
}
vertices.push( vec3( Math.cos(0*angle)*0.5, Math.sin(0*angle)*0.5, 0) );

Cone.prototype.draw = function(){
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(this.trs) );
  gl.uniform4fv(colLoc, flatten(this.color))
  gl.drawArrays(gl.TRIANGLE_FAN, Cone.startIndex, Cone.NV);
  this.circle.draw();
}
Cone.prototype.setTrs = function(trs){
  this.trs = trs;
  this.circle.trs = trs;
}

/* ----------------  TREE ---------------- */
function Tree(loc, diam, height){
  this.loc = loc;
  this.diam = diam;
  this.height = height;
  this.trs = mat4();
  this.cylinder = new Cylinder( vec4(0.3, 0.2, 0.04, 1.0) );
  this.cone = new Cone( vec4(0.3, 0.9, 0.2, 1.0) );
  var s = scalem(diam, diam, height);
  var t = translate(loc[0], loc[1], 0);
  this.setTrs( mult(t, s) );
}
Tree.prototype.draw = function(){
  this.cylinder.draw();
  this.cone.draw();
}
// the passed in trs should spesify the scale, and the translation to its location, but no rotation
Tree.prototype.setTrs = function(trs){
  this.trs = trs;

  // cylider
  var cylinderT = translate(0, 0, 0.5);
  // this.cylinder.trs = mult(cylinderT, trs);
  // console.log(cylinderT);
  this.cylinder.setTrs(mult(this.trs, cylinderT) );

  //cone
  var coneS = scalem(4, 4, 0.6);
  var coneT = translate(0, 0, 1);
  this.cone.setTrs( mult(this.trs, mult(coneT, coneS)) );
  // console.log(coneT);
}

/* ----------------  ROOF ---------------- */
function Roof(loc, width, length, height, color){
  this.color = color;

}
Roof.NV = ;
Roof.startIndex = vertices.length;



/* ----------------  PARTHENON ---------------- */
function Parthenon(vLoc, fScale){
  this.loc = vLoc;
  this.width = 8*fScale;
  this.length = 13*fScale;
  this.height = 8*fScale;
  this.color = vec4(0.5, 0.5, 0.5, 1);
  this.base = new Rect( vec3(0, 0, 0.01), 8, 13, this.color );
  this.pillars = [];
  this.lintels = [];
  this.trs = null;
  // along width
  var diam = this.width/4/2;
  for(var i = 0; i < 4; ++i){
    var x = (diam/2) + (i*(diam+this.width/3/2));
    var topY = this.length-(diam/2);
    var bottomY = diam/2;
    // var top = new Cylinder(this.color);
    // var bottom = new Cylinder(this.color);
    var top = new Cylinder(vec4(0,0,0,1));
    var bottom = new Cylinder(vec4(0,0,0,1));
    var s = scalem(diam, diam, this.height); // maybe this shouldnt be height
    top.trs = mult( translate(x, topY, this.height/2), s );
    bottom.trs = mult( translate(x, bottomY, this.height/2), s );
    this.pillars.push(top);
    this.pillars.push(bottom);
  }
  // along length
  for(var i = 1; i < 5; ++i){
    var y = (diam/2) + (i*(diam+this.length/5/2));
    var topX = this.width-(diam/2);
    var bottomX = diam/2;
    // var top = new Cylinder(this.color);
    // var bottom = new Cylinder(this.color);
    var top = new Cylinder(vec4(0,0,0,1));
    var bottom = new Cylinder(vec4(0,0,0,1));
    var s = scalem(diam, diam, this.height); // maybe this shouldnt be height
    top.setTrs( mult( translate(topX, y, this.height/2), s ) );
    bottom.setTrs( mult( translate(bottomX, y, this.height/2), s ) );
    this.pillars.push(top);
    this.pillars.push(bottom);
  }
  // lintels
  // loc, widht, length, height, color
  this.lintels.push( new Cube( vec3(this.loc[0], this.loc[1], this.height),
                    this.width, diam, 0.5*fScale, this.color) );
  this.lintels.push( new Cube( vec3(this.loc[0], this.loc[1]+this.length-diam, this.height),
                    this.width, diam, 0.5*fScale, this.color) );
  this.lintels.push( new Cube( vec3(this.loc[0], this.loc[1], this.height),
                    diam, this.length, 0.5*fScale, this.color) );
  this.lintels.push( new Cube( vec3(this.loc[0]+this.width-diam, this.loc[1], this.height),
                    diam, this.length, 0.5*fScale, this.color) );


  var s = scalem(this.width, this.length, 1);
  // var s = scalem(this.width, this.length, this.height);
  var t = translate(vLoc[0], vLoc[1], vLoc[2]);
  this.setTrs( mult( t, s ) );
}
Parthenon.prototype.draw = function(){
  this.base.draw();
  for(var i = 0; i < this.pillars.length; ++i){
    this.pillars[i].draw();
  }
  for(var i = 0; i < this.lintels.length; ++i){
    this.lintels[i].draw();
  }

}
Parthenon.prototype.setTrs = function(trs){
  this.trs = trs;

  var baseT = translate(0, 0, 0.01);
  this.base.trs = mult(baseT, this.trs);
}
