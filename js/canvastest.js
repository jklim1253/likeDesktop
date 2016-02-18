var game = function(windowid){
	var bgcolor = "#ffffff";
	var canvas = getCanvas(windowid);
	if (canvas === undefined) return {}; // return null object.
	var width = canvas.width;
	var height = canvas.height;
	var context = canvas.getContext("2d");

	var angle = 0;
	function update() {
		angle += 5*Math.PI/180;
		if (angle >= 2*Math.PI) {
			angle = 0;
		}
	}
	function draw() {
		context.fillStyle = bgcolor;
		context.fillRect(0,0,width,height);
		drawBox();
	}
	function drawBox() {
		context.save();
		context.setTransform(1,0,0,1,0,0);
		context.translate(width/2, height/2);
		context.rotate(angle);
		context.translate(-25,-25);
		context.beginPath();
		context.rect(0,0,50,50);
		context.closePath();
		context.fillStyle = "red";
		context.fill();
		context.restore();
	}

	function mainloop() {
		update();
		draw();
		setTimeout(mainloop, 1000/24);
	}

	return {
		run: mainloop,
	};
};
