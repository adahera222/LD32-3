JLD.updateModel = function(dt) {
	for(var key in JLD.particles) {
		if(JLD.particles.hasOwnProperty(key)) {
			var particle = JLD.particles[key];

			particle.y += dt * particle.vY;
			particle.x += dt * particle.vX;
		}
	}
};

JLD.sumFractions = function(f1,f2) {
	var s = {n:0,d:1};

	if(f1.d == f2.d) {
		s.d = f1.d;
		s.n = f1.n+f2.n;
	}else{
		s.d = f1.d*f2.d;
		s.n = f1.n*f2.d + f2.n*f1.d;
	}

	JLD.reduceFraction(s);

	return s;
};

JLD.reduceFraction = function(fraction) {
	var factorsN = JLD.getPrimeFactors(fraction.n);
	var factorsD = JLD.getPrimeFactors(fraction.d);

	for(var key in factorsN) {
		if(factorsN.hasOwnProperty(key)) {
			if(factorsD[key] && factorsD[key] > 0 && factorsN[key] > 0) {
				var power = Math.min(factorsD[key],factorsN[key]);
				fraction.n /= Math.pow(key,power);
				fraction.d /= Math.pow(key,power);
			}
		}
	}
};

JLD.getPrimeFactors = function(n) {
	var factors = {};
	var i = 2;
	while(i <= n) {
		if(n % i == 0) {
			n /= i;
			if(!factors[i]) {
				factors[i] = 1;
			}else{
				factors[i]++;
			}
		}else{
			i++;
		}
	}
	return factors;
};

JLD.randomAddParticles = function(dt) {

	var denoms = [1,2,3,5,7,9];

	if(Math.random() < dt/200) {
		JLD.particles[Math.random()*1000000|0] = {
			x: Math.random(),
			y: -1+Math.random(),
			vY: 0.00015 * Math.random(),
			vX: 0.0001 * (Math.random()-0.5),
			r: 0.02 * Math.random()+0.02,
			color: JLD.scoreColors[JLD.score % JLD.scoreColors.length],
			value: {n: 1, d: denoms[denoms.length*Math.random()|0]}
		}
	}

};