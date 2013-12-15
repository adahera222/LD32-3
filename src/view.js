JLD.drawClear = function() {
	var ctx = JLD.ctx;
	ctx.save();

	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	ctx.clearRect(0,0,w,h);

	ctx.restore();
};

JLD.drawParticles = function() {
	var ctx = JLD.ctx;
	ctx.save();

	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	ctx.fillStyle = JLD.scoreColors[JLD.score % JLD.scoreColors.length];
	if(JLD.animationPhase == "lost"){
		ctx.fillStyle = 'red';
	}

	ctx.beginPath();
	for(var key in JLD.particles) {
		if(JLD.particles.hasOwnProperty(key)) {
			var particle = JLD.particles[key];

			var x = particle.x * w;
			var y = particle.y * h;
			var r = particle.r * (w+h)/2;

			if(y + r < 0) {continue;}
			if(y - r > h) {
				delete JLD.particles[key];
				continue;
			}

			ctx.moveTo(x,y);
			ctx.arc(x,y,r,2*Math.PI,0,false);

		}
	}

	ctx.fill();


	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.font = 0.025*(w+h)/2 + "px Lucida Console";

	ctx.fillStyle = 'black';
	ctx.beginPath();
	for(var key in JLD.particles) {
		if(JLD.particles.hasOwnProperty(key)) {
			var particle = JLD.particles[key];

			var x = particle.x * w;
			var y = particle.y * h;
			var r = particle.r * (w+h)/2;

			if(y + r < 0 || y - r > h) {continue;}

			ctx.moveTo(x,y);
			ctx.arc(x,y,r,2*Math.PI,0,false);

			ctx.fillText(particle.value.n+"/"+particle.value.d,x,y);

		}
	}


	ctx.restore();
};

JLD.drawScore = function() {
	var ctx = JLD.ctx;
	ctx.save();

	var w = JLD.canvas.width;
	var h = JLD.canvas.height;


	ctx.textAlign = "right";
	ctx.textBaseline = "top";

	ctx.font = 0.05*(w+h)/2 + "px Lucida Console";

	ctx.fillStyle = 'steelblue';
	ctx.fillText(""+JLD.score,w,0);
	
	ctx.restore();
};

JLD.drawProgress = function() {
	var ctx = JLD.ctx;
	ctx.save();

	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	var r1 = 0.8*Math.min(w/2,h/2);
	var r2 = 0.85*r1;

	ctx.strokeStyle = 'rgba(0,0,0,1)';
	ctx.fillStyle = 'gray';
	if(JLD.score > 0){
		ctx.fillStyle = JLD.scoreColors[(JLD.score-1) % JLD.scoreColors.length];
	}

	ctx.beginPath();
	ctx.moveTo(w/2+r1,h/2);
	ctx.arc(w/2,h/2,r1,0,2*Math.PI,false);
	ctx.moveTo(w/2+r2,h/2);
	ctx.arc(w/2,h/2,r2,2*Math.PI,0,true);
	ctx.fill();

	var speed = Math.max(0,JLD.score/10);
	var offset = speed * JLD.time / 1000;
	var ratio = JLD.sum.n / JLD.sum.d;
	if(ratio > 1){ratio -= 1;}

	var a = (2*Math.PI * ratio) + offset;

	ctx.fillStyle = JLD.scoreColors[JLD.score % JLD.scoreColors.length];
	if(JLD.animationPhase == "lost"){
		ctx.fillStyle = 'red';
	}

	ctx.beginPath();
	ctx.moveTo(w/2+r1*Math.cos(offset),h/2+r1*Math.sin(offset));
	ctx.arc(w/2,h/2,r1,offset,a,false);
	ctx.lineTo(w/2+r2*Math.cos(a),h/2+r2*Math.sin(a));
	ctx.arc(w/2,h/2,r2,a,offset,true);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(w/2+r1,h/2);
	ctx.arc(w/2,h/2,r1,0,2*Math.PI,false);
	ctx.moveTo(w/2+r2,h/2);
	ctx.arc(w/2,h/2,r2,2*Math.PI,0,true);
	ctx.stroke();	

	ctx.textAlign = "center";
	ctx.textBaseline = "alphabetic";

	ctx.fillStyle = 'steelblue';
	ctx.strokeStyle = 'steelblue';

	if(JLD.animationPhase == "won") {
		ctx.font = 0.2*(w+h)/2 + "px Lucida Console";

		ctx.fillStyle = 'rgba(0,255,0,0.5)';
		ctx.textBaseline = "middle";
		ctx.fillText("1",w/2,h/2+r2*0.1);
	}else{
		if(JLD.animationPhase == "lost"){
			ctx.fillStyle = 'red';
			ctx.strokeStyle = 'red';
		}

		ctx.font = 0.08*(w+h)/2 + "px Lucida Console";

		ctx.fillText(JLD.sum.n,w/2,h/2-r2*0.1);

		ctx.textBaseline = "top";
		ctx.fillText(JLD.sum.d,w/2,h/2+r2*0.1);
		ctx.beginPath();

		ctx.lineWidth = 5;
		ctx.moveTo(w/2-r2*0.35,h/2);
		ctx.lineTo(w/2+r2*0.35,h/2);
		ctx.stroke();
	}

	ctx.restore();
};

JLD.drawGame = function() {
	JLD.drawScore();
	JLD.drawProgress();
	JLD.drawParticles();
};

JLD.drawMenu = function() {
	var ctx = JLD.ctx;
	ctx.save();

	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.fillStyle = 'steelblue';
	ctx.font = 0.08*(w+h)/2 + "px Lucida Console";
	ctx.fillText("\"Sum To One\"",w/2,h*0.3);

	// ctx.fillStyle = 'black';
	ctx.font = 0.04*(w+h)/2 + "px Lucida Console";
	ctx.fillText("Top Score: " + JLD.topScore,w/2,h*0.4);

	// ctx.fillStyle = 'steelblue';
	ctx.font = 0.04*(w+h)/2 + "px Lucida Console";
	ctx.fillText("(Click To Play)",w/2,h*0.8);

	ctx.textAlign = "right";
	ctx.font = 0.02*(w+h)/2 + "px Lucida Console";
	ctx.fillText("For Ludum Dare 28, created by Joe McCourt",w*0.95,h*0.95);
	
	ctx.restore();
};

JLD.scoreColors = [
	"rgb(128,140,255)",
	"rgb(193,128,255)",
	"rgb(235,128,255)",
	"rgb(255,128,215)",
	"rgb(255,128,155)",
	"rgb(255,169,128)",
	"rgb(255,181,128)",
	"rgb(255,223,128)",
	"rgb(233,255,128)",
	"rgb(167,255,128)",
	"rgb(128,255,160)",
	"rgb(128,255,232)",
	"rgb(128,224,255)"
];