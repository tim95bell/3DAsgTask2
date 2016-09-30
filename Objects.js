var vertices = [];
var normals = [];


/* ----------------  RECT ---------------- */
// defined from center
function Rect(loc, width, height, color){
  this.color = color;
  this.loc = loc;
  this.width = width;
  this.height = height;
  // this.trs = mult( scalem(width, height, 1), translate(loc[0], loc[1], loc[2]) );
  // this.trs = setTrs(loc, size, rot);
  this.trs = mult( translate(loc[0], loc[1], loc[2]), scalem(width, height, 1) );
}
Rect.NV = 4;
Rect.startIndex = vertices.length;
vertices.push( vec3(-0.5, -0.5, 0) );
vertices.push( vec3(0.5, -0.5, 0) );
vertices.push( vec3(-0.5, 0.5, 0) );
vertices.push( vec3(0.5, 0.5, 0) );
normals.push( normalize(vec3(0, 0, 1)) );
normals.push( normalize(vec3(0, 0, 1)) );
normals.push( normalize(vec3(0, 0, 1)) );
normals.push( normalize(vec3(0, 0, 1)) );

Rect.prototype.setTrs = function(trs){
  this.trs = trs;
}
Rect.prototype.draw = function(){
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(this.trs) );
    gl.uniform4fv(colLoc, flatten(this.color));
    gl.drawArrays(gl.TRIANGLE_STRIP, Rect.startIndex, Rect.NV);
}

/* ----------------  TRIANGLE ---------------- */
function Triangle(color){
  this.color = color;
  this.trs = mat4();
}
Triangle.NV = 3;
Triangle.startIndex = vertices.length;
vertices.push( vec3(-0.5, -0.5, 0) );
vertices.push( vec3(0.5, -0.5, 0) );
vertices.push( vec3(0, 0.5, 0) );
normals.push( normalize(vec3(0, 0, 1)) );
normals.push( normalize(vec3(0, 0, 1)) );
normals.push( normalize(vec3(0, 0, 1)) );

Triangle.prototype.setTrs = function(trs){
  this.trs = trs;
}
Triangle.prototype.draw = function(){
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(this.trs) );
    gl.uniform4fv(colLoc, flatten(this.color));
    gl.drawArrays(gl.TRIANGLES, Triangle.startIndex, Triangle.NV);
}




/* ----------------  CUBE ---------------- */
// loc, widht, length, height, color
//defined from center
function Cube(loc, width, length, height, color){
  this.color = color;
  var s = scalem(width, length, height);
  var t = translate(loc[0], loc[1], loc[2]);
  var ts = mult( t, s );
  this.trs = ts;
}
Cube.startIndex = vertices.length;
var i = [
  vec3(-0.5, 0.5, -0.5),
  vec3(-0.5, -0.5, -0.5),
  vec3(0.5, -0.5, -0.5),
  vec3(0.5, 0.5, -0.5),

  vec3(-0.5, 0.5, 0.5),
  vec3(-0.5, -0.5, 0.5),
  vec3(0.5, -0.5, 0.5),
  vec3(0.5, 0.5, 0.5)
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
//front
face(0, 1, 2, 3);
// right
face(3, 2, 6, 7);
//back
face(7, 6, 5, 4);
//left
face(4, 5, 1, 0);
//top
face(4, 0, 3, 7);
//bottom
face(1, 5, 6, 2);

// front, right, back, left, top, bottom
//front
normals.push( normalize(vec3(0, 1, 0)) );
normals.push( normalize(vec3(0, 1, 0)) );
normals.push( normalize(vec3(0, 1, 0)) );
normals.push( normalize(vec3(0, 1, 0)) );
normals.push( normalize(vec3(0, 1, 0)) );
normals.push( normalize(vec3(0, 1, 0)) );
//right
normals.push( normalize(vec3(1, 0, 0)) );
normals.push( normalize(vec3(1, 0, 0)) );
normals.push( normalize(vec3(1, 0, 0)) );
normals.push( normalize(vec3(1, 0, 0)) );
normals.push( normalize(vec3(1, 0, 0)) );
normals.push( normalize(vec3(1, 0, 0)) );
//back
normals.push( normalize(vec3(0, -1, 0)) );
normals.push( normalize(vec3(0, -1, 0)) );
normals.push( normalize(vec3(0, -1, 0)) );
normals.push( normalize(vec3(0, -1, 0)) );
normals.push( normalize(vec3(0, -1, 0)) );
normals.push( normalize(vec3(0, -1, 0)) );
//left
normals.push( normalize(vec3(-1, 0, 0)) );
normals.push( normalize(vec3(-1, 0, 0)) );
normals.push( normalize(vec3(-1, 0, 0)) );
normals.push( normalize(vec3(-1, 0, 0)) );
normals.push( normalize(vec3(-1, 0, 0)) );
normals.push( normalize(vec3(-1, 0, 0)) );
//top
normals.push( normalize(vec3(0, 0, -1)) );
normals.push( normalize(vec3(0, 0, -1)) );
normals.push( normalize(vec3(0, 0, -1)) );
normals.push( normalize(vec3(0, 0, -1)) );
normals.push( normalize(vec3(0, 0, -1)) );
normals.push( normalize(vec3(0, 0, -1)) );
//bottom
normals.push( normalize(vec3(0, 0, 1)) );
normals.push( normalize(vec3(0, 0, 1)) );
normals.push( normalize(vec3(0, 0, 1)) );
normals.push( normalize(vec3(0, 0, 1)) );
normals.push( normalize(vec3(0, 0, 1)) );
normals.push( normalize(vec3(0, 0, 1)) );


Cube.prototype.draw = function(){
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(this.trs) );
    gl.uniform4fv(colLoc, flatten(this.color));
    gl.drawArrays(gl.TRIANGLES, Cube.startIndex, Cube.NV);
}
Cube.prototype.setTrs = function(trs){
  this.trs = trs;
}


