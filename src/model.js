JLD.updateModel = function(dt) {

	for(var key in JLD.particles) {
		if(JLD.particles.hasOwnProperty(key)) {
			var particle = JLD.particles[key];

			particle.y += dt * particle.vY;
		}
	}
};

JLD.randomAddParticles = function(dt) {

	if(Math.random() < dt/500) {
		JLD.particles[Math.random()*1000000|0] = {
			x: Math.random(),
			y: -1+Math.random(),
			vY: 0.0002 * Math.random(),
			r: 0.035 * Math.random()+0.01
		}
	}

};