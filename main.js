"use strict";

var canvas;
var gl;

var near = 1.0;
var far = 300;

var fovy = 27.0;
var aspectRatio;

var worldView, projection, modelView;
var worldViewLoc, projLoc, colLoc, modelViewLoc;

var eye = vec3(0.0, -48.0, 2.0);
var at = vec3(0.0, 0.0, 2.0);
var up = vec3(0.0, 0.0, 1.0);

var paused = true;


// TODO: fix so i can look up and down, without effecting the vertical direction of the movement.
var fowardMove;

var clickToPlay;

var grassVertices = [
  vec3(50.0, -50.0, 0.0),
  vec3(50.0, 50.0, 0.0),
  vec3(-50.0, 50.0, 0.0),
  vec3(-50.0, -50.0, 0.0)
];
var grass = new Rect( grassVertices, vec4(0.4, 0.8, 0.2, 1.0) );

var path1Vertices = [
  vec3(-3.0, -50.0, 0.001),
	vec3(-3.0, 50.0, 0.001),
	vec3(-5.0, 50.0, 0.001),
	vec3(-5.0, -50.0, 0.001)
];
var path1 = new Rect( path1Vertices, vec4(0.0, 0.0, 0.0, 1.0) );

var path2Vertices = [
  vec3(3.0, -50.0, 0.001),
	vec3(3.0, 50.0, 0.001),
	vec3(5.0, 50.0, 0.001),
	vec3(5.0, -50.0, 0.001)
];
var path2 = new Rect( path2Vertices, vec4(0.0, 0.0, 0.0, 1.0) );

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
//
// var path1 = {
//   vertices: [
//   vec3(-3.0, -50.0, 0.001),
// 	vec3(-3.0, 50.0, 0.001),
// 	vec3(-5.0, 50.0, 0.001),
// 	vec3(-5.0, -50.0, 0.001)
//   ],
//   NV: 4,
//   color: vec4(0.0, 0.0, 0.0, 1.0),
//   startIndex: 4,
//   draw: function(){
//     gl.uniform4fv(colLoc, flatten(this.color));
//     gl.drawArrays(gl.TRIANGLE_FAN, this.startIndex, this.NV);
//   }
// };
// vertices = vertices.concat(path1.vertices);
//
// var path2 = {
//   vertices: [
//   vec3(3.0, -50.0, 0.001),
// 	vec3(3.0, 50.0, 0.001),
// 	vec3(5.0, 50.0, 0.001),
// 	vec3(5.0, -50.0, 0.001)
//   ],
//   NV: 4,
//   color: vec4(0.0, 0.0, 0.0, 1.0),
//   startIndex: 8,
//   draw: function(){
//     gl.uniform4fv(colLoc, flatten(this.color));
//     gl.drawArrays(gl.TRIANGLE_FAN, this.startIndex, this.NV);
//   }
// };
// vertices = vertices.concat(path2.vertices);


window.onload = function init() {
  console.log(grass);
    clickToPlay = document.getElementById("clickToPlay");
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    aspectRatio = canvas.width/canvas.height;

    gl.clearColor( 0.6, 0.8, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    // gl.bufferData( gl.ARRAY_BUFFER, sizeof['vec3'] * (grass.NV + path1.NV), gl.STATIC_DRAW);
    // gl.bufferSubData( gl.ARRAY_BUFFER, 0, flatten(grass.vertices) );
    // gl.bufferSubData( gl.ARRAY_BUFFER, grass.NV*sizeof['vec3'], flatten(path1.vertices) );
    //gl.bufferSubData( gl.ARRAY_BUFFER, sizeof['vec3']*NVground, flatten(Block.modelVertices) );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colLoc = gl.getUniformLocation( program, "color" );
    worldViewLoc = gl.getUniformLocation( program, "worldView" );
    modelViewLoc = gl.getUniformLocation( program, "modelView" );
    projLoc = gl.getUniformLocation( program, "projection" );

    var projection = perspective(fovy, aspectRatio, near, far);
    gl.uniformMatrix4fv(projLoc, false, flatten(projection));


    window.onkeydown = function(event) {
      if(paused)
        return;

  		var key = String.fromCharCode(event.keyCode);
  	  var fowardV = subtract(at, eye);
      var fowardDirectionV = normalize(fowardV);
      var rightDirectionV = cross(fowardV, up);
  		switch( key ) {
  		  case 'W':
  			   at = add(at, fowardDirectionV);
  			   eye = add(eye, fowardDirectionV);
  			   break;
  		  case 'S':
  			   at = subtract(at, fowardDirectionV);
  			   eye = subtract(eye, fowardDirectionV);
  			   break;
  		  case 'A':
  		    at = subtract(at, rightDirectionV);
  		    eye = subtract(eye, rightDirectionV);
  		    break;
  		  case 'D':
  		    at = add(at, rightDirectionV);
  		    eye = add(eye, rightDirectionV);
  		    break;
  		  case 'Q':
          var newDirV = add(at, normalize(rightDirectionV) );
          at = subtract(newDirV, at);
          at = scale(fowardV.length, at);
          at = newDirV;
  		    break;
  		  case 'E':
          var newDirV = subtract(at, normalize(rightDirectionV) );
          at = subtract(newDirV, at);
          at = scale(fowardV.length, at);
          at = newDirV;
  		    break;
  		}
  		//  render();
  	};

    document.onkeyup = function(event){
      var key = String.fromCharCode(event.keyCode);
      // escape
      if(event.keyCode == 27){
        paused = true;
        clickToPlay.style.display = "";
      }
    };

    canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

  document.onclick = function(event){
    if(event.clientX > 0 && event.clientX < canvas.width && event.clientY > 0 && event.clientY < canvas.height){
      clickToPlay.style.display = "none";
      canvas.requestPointerLock();
      paused = false;
    }
  };

  document.onmousemove = function(e){
    if(paused)
      return;

    var x = e.movementX;
    var y = e.movementY;

    var fowardV = subtract(at, eye);
    var fowardDirectionV = normalize(fowardV);
    var rightDirectionV = cross(fowardV, up);

    // x movement
    var newDirV = add(at, scale(x, normalize(rightDirectionV)) );
    at = add(newDirV, at);
    at = scale(fowardV.length, at);
    at = newDirV;

    // y movement
    // var newDirV = add(at, scale(-y, normalize(up)) );
    // at = add(newDirV, at);
    // at = scale(fowardV.length, at);
    // at = newDirV;

    // TODO: could have at that only gets effected by x. and atLook that gets effected by x and y. then use at to move, and atLook to do look at stuff

    // render();
  };

  render();
}

var testCircle = new Circle(vec4(1,1,1,1));
var s = mat4();
s[0][0] = 4;
s[1][1] = 4;
s[2][2] = 4;
var rs = mult( rotate(90, [1, 0, 0]) , s);
var trs = mult( translate(0, 0, 3.7), rs);
testCircle.trs = trs;

var testCylinder = new Cylinder(vec4(1,1,1,1));
s = mat4();
s[0][0] = 4;
s[1][1] = 4;
s[2][2] = 4;
var rs = mult( rotate(90, [1, 0, 0]) , s);
var trs = mult( translate(0, 0, 3.7), rs);
testCylinder.setTrs(trs);

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    worldView = lookAt(eye, at, up);
    gl.uniformMatrix4fv(worldViewLoc, false, flatten(worldView));


    // draw grass
    grass.draw();

    // draw paths
    path1.draw();
    path2.draw();

    // testCircle.draw();

    testCylinder.draw();

    requestAnimFrame(render);
}
