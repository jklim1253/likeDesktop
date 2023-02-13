(function() {
	var mainApp = (function(windowid) {
		var msg = messagequeue.pickByReceiver("mark.js");
		console.log(msg.value);
		var canvas = PostManager.getCanvas(msg.value.parentNode);
		if (canvas === undefined) return {};
		var width = canvas.width;
		var height = canvas.height;
		var context = canvas.getContext("2d");

		var bgcolor = "#eeeeee";
		var x = width/2;
		var y = height/2;
		function update() {
		}
		function draw() {
			context.fillStyle = bgcolor;
			context.fillRect(0,0,width,height);
			drawMark();
		}
		function drawMark() {
			var r = 50;
			context.save();
			context.beginPath();
			context.arc(x, y, r, 0, Math.PI, true);
			context.arc((x + x - r)/2, y, r/2, Math.PI, 0, true);
			context.arc((x + x + r)/2, y, r/2, Math.PI, 0);
			context.closePath();
			context.fillStyle = "#ff0000";
			context.fill();
			context.beginPath();
			context.arc(x, y, r, Math.PI, 0, true);
			context.arc((x + x + r)/2, y, r/2, 0, Math.PI, true);
			context.arc((x + x - r)/2, y, r/2, 0, Math.PI);
			context.closePath();
			context.fillStyle = "#0000ff";
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

	mainApp.run();
})();
