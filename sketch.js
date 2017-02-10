var allStaticMass = [];
var allActiveMass = [];

function Mass(mv) {
	this.pos = mv;
	this.radius = 15;
	this.speed = createVector(0, 0);
	this.gravity = createVector(0, 0);
	this.colorR = random(0, 255);
	this.colorG = random(0, 255);
	this.colorB = random(0, 255);
	
	this.calcGravity = function(massArray) {
		console.log(massArray)
		for (j = 0; j < massArray.length; j++) {
			m1 = pow(this.radius, 3);
			m2 = pow(massArray[j].radius, 3);
			r	 = p5.Vector.dist(this.pos, massArray[j].pos);
			if(r < this.radius + massArray[j].radius) {r = this.radius + massArray[j].radius;}
			g = 0.00005 * (m1 * m2) / pow(r, 2);
			gVector = (massArray[j].pos.copy().sub(this.pos.copy())).normalize().mult(g); console.log(gVector.x, ", ", gVector.y)
			totalGravity.add(gVector);
		}
	}
	
	this.applyGravity = function(){
		totalGravity = createVector(0, 0);
		this.calcGravity(allStaticMass);
		this.calcGravity(allActiveMass);
		this.gravity = totalGravity;
		this.speed.add(this.gravity);
	}
	
	this.applySpeed = function(){
		this.pos.add(this.speed);
	}
	
	this.grow = function(growFactor){
		this.radius -= 0.1 * growFactor;
	}
	
	this.show = function(){
		fill(this.colorR, this.colorG, (this.colorB + random(0, 255))/2);
		ellipseMode(RADIUS);
		ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
	}
}

function setup() {
  createCanvas(800, 800);
  background(0);
  setInterval(newPositions, 50);
  function newPositions(){
  	for (i = 0; i < allActiveMass.length; i++) {allActiveMass[i].applyGravity();}
  	for (i = 0; i < allActiveMass.length; i++) {allActiveMass[i].applySpeed();}
  }
}

function mouseClicked(){
	a = true;
	if(allStaticMass.length > 0) {
		for (i = 0; i < allStaticMass.length; i++) {
			if(dist(allStaticMass[i].pos.x, allStaticMass[i].pos.y, mouseX, mouseY) < abs(allStaticMass[i].radius)) {
		  	allActiveMass.push(allStaticMass[i]);
		  	allStaticMass.splice(i, 1);
				a = false;
			}
		}
	}
	if(a === true) {
		v = createVector(mouseX, mouseY);
		newMass = new Mass(v);
		allStaticMass.push(newMass);
	}
}

function mouseWheel(event){
	for (i = 0; i < allStaticMass.length; i++) {
		if(dist(allStaticMass[i].pos.x, allStaticMass[i].pos.y, mouseX, mouseY) < abs(allStaticMass[i].radius) || abs(allStaticMass[i].radius) < 10) {
	  	allStaticMass[i].grow(event.delta);
		}
	}
	for (i = 0; i < allActiveMass.length; i++) {
		if(dist(allActiveMass[i].pos.x, allActiveMass[i].pos.y, mouseX, mouseY) < abs(allActiveMass[i].radius) || abs(allActiveMass[i].radius) < 10) {
	  	allActiveMass[i].grow(event.delta);
		}
	}
}

function draw() {
	for (i = 0; i < allStaticMass.length; i++) {allStaticMass[i].show();}
	for (i = 0; i < allActiveMass.length; i++) {allActiveMass[i].show();}
}