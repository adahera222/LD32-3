JLD.updateModel = function(dt) {

	for(var key in JLD.particles) {
		if(JLD.particles.hasOwnProperty(key)) {
			var particle = JLD.particles[key];

			particle.y += dt * particle.vY;
		}
	}
};

JLD.randomAddParticles = function(dt) {

	if(Math.random() < dt/100) {
		JLD.particles[Math.random()*1000000|0] = {
			x: Math.random(),
			y: -1+Math.random(),
			vY: 0.001 * Math.random(),
			r: 0.015 * Math.random()
		}
	}

};