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

	ctx.fillStyle = 'white';
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
	// ctx.closePath();
	ctx.stroke();
	ctx.fill();

	var speed = Math.max(0,(JLD.score-3)/50);
	var offset = speed * JLD.time / 1000 % 2*Math.PI;
	var a = 2*Math.PI * JLD.sum.n / JLD.sum.d + offset;

	ctx.fillStyle = JLD.scoreColors[JLD.score % JLD.scoreColors.length];
	ctx.beginPath();
	ctx.moveTo(w/2+r1*Math.cos(offset),h/2+r1*Math.sin(offset));
	ctx.arc(w/2,h/2,r1,offset,a,false);
	ctx.lineTo(w/2+r2*Math.cos(a),h/2+r2*Math.sin(a));
	ctx.arc(w/2,h/2,r2,a,offset,true);
	ctx.closePath();
	ctx.fill();

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.fillStyle = 'steelblue';
	ctx.font = 0.08*(w+h)/2 + "px Lucida Console";

	ctx.fillText(JLD.sum.n,w/2,h/2-r2*0.5);
	ctx.fillText(JLD.sum.d,w/2,h/2+r2*0.5);

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
	ctx.fillText("\"You Only Get One\"",w/2,h*0.3);

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
	"rgb(255,  0,170)",
	"rgb(51, 19, 39)",
	"rgb(153, 23,102)",
	"rgb(217, 15,90)",
	"rgb(243, 71, 57)",
	"rgb(255,110, 39)",
	"rgb(255,170,  0)",
	"rgb(170,  0,255)",
	"rgb(0,170,255)"
];