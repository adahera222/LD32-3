"use strict";
var JLD = {};
JLD.canvasID = "#canvas";
JLD.dirtyCanvas = true;
JLD.lastFrameTime = 0;
JLD.mousePos = {'x':0.5,'y':0.5};
JLD.mouseState = "up";

JLD.particles = {};

JLD.level = 0;
JLD.time = 0;

JLD.main = function() {
	JLD.startSession();

	requestNextAnimationFrame(JLD.gameLoop);
};

window.onload = JLD.main;

JLD.startSession = function() {
	JLD.canvas = $(JLD.canvasID)[0];
	JLD.ctx = JLD.canvas.getContext("2d");

	//JLD.setLevelRenderBox();
	// JLD.loadGameState();
	JLD.resizeToFit();
	// JLD.startLevel();

	JLD.dirtyCanvas = true;
	JLD.initEvents();
};

JLD.gameLoop = function(time) {
	var ctx = JLD.ctx;
	JLD.time = time;

	if(JLD.dirtyCanvas){
		// JLD.dirtyCanvas = false;

		JLD.drawClear();
		JLD.drawGame();
	}


	requestNextAnimationFrame(JLD.gameLoop);

	JLD.frameRenderTime = time - JLD.lastFrameTime;
	
	if(JLD.frameRenderTime > 100){
		JLD.frameRenderTime = 100;
	}
	JLD.randomAddParticles(JLD.frameRenderTime);
	JLD.updateModel(JLD.frameRenderTime);
	
	JLD.lastFrameTime = time;
};

JLD.clickParticle = function(pKey) {

	console.log("click", pKey);


};


JLD.mousemove = function(x,y){
	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	JLD.mousePos = {'x':x,'y':y};
};

JLD.mousedown = function(x,y){
	JLD.mousePos = {'x':x,'y':y};
	JLD.mouseDownPos = {'x':x,'y':y};
	JLD.mouseState = "down";

	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	for(var key in JLD.particles) {
		if(JLD.particles.hasOwnProperty(key)) {
			var particle = JLD.particles[key];

			var xP = particle.x;
			var yP = particle.y;
			var r = particle.r;

			var dx = x-xP;
			var dy = y-yP;
			// console.log(dx,dy,r);
			// if(dx*dx + dy*dy < r*r) {
			if(Math.abs(dx) < r && Math.abs(dy) < r) {
				JLD.clickParticle(key);
				break;
			}
		}
	}
};

JLD.mouseup = function(x,y) {
	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	JLD.mousePos = {'x':x,'y':y};
	JLD.mouseState = "up";
};

JLD.resizeToFit = function() {
	var w = $(window).width();
	var h = $(window).height();

	JLD.canvas.width  = w;
	JLD.canvas.height = h;

	JLD.dirtyCanvas = true;
};

// *** Event binding *** //
JLD.initEvents = function(){
	$(window).resize(function(){
		JLD.resizeToFit();
	});

	$(window).mousemove(function (e) {
		var offset = $(JLD.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		var w = JLD.canvas.width;
		var h = JLD.canvas.height;

		JLD.mousemove(x/w,y/h);
	});

	$(window).mousedown(function (e) {
		var offset = $(JLD.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		var w = JLD.canvas.width;
		var h = JLD.canvas.height;

		JLD.mousedown(x/w,y/h);
	});

	$(window).mouseup(function (e) {
		var offset = $(JLD.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		var w = JLD.canvas.width;
		var h = JLD.canvas.height;
		JLD.mouseup(x/w,y/h);
	});
};

// *** LocalStorage Check ***
function supports_html5_storage() {
	try{
		return 'localStorage' in window && window['localStorage'] !== null;
	}catch (e){
		return false;
	}
}

// Reprinted from Core HTML5 Canvas
// By David Geary
window.requestNextAnimationFrame =
	 (function () {
			var originalWebkitRequestAnimationFrame = undefined,
					wrapper = undefined,
					callback = undefined,
					geckoVersion = 0,
					userAgent = navigator.userAgent,
					index = 0,
					self = this;

			// Workaround for Chrome 10 bug where Chrome
			// does not pass the time to the animation function
			
			if (window.webkitRequestAnimationFrame) {
				 // Define the wrapper

				 wrapper = function (time) {
					 if (time === undefined) {
							time = +new Date();
					 }
					 self.callback(time);
				 };

				 // Make the switch
					
				 originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;    

				 window.webkitRequestAnimationFrame = function (callback, element) {
						self.callback = callback;

						// Browser calls the wrapper and wrapper calls the callback
						
						originalWebkitRequestAnimationFrame(wrapper, element);
				 }
			}

			// Workaround for Gecko 2.0, which has a bug in
			// mozRequestAnimationFrame() that restricts animations
			// to 30-40 fps.

			if (window.mozRequestAnimationFrame) {
				 // Check the Gecko version. Gecko is used by browsers
				 // other than Firefox. Gecko 2.0 corresponds to
				 // Firefox 4.0.
				 
				 index = userAgent.indexOf('rv:');

				 if (userAgent.indexOf('Gecko') != -1) {
						geckoVersion = userAgent.substr(index + 3, 3);

						if (geckoVersion === '2.0') {
							 // Forces the return statement to fall through
							 // to the setTimeout() function.

							 window.mozRequestAnimationFrame = undefined;
						}
				 }
			}
			
			return window.requestAnimationFrame   ||
				 window.webkitRequestAnimationFrame ||
				 window.mozRequestAnimationFrame    ||
				 window.oRequestAnimationFrame      ||
				 window.msRequestAnimationFrame     ||

				 function (callback, element) {
						var start,
								finish;


						window.setTimeout( function () {
							 start = +new Date();
							 callback(start);
							 finish = +new Date();

							 self.timeout = 1000 / 60 - (finish - start);

						}, self.timeout);
				 };
			}
	 )
();