/* ----------------  CIRCLE ---------------- */
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
  gl.uniform4fv(colLoc, flatten(this.color));
  gl.drawArrays(gl.TRIANGLE_FAN, Circle.startIndex, Circle.NV);
}

for(var i = 0; i < Circle.NV; ++i)
  normals.push( normalize(vec3(0, 0, 1)) );


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

  normals.push( normalize(vec3(Math.cos(i*angle), Math.sin(i*angle), 0)) );
  normals.push( normalize(vec3(Math.cos(i*angle), Math.sin(i*angle), 0)) );
}
vertices.push( vec3(Math.cos(0*angle)*0.5, Math.sin(0*angle)*0.5, -0.5) );
vertices.push( vec3(Math.cos(0*angle)*0.5, Math.sin(0*angle)*0.5, 0.5) );
  normals.push( normalize(vec3(Math.cos(0*angle), Math.sin(0*angle), 0)) );
  normals.push( normalize(vec3(Math.cos(0*angle), Math.sin(0*angle), 0)) );

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
//------------------------ TRIANGLE FAN, NORMALS DONT WORK ------------------------//
// Cone.startIndex = vertices.length;
// Cone.NV = 50;
// var angle = Math.PI*2/(Cone.NV-1-1);
// vertices.push( vec3(0, 0, 0.5) );
// normals.push( normalize(vec3(0, 0, 1)) );
// for(var i = 0; i < Cone.NV-1-1; ++i){
//   vertices.push( vec3( Math.cos(i*angle)*0.5, Math.sin(i*angle)*0.5, -0.5) );
//
//   // TODO: these normals need to be fixed
//   normals.push( normalize(vec3(Math.cos(i*angle), Math.sin(i*angle), 0)) );
// }
// vertices.push( vec3( Math.cos(0*angle)*0.5, Math.sin(0*angle)*0.5, -0.5) );
// normals.push( normalize(vec3(Math.cos(0*angle), Math.sin(0*angle), 0)) );

//------------------------ TRIANGLES, NORMALS WORK ------------------------//
Cone.startIndex = vertices.length;
Cone.NV = 3*150;
var angle = Math.PI*2/(Cone.NV/3-1);
for(var i = 0; i < Cone.NV/3; ++i){
  vertices.push( vec3( Math.cos(i*angle)*0.5, Math.sin(i*angle)*0.5, -0.5) );
  vertices.push( vec3( Math.cos((i+1)*angle)*0.5, Math.sin((i+1)*angle)*0.5, -0.5) );
  vertices.push( vec3( 0, 0, 0.5) );

  // TODO: these normals need to be fixed
  var v1 = subtract( vertices[vertices.length-1], vertices[vertices.length-2] );
  var v2 = subtract( vertices[vertices.length-1], vertices[vertices.length-3] );
  var normal = cross(v2, v1);
  normals.push(normal);
  normals.push(normal);
  normals.push(normal);
}

  // vertices.push( vec3( Math.cos(0*angle)*0.5, Math.sin(0*angle)*0.5, -0.5) );
  // vertices.push( vec3( Math.cos(1*angle)*0.5, Math.sin(1*angle)*0.5, -0.5) );
  // vertices.push( vec3( 0, 0, 0.5) );
  // var v1 = subtract( vertices[vertices.length-1], vertices[vertices.length-2] );
  // var v2 = subtract( vertices[vertices.length-1], vertices[vertices.length-3] );
  // var normal = cross(v2, v1);
  // normals.push(normal);
  // normals.push(normal);
  // normals.push(normal);



