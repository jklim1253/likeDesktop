(function MovementImpl() {
	document.addEventListener("mousedown", onMouseDown);
	document.addEventListener("mouseup", onMouseUp);
	document.addEventListener("mousemove", onMouseMove);
	var selected;
	var dx, dy;
	var max_zIndex = 0;
	function updatePosition(el, x, y) {
		el.style.left = x + "px";
		el.style.top = y + "px";

		var childs = el.childNodes;
		var index = childs.length;
		while (index--) {
			var child = childs[index];
			if (child.className === "option") {
				var option = "left: " + util.pad(el.style.left, 5, '0') + 
							",top: " + util.pad(el.style.top, 5, '0') + "<br>" +
							"offsetLeft: " + util.pad(el.offsetLeft, 5, '0') +
							",offsetTop: " + util.pad(el.offsetTop, 5, '0');
				child.innerHTML = option;
				break;
			}
		}
	}
	function onMouseDown(e) {
		e.preventDefault();
		var el = e.target;
		var pa = el.parentNode;
		if (el.className === "title" &&
			pa !== undefined &&
			pa.className === "post") {
			selected = pa;

			selected.className += " selected";
			selected.style.position = "absolute";
			selected.style.zIndex = ++max_zIndex;
			dx = e.pageX - (selected.offsetLeft - parseInt(getComputedStyle(selected, null).marginLeft));
			dy = e.pageY - (selected.offsetTop - parseInt(getComputedStyle(selected, null).marginTop));

			updatePosition(selected,
						e.pageX - dx,
						e.pageY - dy);
		}
	}
	function onMouseUp(e) {
		e.preventDefault();
		if (selected !== undefined) {
			selected.className = "post";
			//selected.style.zIndex -= 1;
			selected = undefined;
		}
	}
	function onMouseMove(e) {
		e.preventDefault();
		if (selected !== undefined) {
			updatePosition(selected,
						e.pageX - dx,
						e.pageY - dy);
		}
	}

	window.addEventListener("load", onWindowLoad);
	function onWindowLoad(e) {
		e.preventDefault();

		var x = 0, y = 0, margin = 10;
		var posts = document.getElementsByClassName("post");
		console.log("document have " + posts.length + " posts.");
		var index = posts.length;
		while (index--) {
			posts[index].style.position = "absolute";
			posts[index].style.zIndex = max_zIndex;
			updatePosition(posts[index], x, y);
			x += posts[index].offsetWidth + margin;
			//y += posts[index].offsetHeight + margin;
		}

		game("test").run();
		game("test2").run();
		pingpong("pingpong").run();
	}
})();
