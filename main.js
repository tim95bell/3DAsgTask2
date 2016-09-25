"use strict";

var canvas;
var gl;

//perspective
var near = 1.0;
var far = 300;

var fovy = 27.0;
var aspectRatio;

var eye = vec3(0.0, -48.0, 2.0);
var at = vec3(0.0, 0.0, 2.0);
var up = vec3(0.0, 0.0, 1.0);

// uniforms
var worldView, projection;
var worldViewLoc, projLoc, colLoc, modelViewLoc;

// movement
var left, right, foward, backward;
left = right = foward = backward = false;
// foward move is the equivilant of at, except does not get rotated up and down
var fowardMove;

// pause and mouse loc system
var paused = true;
var clickToPlay;

// objects
//trees
var trees = [];
//grass
var grassSize = 100;
var grass = new Rect( vec3(0, 0, 0), grassSize, grassSize, vec4(0.4, 0.8, 0.2, 1.0) );
//paths
var path1 = new Rect( vec3(-5, 0, 0.001), 2, grassSize, vec4(0.0, 0.0, 0.0, 1.0) );
var path2 = new Rect( vec3(5, 0, 0.001), 2, grassSize, vec4(0.0, 0.0, 0.0, 1.0) );
//parthenon
var parthenonScale = 1.4;
var parthenon = new Parthenon(vec3(0, grassSize/2-(Parthenon.LENGTH/2*parthenonScale), Parthenon.HEIGHT/2*parthenonScale), parthenonScale);

window.onload = function init() {
    genTrees();
    clickToPlay = document.getElementById("clickToPlay");
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    aspectRatio = canvas.width/canvas.height;

    gl.clearColor( 0.6, 0.8, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);


    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // uniforms
    colLoc = gl.getUniformLocation( program, "color" );
    worldViewLoc = gl.getUniformLocation( program, "worldView" );
    modelViewLoc = gl.getUniformLocation( program, "modelView" );
    projLoc = gl.getUniformLocation( program, "projection" );

    // create and send perspective projection
    var projection = perspective(fovy, aspectRatio, near, far);
    gl.uniformMatrix4fv(projLoc, false, flatten(projection));

    window.onkeydown = function(event) {
      if(paused)
        return;

  		var key = String.fromCharCode(event.keyCode);
  	  // var fowardV = subtract(at, eye);
      // var rightDirectionV = cross(fowardV, up);
  		switch( key ) {
  		  case 'W':
          foward = true;
  			   break;
  		  case 'S':
          backward = true;
  			   break;
  		  case 'A':
          left = true;
  		    break;
  		  case 'D':
          right = true;
  		    break;
          // dont do rotation bellow as it is done with mouse
  		  // case 'Q':
        //   var newDirV = add(at, normalize(rightDirectionV) );
        //   at = subtract(newDirV, at);
        //   at = scale(fowardV.length, at);
        //   at = newDirV;
  		  //   break;
  		  // case 'E':
        //   var newDirV = subtract(at, normalize(rightDirectionV) );
        //   at = subtract(newDirV, at);
        //   at = scale(fowardV.length, at);
        //   at = newDirV;
  		  //   break;
  		}
  	};

    document.onkeyup = function(event){
      var key = String.fromCharCode(event.keyCode);
      // escape
      if(event.keyCode == 27){
        paused = true;
        clickToPlay.style.display = "";
        return;
      }

      switch(key){
        case 'A':
          left = false;
          break;
        case 'D':
          right = false;
          break;
        case 'W':
          foward = false;
          break;
        case 'S':
          backward = false;
          break;
      }
    };

    // cross compatible pointer lock
    canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

  document.onclick = function(event){
    if(event.clientX > 0 && event.clientX < canvas.width && event.clientY > 0 && event.clientY < canvas.height){
      clickToPlay.style.display = "none";
      canvas.requestPointerLock();
      paused = false;
    }
    render();
  };

  document.onmousemove = function(e){
    if(paused)
      return;

    var x = e.movementX;
    var y = e.movementY;

    var fowardV = subtract(at, eye);
    // var fowardDirectionV = normalize(fowardV);
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
  };

  render();
}

