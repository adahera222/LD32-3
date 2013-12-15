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

JLD.getGaussian = function(u,std) {
	return u+std*Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());
};

JLD.getLaplacian = function(u,b) {
	return u-b*Math.log(1-Math.random());
};


JLD.getNewParticleFraction = function() {
	var denoms = [2,3,4,5,6,7,8,9,10];
	var nums = [1,2,3,4,5,6,7,8,9,10];

	var mean = 0.5*JLD.score+1;
	var b = mean*1.5;

	var d = 2+(JLD.getLaplacian(mean,b)|0);
	var n = d;

	while(n >= d) {
		n = 1+(JLD.getLaplacian(0,b)|0);
	}

	return {n:n,d:d};
};

JLD.randomAddParticles = function(dt,start) {
	var n = Object.keys(JLD.particles).length;

	var start = n < 5;
	if(Math.random() < dt/200 && n < 100 || n < 20) {
		JLD.particles[Math.random()*1000000|0] = {
			x: Math.random(),
			y: (start?0:-1)+Math.random(),
			vY: 0.00005 * (0.5+0.5*Math.random()) * (JLD.score*0.3+1),
			vX: 0.0001 * (Math.random()-0.5) * (JLD.score*0.3+1),
			r: 0.04,
			// color: JLD.scoreColors[JLD.score % JLD.scoreColors.length],
			value: JLD.getNewParticleFraction()
		}
	}

};