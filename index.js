var max = 19,
  xScale = 6,
  zScale = 2.5,
  yScale = 16,
  startFrom = 0,
  dz = 640,

  // I actually want it to be slower then 60fps
  requestAnimationFrame = function(callback) {
      window.setTimeout(callback, 1000 / 24);
  };

function run() {
  var 
	ctx = document.getElementById('scene').getContext('2d'),
	graphs = [
		// Red spiral shadow
		createSpiral({
		  foreground: "#660000",
		  background: "#330000",
		  isLeft: true,
		  xLocalScale: 0.93,
		  yLocalScale: 1.01
		}),
		
		// Red spiral
		createSpiral({
		  foreground: "#ff0000",
		  background: "#440000",
		  isLeft: true,
		  xLocalScale: 1,
		  yLocalScale: 1
		}),
		
		// Cyan spiral shadow
		createSpiral({
		  foreground: "#003300",
		  background: "#000000",
		  isLeft: false,
		  xLocalScale: 0.93,
		  yLocalScale: 1.01
		}),
		
		// Cyan spiral
		createSpiral({
		  foreground: "#00ffcc",
		  background: "#005633",
		  isLeft: false,
		  xLocalScale: 1,
		  yLocalScale: 1
		})
	];

  animationLoop();


  function animationLoop() {
    renderFrame();
    if (startFrom > 1) {
      startFrom = 0;
    } else {
      startFrom += 0.1;
    }

    requestAnimationFrame(animationLoop);
  }

  function renderFrame() {
    ctx.clearRect(0, 0, 480, 640);

	for (var i=0; i<graphs.length; i++) {
		forEachStep(graphs[i]);
	}
  }

  function forEachStep(callback) {
    for (var i = -startFrom; i < max + startFrom; i += 0.08) {
      if (i < 0 || i > max) continue;
      callback(i);
    }
  }

  function createSpiral(config) {
    var sign = config.isLeft ? -1 : 1,
      background = config.background,
      foreground = config.foreground,
	  xLocalScale = config.xLocalScale || 1;
      yLocalScale = config.yLocalScale || 1;

    if (!config.isLeft) {
      background = config.foreground;
      foreground = config.background;
    }

    return function(i) {
	  
      var 
		zoff = i * Math.sin(i),
        z = dz / (dz - sign * zoff * zScale),
		color = (zoff + sign * Math.PI / 4 < 0) ? foreground : background;
	  
	  xScale *= xLocalScale;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(getX(i,        z, sign), getY( i         * yLocalScale, z));
      ctx.lineTo(getX(i + 0.03, z, sign), getY((i + 0.01) * yLocalScale, z));
      ctx.closePath();
      ctx.stroke();
	  xScale /= xLocalScale;
    };
  }

  function getX(i, z, sign) {
    return sign * i * Math.cos(i) * z * xScale + 255;
  }

  function getY(i, z) {
    return i * z * yScale + 50;
  }
}