function update(){
  var moveLeft = left && !right;
  var moveRight = right && !left;
  var moveFoward = foward && !backward;
  var moveBackward = backward && !foward;

  // exit if no movement
  if( !(moveLeft || moveRight || moveFoward || moveBackward) )
    return;

  var fowardV = subtract(at, eye);
  var fowardDirectionV = normalize(fowardV);
  var rightDirectionV = cross(fowardV, up);
  var speed = 0.4;

  // keep speed the same when moving diagonal
  if( (moveLeft || moveRight) && (moveFoward || moveBackward) ){
    speed *= 0.707;
  }

  var fowardAdd = scale(speed, fowardDirectionV);
  var sideAdd = scale(speed, rightDirectionV);

  if(moveFoward){
    at = add(at, fowardAdd);
    eye = add(eye, fowardAdd);
  } else if(moveBackward){
    at = subtract(at, fowardAdd);
    eye = subtract(eye, fowardAdd);
  }

  if(moveLeft){
    at = subtract(at, sideAdd);
    eye = subtract(eye, sideAdd);
  } else if(moveRight){
    at = add(at, sideAdd);
    eye = add(eye, sideAdd);
  }
} // end update()

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  update();

  // set worldview
  worldView = lookAt(eye, at, up);
  gl.uniformMatrix4fv(worldViewLoc, false, flatten(worldView));

  // draw grass
  grass.draw();
  // draw paths
  path1.draw();
  path2.draw();
  // draw trees
  for(var i = 0; i < trees.length; ++i)
    trees[i].draw();
  // draw parthenon
  parthenon.draw();

  // only update if not paused, otherwise cannot be moving
  if(!paused)
    requestAnimFrame(render);
}

function genTrees(){
  // try to add 1000 trees
  for(var i = 0; i < 1000; ++i){
    // diameter = x + diameter * 4
    // loc is in the center of the tree
    var fits = false;
    var tries = 0;
    // keep trying to place this tree while it doesnt fit
    while(!fits){
      ++tries;
      if(tries > 50)
        return;

      fits = true;
      var loc = vec2( Math.random()*(grassSize*0.9) - (grassSize/2*0.9),
                  Math.random()*(grassSize*0.9) - (grassSize/2*0.9) );
      var diam = Math.random()*2+0.5;
      // check fits on grass
      if( loc[0] + diam/2 > grassSize/2 || loc[0] - diam/2 < -grassSize/2 || loc[1] + diam/2 > grassSize/2 || loc[1] -diam/2 < -grassSize/2){
        fits = false;
      }
      // check doesnt colide with another tree
      for(var j = 0; j < trees.length; ++j){
        var distance = length( subtract(loc, trees[j].loc) );
        if( distance < diam*4/2 + trees[j].diam*4/2)
          fits = false;

      }
      // check not on a track
      if(loc[0] + diam*1 > path1.loc[0]-path1.width/2 && loc[0] - diam*1 < path1.loc[0]+path1.width/2 ||
      loc[0] + diam*1 > path2.loc[0]-path2.width/2 && loc[0] - diam*1 < path2.loc[0]+path2.width/2) {
        fits = false;
      }
      //check not colliding with building
      if(loc[0] + diam*4 > parthenon.loc[0]-parthenon.width/2 && loc[0] - diam*4 < parthenon.loc[0] + parthenon.width/2 &&
         loc[1] + diam*4 > parthenon.loc[1]-parthenon.length/2 && loc[1] - diam*4 < parthenon.loc[1] + parthenon.length/2 ){
        fits = false;
      }

      // if it fits then add it
      if(fits){
        var height = Math.random()*3+2.5;
        trees.push( new Tree(loc, diam, height) );
      }
    } // end while
  } // end for

} // end genTrees()