Cone.prototype.draw = function(){
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(this.trs) );
  gl.uniform4fv(colLoc, flatten(this.color))

  //------------------------ TRIANGLE FAN, NORMALS DONT WORK ------------------------//
  // gl.drawArrays(gl.TRIANGLE_FAN, Cone.startIndex, Cone.NV);

  //------------------------ TRIANGLES, NORMALS WORK ------------------------//
  gl.drawArrays(gl.TRIANGLES, Cone.startIndex, Cone.NV);

  this.circle.draw();
}
Cone.prototype.setTrs = function(trs){
  this.trs = trs;
  var circleT = translate( 0, 0, -0.5);
  var circleR = rotate(180, [1,0,0]);
  this.circle.trs = mult( trs,  mult(circleT, circleR) );
}

/* ----------------  TREE ---------------- */
function Tree(loc, diam, height){
  this.loc = loc;
  this.diam = diam;
  this.height = height;
  this.trs = mat4();
  this.cylinder = new Cylinder( vec4(0.3, 0.2, 0.04, 1.0) );
  this.cone = new Cone( vec4(0.1, 0.6, 0.1, 1.0) );
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
  var coneT = translate(0, 0, 1 + (0.6*0.5)); // 0.6*0.3 is accounting for the scaling

  this.cone.setTrs( mult(this.trs, mult(coneT, coneS)) );
  // console.log(coneT);
}

/* ----------------  ROOF ---------------- */
function Roof(color){
  this.color = color;
  this.trs = mat4();

  this.frontRect = new Rect( vec3(0,0,0), 1, 1, this.color);
  this.backRect = new Rect( vec3(0,0,0), 1, 1, this.color);
  this.leftTriangle = new Triangle(this.color);
  this.rightTriangle = new Triangle(this.color);

  this.setTrs(mat4());
}
Roof.prototype.setTrs = function(trs){
  var hyp = 0.5/Math.cos(radians(45));
  var height = (Math.sin(radians(45))*hyp);
  var frontRectTrs = mult( translate(0, -0.25, height/2), mult( rotate(45, [1,0,0]), scalem(1, hyp, 1) ) );
  this.frontRect.setTrs(mult(trs, frontRectTrs));

  var backRectTrs = mult( translate(0, 0.25, height/2), mult( rotate(180-45, [1,0,0]), scalem(1, hyp, 1) ) );
  this.backRect.setTrs(mult(trs, backRectTrs));

  var leftTriangleTrs = mult( translate(-0.5,0,height/2), mult( mult( rotate(90+180, [0,0,1]), rotate(90, [1,0,0]) ) , scalem(1, height, 1) ) );
  this.leftTriangle.setTrs( mult(trs, leftTriangleTrs));

  var rightTriangleTrs = mult( translate(0.5,0,height/2), mult( mult( rotate(90, [0,0,1]), rotate(90, [1,0,0]) ) , scalem(1, height, 1) ) );
  this.rightTriangle.setTrs( mult(trs, rightTriangleTrs));
}
Roof.prototype.draw = function(){
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(this.trs) );
  gl.uniform4fv(colLoc, flatten(this.color));

  this.frontRect.draw();
  this.backRect.draw();
  this.leftTriangle.draw();
  this.rightTriangle.draw();

  // gl.drawArrays(gl.TRIANGLE_STRIP, Roof.frontRectStartIndex, Roof.rectNv);
  // gl.drawArrays(gl.TRIANGLE_STRIP, Roof.backRectStartIndex, Roof.rectNv);
  // gl.drawArrays(gl.TRIANGLES, Roof.leftTriStartIndex, Roof.triNv);
  // gl.drawArrays(gl.TRIANGLES, Roof.rightTriStartIndex, Roof.triNv);
}
  // var w = Parthenon.WIDTH;
  // var l = Parthenon.LENGTH;
  // var h = Parthenon.HEIGHT;
  // var points = [
  //    vec3(-w/2, -l/2, h/2),
  //    vec3(w/2, -l/2, h/2),
  //    vec3(w/2, l/2, h/2),
  //    vec3(-w/2, 0, h/2+h/2/8),
  //    vec3(w/2, 0,  h/2+h/2/8)
  // ];
  // Roof.rectNv = 4;
  // Roof.frontRectStartIndex = vertices.length;
  // // push front Rect
  // vertices.push(vec3(points[5]), vec3(points[2]), vec3(points[3]), vec3(points[6]));
  //
  // Roof.backRectStartIndex = vertices.length;
  // // push back Rect
  // vertices.push(vec3(points[1]), vec3(points[5]), vec3(points[6]), vec3(points[4]));
  //
  // Roof.triNv = 3;
  // Roof.leftTriStartIndex = vertices.length;
  // // push left triangle
  // vertices.push(vec3(points[1]), vec3(points[2]), vec3(points[5]));
  //
  // Roof.rightTriStartIndex = vertices.length;
  // // push right triangle
  // vertices.push(vec3(points[3]), vec3(points[4]), vec3(points[6]));







