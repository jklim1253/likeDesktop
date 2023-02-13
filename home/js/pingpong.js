(function() {
	var Vector = function(x, y) {
		if (x === undefined && y === undefined) {
			x = 1.0;
			y = 1.0;
		}
		this.x = x;
		this.y = y;
	};
	Vector.prototype.length = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	};
	Vector.prototype.unit = function() {
		return new Vector(this.x/this.length(), this.y/this.length());
	};
	Vector.prototype.add = function(other) {
		return new Vector(this.x + other.x, this.y + other.y);
	};
	Vector.prototype.minus = function(other) {
		return new Vector(this.x - other.x, this.y - other.y);
	};
	Vector.prototype.scale = function(n) {
		return new Vector(this.x*n, this.y*n);
	};
	function getRandomRange(from, to) {
		return Math.random() * (to-from) + from;
	}
	var pingpong = (function(windowid) {
		// base variable for canvas.
		var msg = messagequeue.pickByReceiver("pingpong.js");
		console.log(msg.value);
		var canvas = PostManager.getCanvas(msg.value.parentNode);
		if (canvas === undefined) return {}; // return null object.
		var width = canvas.width;
		var height = canvas.height;
		var context = canvas.getContext("2d");

		// configure style of canvas
		var bgcolor = "#eeeeee";

		var r = 50;
		var ball = new Vector(width/2, height/2);
		var force = new Vector(getRandomRange(4,10), getRandomRange(4,10));
		function update() {
			ball = ball.add(force);
			if (ball.x - r < 0 || ball.x + r > width) {
				force.x = -force.x;
			}
			if (ball.y - r < 0 || ball.y + r > height) {
				force.y = -force.y;
			}
		}
		function draw() {
			context.fillStyle = bgcolor;
			context.fillRect(0,0,width,height);
			drawPingPong();
		}
		function drawPingPong() {
			context.save();
			context.beginPath();
			context.arc(parseInt(ball.x), parseInt(ball.y), r, 0, 2*Math.PI);
			context.closePath();
			context.fillStyle = "#7766cc";
			context.fill();
			context.restore();
		}
		function mainloop() {
			update();
			draw();
			setTimeout(mainloop, 1000/24); // fps 24
		}
		return {
			run: mainloop,
		};
	})();

	pingpong.run();

})();
