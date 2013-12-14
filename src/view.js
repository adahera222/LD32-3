JLD.drawClear = function() {
	var ctx = JLD.ctx;
	ctx.save();

	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	ctx.clearRect(0,0,w,h);

	ctx.restore();
};

JLD.drawGame = function() {
	var ctx = JLD.ctx;
	ctx.save();

	var w = JLD.canvas.width;
	var h = JLD.canvas.height;

	ctx.fillStyle = 'steelblue';
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
		}
	}

	ctx.fill();

	ctx.restore();
};