

var vertices = [];


/* ----------------  RECT ---------------- */
function Rect(rectVertices, color){
  this.color = color;
  this.startIndex = vertices.length;
  vertices = vertices.concat(rectVertices);
}
Rect.NV = 4;

Rect.prototype.draw = function(){
  // var m = mat4(2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  var m = mat4();
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(m) );
    gl.uniform4fv(colLoc, flatten(this.color));
    gl.drawArrays(gl.TRIANGLE_FAN, this.startIndex, Rect.NV);
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
var angle = Math.PI*2/Circle.NV;
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
  this.bottomCircle = new Circle(vec4(0,0,0,1));
  this.topCircle = new Circle(vec4(0,0,0,1));
  this.setTrs = function(trs){
    this.trs = trs;
    var bottomT = translate(0, 0, -0.5);
    var topT = translate(0, 0, 0.5);
    this.bottomCircle.trs = mult(trs, bottomT);
    this.topCircle.trs = mult(trs, topT);
  }
}
Cylinder.bodyStartIndex = vertices.length;
Cylinder.NV = (Circle.NV-2)*2+2;
// angle = Math.PI*2/Circle.NV;
// angle = Math.PI*2/((Cylinder.NV-4)/2);
angle = Math.PI*2/((Cylinder.NV)/2-2);
angle = Math.PI*2/((Cylinder.NV-2)/2);
// angle *= 2;
for(var i = 0; i < (Cylinder.NV-2)/2; ++i){
  vertices.push( vec3(Math.cos(i*angle)*0.5, Math.sin(i*angle)*0.5, -0.5) );
  vertices.push( vec3(Math.cos(i*angle)*0.5, Math.sin(i*angle)*0.5, 0.5) );
}
vertices.push( vec3(Math.cos(0*angle)*0.5, Math.sin(0*angle)*0.5, -0.5) );
vertices.push( vec3(Math.cos(0*angle)*0.5, Math.sin(0*angle)*0.5, 0.5) );

Cylinder.prototype.draw = function(){
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(this.trs) );
  gl.uniform4fv(colLoc, flatten(this.color))
  gl.drawArrays(gl.TRIANGLE_STRIP, Cylinder.bodyStartIndex, Cylinder.NV);
  this.bottomCircle.draw();
  this.topCircle.draw();
}





// var grass = {
//   vertices: [
//   vec3(50.0, -50.0, 0.0),
// 	vec3(50.0, 50.0, 0.0),
// 	vec3(-50.0, 50.0, 0.0),
// 	vec3(-50.0, -50.0, 0.0)
//   ],
//   NV: 4,
//   color: vec4(0.4, 0.8, 0.2, 1.0),
//   startIndex: 0,
//   draw: function(){
//     gl.uniform4fv(colLoc, flatten(this.color));
//     gl.drawArrays(gl.TRIANGLE_FAN, this.startIndex, this.NV);
//   }
// };
// vertices = vertices.concat(grass.vertices);
