"use strict";
var JLD = {};
JLD.canvasID = "#canvas";
JLD.dirtyCanvas = true;
JLD.lastFrameTime = 0;
JLD.mousePos = {'x':0.5,'y':0.5};
JLD.mouseState = "up";

JLD.particles = {};

JLD.animationPhase = ""; // "starting", "won", "lost"
JLD.animationTimeStart = 0;
JLD.animationPhaseTimes = {
	"starting": 500,
	"won": 500,
	"lost": 3000
};

JLD.viewPage = "menu";

JLD.level = 0;
JLD.time = 0;

JLD.score = 0;
JLD.topScore = 0;

JLD.sum = {n:0,d:1};

JLD.main = function() {
	JLD.startSession();

	requestNextAnimationFrame(JLD.gameLoop);
};

window.onload = JLD.main;

JLD.startSession = function() {
	JLD.canvas = $(JLD.canvasID)[0];
	JLD.ctx = JLD.canvas.getContext("2d");

	//JLD.setLevelRenderBox();
	JLD.loadGameState();
	JLD.resizeToFit();
	// JLD.startLevel();

	JLD.dirtyCanvas = true;
	JLD.initEvents();
};

JLD.gameLoop = function(time) {
	var ctx = JLD.ctx;
	JLD.time = time;
	if(JLD.animationPhase !== "") {
		var dTime = JLD.animationPhaseTimes[JLD.animationPhase];
		if(dTime < time - JLD.animationTimeStart) {
			if(JLD.animationPhase == "lost") {
				JLD.viewPage = "menu";
			}

			JLD.animationPhase = "";
		}
	}

	if(JLD.dirtyCanvas){
		// JLD.dirtyCanvas = false;

		if(JLD.viewPage == "game") {
			JLD.drawClear();
			JLD.drawGame();
		}else if(JLD.viewPage == "menu") {
			JLD.drawClear();
			JLD.drawMenu();
		}
	}

	requestNextAnimationFrame(JLD.gameLoop);

	JLD.frameRenderTime = time - JLD.lastFrameTime;
	
	if(JLD.frameRenderTime > 100) {
		JLD.frameRenderTime = 100;
	}

	if(JLD.viewPage == "game") {
		JLD.randomAddParticles(JLD.frameRenderTime);
		JLD.updateModel(JLD.frameRenderTime);
	}
	
	JLD.lastFrameTime = time;
};

JLD.clickParticle = function(pKey) {	
	JLD.sum = JLD.sumFractions(JLD.sum,JLD.particles[pKey].value)

	delete JLD.particles[pKey];
	console.log("sum",JLD.sum);

	if(JLD.sum.n == JLD.sum.d) {
		JLD.getOne();
	}else if(JLD.sum.n > JLD.sum.d) {
		JLD.lose();
	}
};

JLD.startNewGame = function() {
	JLD.sum = {n:0,d:1};
	JLD.particles = {};
	JLD.score = 0;
	JLD.viewPage = "game";
};

JLD.getOne = function() {
	JLD.sum = {n:0,d:1};
	JLD.score++;
	JLD.animationTimeStart = JLD.time;
	JLD.animationPhase = "won";
	JLD.saveStats();
};

JLD.lose = function() {
	// JLD.sum = {n:0,d:1};
	// JLD.score = 0;
	// JLD.viewPage = "menu";

	JLD.animationTimeStart = JLD.time;
	JLD.animationPhase = "lost";
};

JLD.saveStats = function() {
	if(JLD.score > JLD.topScore) {
		JLD.topScore = JLD.score;
		JLD.saveGameState();
	}
};

JLD.mousemove = function(x,y){
	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	JLD.mousePos = {'x':x,'y':y};
};

JLD.gameMousedown = function(x,y) {
	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	for(var key in JLD.particles) {
		if(JLD.particles.hasOwnProperty(key)) {
			var particle = JLD.particles[key];

			var xP = particle.x;
			var yP = particle.y;
			var r = particle.r;

			var dx = (x-xP)*w/((w+h)/2);
			var dy = (y-yP)*h/((w+h)/2);
			if(dx*dx + dy*dy < r*r) {
				JLD.clickParticle(key);
				break;
			}
		}
	}
};

JLD.menuMousedown = function(x,y) {
	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	JLD.startNewGame();
};

JLD.mousedown = function(x,y) {
	JLD.mousePos = {'x':x,'y':y};
	JLD.mouseDownPos = {'x':x,'y':y};
	JLD.mouseState = "down";

	if(JLD.viewPage == "game" && JLD.animationPhase !== "lost") {
		JLD.gameMousedown(x,y);
	}else if(JLD.viewPage == "menu") {
		JLD.menuMousedown(x,y);
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

JLD.loadGameState = function(){
	if (!supports_html5_storage()) { return false; }

	var localTopScore = localStorage["JLD.topScore"];
	if(typeof localTopScore === "string") {
		JLD.topScore = JSON.parse(localTopScore);
	}
};

JLD.saveGameState = function() {
	if (!supports_html5_storage()) { return false; }
	localStorage["JLD.topScore"] = JLD.topScore;
};

// *** LocalStorage Check ***
function supports_html5_storage() {
	try{
		return 'localStorage' in window && window['localStorage'] !== null;
	}catch (e){
		return false;
	}
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
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