(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function() {

	Event.observe(window, 'load', main);

	var WIDTH = 400;
	var HEIGHT = 200;

	var canvas = null;
	var context = null;

	var groundCanvas = null;
	var groundContext = null;
	var groundImage = null;

	var scaleCanvas = null;
	var scaleContext = null;

	// Physics Variables
	var lastTime = null;
	var dt = null;
	var av = 0;
	var lv = 0;
	var px = 953;
	var py = 792;
	var pa = 0;

	// Viewport Settings
	var omega = 120 * Math.PI/180;
	var theta = 60 * Math.PI/180;
	var alpha = 30 * Math.PI/180;
	var h = 15;
	var H = 180;
	var LH = 1;
	var modes = [];

	// Input Settings
	var codeOffset = 37;
	var LEFT 	= 0;
	var UP 		= 1;
	var RIGHT 	= 2;
	var DOWN 	= 3;
	var downKeys = [false, false, false, false];


	MAX_VELOCITY = 100/1000;
	ANGULAR_VELOCITY = Math.PI/(4 * 1000);

	var images = {
		'img/mariocircuit.png': null
	};

	function main()
	{

		canvas = new Element('canvas', { 'width': WIDTH, 'height': HEIGHT});
		context = canvas.getContext("2d");
		$$('body')[0].insert(canvas);

		Event.observe(window, 'keydown', handleKeydown);
		Event.observe(window, 'keyup', handleKeyup);

		canvas.observe('mousedown', handleMousedown);
		canvas.observe('mouseup', handleMouseup);
		canvas.observe('mouseover', function() {
			Event.observe(document, 'touchmove', function(e){ e.preventDefault(); });
		});

		loadImages();
	}

	function loadImages()
	{
		for(var key in images) {
			console.log(key);
			if(images[key] == null) {
				var img = new Image();
				img.addEventListener("load", handleLoadImageSuccess.bindAsEventListener(this, key), false);
				img.addEventListener("error", handleLoadImageFailure.bindAsEventListener(this), false);
				img.src = key;
				return;
			}
		}
		handleLoadComplete();
	}

	function handleLoadImageSuccess(event, key)
	{
		images[key] = event.target;
		loadImages();
	}

	function handleLoadImageFailure(event)
	{
		loadImages();
	}

	function handleLoadComplete()
	{
		window.requestAnimationFrame(update.bind(this));

		groundImage = images['img/mariocircuit.png'];
		var max = Math.max(groundImage.width, groundImage.height);

		groundCanvas = new Element('canvas', { 'width': max, 'height': max, 'style': 'width:' + max/2 + 'px;height:' + max/2 + 'px'});
		groundContext = groundCanvas.getContext("2d");
		//$$('body')[0].insert(groundCanvas);

		/*
		scaleCanvas = new Element('canvas', { 'width': max, 'height': max, 'style': 'width:' + max/2 + 'px;height:' + max/2 + 'px'});
		scaleContext = scaleCanvas.getContext("2d");
		$$('body')[0].insert(scaleCanvas);
		*/

		// MODES
		var sx, sy, sw, sh, dx, dw;

		var	w = 0,
			w1 = 0,
			w2 = 0,
			d1 = 0,
			d2 = 0;

		for(var L = 1; L <= H; L++) {

			modes[L] = null;

			w1 = 2 * h * Math.tan( (Math.PI - theta)/2 + alpha*(L - 1)/H ) / Math.tan(omega/2);
			w2 = 2 * h * Math.tan( (Math.PI - theta)/2 + alpha*L/H ) / Math.tan(omega/2);
			d1 = h * Math.tan( (Math.PI - theta)/2 + alpha*(L - 1)/H );
			d2 = h * Math.tan( (Math.PI - theta)/2 + alpha*L/H );

			//w = w1 + (w2-w1)/2;
			w = w1;

			//if(d2 > groundCanvas.height) continue;

			sx = (groundCanvas.width - w)/2;
			sy = groundCanvas.height - d1;
			sw = w;
			sh = d2 - d1;

			dw = WIDTH;
			dx = 0;

			if(w > groundCanvas.width) {
				sx = 0;
				sw = groundCanvas.width;
				dw = WIDTH * (sw/w);
				dx = (WIDTH - dw) / 2;
			}

			/*
			context.drawImage(
				groundCanvas,
				sx,
				sy,
				sw,
				sh,
				dx,
				HEIGHT - L,
				dw,
				1
			);
			*/

			modes[L] = {
				'sx': sx,
				'sy': sy,
				'sw': sw,
				'sh': sh,
				'dx': dx,
				'dw': dw
			};

		}

	}

	function update(t)
	{
		window.requestAnimationFrame(update.bind(this));

		if(lastTime == null) lastTime = t;
		dt = t - lastTime;
		lastTime = t;

		lv = 0;
		av = 0;
		//if(lv < 0.05 * MAX_VELOCITY) lv = 0;
		//if(av < 0.05 * ANGULAR_VELOCITY) av = 0;

		if(downKeys[LEFT] || downKeys[RIGHT] || downKeys[UP] || downKeys[DOWN]) {
			lv = MAX_VELOCITY * ((0+downKeys[DOWN]) + (0+downKeys[UP])*-1);
			if(lv == -1) lv *= 0.5;
			av = ANGULAR_VELOCITY * ((0+downKeys[LEFT]) + (0+downKeys[RIGHT])*-1);
		}

		pa += (dt * av);
		px += (dt * lv) * Math.sin(pa);
		py += (dt * lv) * Math.cos(pa);

		// Clear the canvas
		groundCanvas.width = groundCanvas.width;
		//scaleCanvas.width = scaleCanvas.width;
		canvas.width = canvas.width;


		var dx = (groundCanvas.width/2 - px);
		var dy = (groundCanvas.height - py);

		groundContext.save();
		groundContext.translate(dx + px, dy + py);
		groundContext.rotate(pa);
		groundContext.translate((dx + px)*-1, (dy + py)*-1);
		groundContext.drawImage(groundImage, dx, dy);
		groundContext.restore();


		for(var L = 1; L <= H; L++) {
			var val = modes[L];
			if(val == undefined) continue;
			context.drawImage(
				groundCanvas,
				val.sx,
				val.sy,
				val.sw,
				val.sh,
				val.dx,
				HEIGHT - (L*LH),
				val.dw,
				LH
			);

			/*
			scaleContext.drawImage(
				groundCanvas,
				val.sx,
				val.sy,
				val.sw,
				val.sh,
				val.dx,
				val.sy,
				val.dw,
				val.sh
			);
			*/
		}

	}

	function handleKeydown(event)
	{
		var code = event.keyCode - codeOffset;
		//console.log('keydown: ' + code);
		switch(code) {
			case UP:
			case DOWN:
			case LEFT:
			case RIGHT:
				downKeys[code] = true;
				break;
		}
	}

	function handleKeyup(event)
	{
		var code = event.keyCode - codeOffset;
		//console.log('keyup: ' + code);
		switch(code) {
			case UP:
			case DOWN:
			case LEFT:
			case RIGHT:
				downKeys[code] = false;
				break;
		}
	}

	function handleMousedown(event)
	{
		if(event.layerY < HEIGHT / 3) {
			downKeys[UP] = true;
		} else if(event.layerY < HEIGHT * 2 / 3) {
			if(event.layerX < WIDTH/2) {
				downKeys[LEFT] = true;
			} else {
				downKeys[RIGHT] = true;
			}
		} else {
			downKeys[DOWN] = true;
		}


	}

	function handleMouseup(event)
	{
		downKeys[UP] = false;
		downKeys[DOWN] = false;
		downKeys[LEFT] = false;
		downKeys[RIGHT] = false;
	}

}());
