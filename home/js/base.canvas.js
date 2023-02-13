function getCanvas(windowid) {
	var canvas = document.getElementById(windowid);
	if (canvas === undefined) {
		alert("fail to find window to connect");
	}
	return canvas;
}
