JLD.updateModel = function(dt) {

	for(var key in JLD.particles) {
		if(JLD.particles.hasOwnProperty(key)) {
			var particle = JLD.particles[key];

			particle.y += dt * particle.vY;
			particle.x += dt * particle.vX;
		}
	}
};

JLD.randomAddParticles = function(dt) {

	if(Math.random() < dt/200) {
		JLD.particles[Math.random()*1000000|0] = {
			x: Math.random(),
			y: -1+Math.random(),
			vY: 0.00015 * Math.random(),
			vX: 0.0001 * (Math.random()-0.5),
			r: 0.035 * Math.random()+0.01
		}
	}

};