/* ----------------  PARTHENON ---------------- */
function Parthenon(vLoc, fScale){
  this.loc = vLoc;
  this.width = Parthenon.WIDTH*fScale;
  this.length = Parthenon.LENGTH*fScale;
  this.height = Parthenon.HEIGHT*fScale;
  this.lintelHeight = 0.5*fScale;
  this.color = vec4(0.65, 0.65, 0.65, 1);
  this.base = new Rect( vec3(0, 0, 0.01), 8, 13, this.color );
  this.pillars = [];
  this.lintels = [];
  this.roof = new Roof(this.color);
  this.trs = null;
  // along width
  var diam = this.length/4/2;
  for(var i = 0; i < 4; ++i){
    var y = this.loc[1]-this.length/2 + (diam/2) + (i*(diam+this.length/3/2));
    var topX = this.loc[0]+this.width/2-(diam/2);
    var bottomX = this.loc[0]-this.width/2 + diam/2;
    var top = new Cylinder(this.color);
    var bottom = new Cylinder(this.color);
    // var top = new Cylinder(vec4(0.1,0.1,0.1,1));
    // var bottom = new Cylinder(vec4(0.1,0.1,0.1,1));
    var s = scalem(diam, diam, this.height); // maybe this shouldnt be height
    top.trs = mult( translate(topX, y, this.height/2), s );
    bottom.trs = mult( translate(bottomX, y, this.height/2), s );
    this.pillars.push(top);
    this.pillars.push(bottom);
  }
  // along length
  var gap = (this.width-diam*6)/5;
  for(var i = 1; i < 5; ++i){
    var x = this.loc[0]-this.width/2 + (diam/2) + (i*(diam+gap));//diam+this.width/5/2));
    var topY = this.loc[1]+this.length/2-(diam/2);
    var bottomY = this.loc[1]-this.length/2+diam/2;
    var top = new Cylinder(this.color);
    var bottom = new Cylinder(this.color);
    // var top = new Cylinder(vec4(0.1,0.1,0.1,1));
    // var bottom = new Cylinder(vec4(0.1,0.1,0.1,1));
    var s = scalem(diam, diam, this.height); // maybe this shouldnt be height
    top.setTrs( mult( translate(x, topY, this.height/2), s ) );
    bottom.setTrs( mult( translate(x, bottomY, this.height/2), s ) );
    this.pillars.push(top);
    this.pillars.push(bottom);
  }
  // lintels
  // loc, widht, length, height, color
  this.lintels.push( new Cube( vec3(this.loc[0], this.loc[1]-this.length/2+diam/2, this.height+0.25*fScale),
                    this.width, diam, this.lintelHeight, this.color) );
  this.lintels.push( new Cube( vec3(this.loc[0], this.loc[1]+this.length/2-diam/2, this.height+0.25*fScale),
                    this.width, diam, this.lintelHeight, this.color) );
  this.lintels.push( new Cube( vec3(this.loc[0]-this.width/2+diam/2, this.loc[1], this.height+0.25*fScale),
                    diam, this.length, this.lintelHeight, this.color) );
  this.lintels.push( new Cube( vec3(this.loc[0]+this.width/2-diam/2, this.loc[1], this.height+0.25*fScale),
                    diam, this.length, this.lintelHeight, this.color) );


  var s = scalem(this.width, this.length, 1);
  // var s = scalem(this.width, this.length, this.height);
  var t = translate(vLoc[0], vLoc[1], vLoc[2]);
  this.setTrs( mult( t, s ) );
}
Parthenon.prototype.draw = function(){
  this.base.draw();
  this.roof.draw();
  for(var i = 0; i < this.pillars.length; ++i){
    this.pillars[i].draw();
  }
  for(var i = 0; i < this.lintels.length; ++i){
    this.lintels[i].draw();
  }

}
Parthenon.prototype.setTrs = function(trs){
  this.trs = trs;

  var baseT = translate(0, 0, -this.height/2+0.01);
  this.base.trs = mult(baseT, this.trs);

  this.roof.setTrs( mult( translate(this.loc[0], this.loc[1], this.loc[2] + this.height/2 + this.lintelHeight), scalem(this.width, this.length, this.height) ) );
}
// Parthenon.WIDTH = 8;
// Parthenon.HEIGHT = 8;
// Parthenon.LENGTH = 13;

Parthenon.WIDTH = 13;
Parthenon.HEIGHT = 8;
Parthenon.LENGTH = 8;
