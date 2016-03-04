// post.js
// workspace
// 		- taskbar
// 			- command
// 			- tasks
// 			- notification
// 		- desktop
// 			- post
// 				- title
// 				- contents
// 				- option

var message = function(sender, receiver, value) {
	this.sender = sender;
	this.receiver = receiver;
	this.value = value;
	this.toString = function() {
		return "message Object {sender:"+sender+",receiver:"+receiver+",value:"+value.toString()+"}";
	};
};
var messagequeue = (function() {
	var _depot = [];

	function _post(msg) {
		console.log("push: " + msg.toString());
		_depot.push(msg);
	}
	function _pick() {
		if (_is_empty()) return null;

		var msg = _depot[0];
		_depot.splice(0,1);

		return msg;
	}
	function _pick_msg_by_receiver(rcv) {
		var len = _depot.length;
		var msg = null;
		var index = 0;

		while (index < len) {
			if (_depot[index].receiver === rcv) {
				msg = _depot[index];
				_depot.splice(index,index+1);
				break;
			}
			index++;
		}

		return msg;
	}
	function _is_empty() {
		return (_depot.length === 0);
	}
	return {
		post: _post,
		pick: _pick,
		pickByReceiver: _pick_msg_by_receiver,
		is_empty: _is_empty,
	};
})();
var os = (function () {
	var body = null;

	var _workspace = null;
	var _taskbar = null;
	var _desktop = null;
	var _commandbar = null;
	var _taskarea = null;
	var _notification = null;

	function _make_workspace() {
		_workspace = document.getElementById("workspace");
		if (_workspace === null) {
			_workspace = document.createElement("div");
			_workspace.className = "workspace";
			_workspace.id = "workspace";
			body.appendChild(_workspace);
		}
	}
	function _make_command_bar() {
		_commandbar = document.getElementById("commandbar");
		if (_commandbar === null) {
			_commandbar = document.createElement("div");
			_commandbar.className = "command";
			_commandbar.id = "commandbar";
			_taskbar.appendChild(_commandbar);
		}
	}
	function _make_task_area() {
		_taskarea = document.getElementById("taskarea");
		if (_taskarea === null) {
			_taskarea = document.createElement("div");
			_taskarea.className = "tasks";
			_taskarea.id = "taskarea";
			_taskbar.appendChild(_taskarea);
		}
	}
	function _make_notification_area() {
		_notification = document.getElementById("notificationarea");
		if (_notification === null) {
			_notification = document.createElement("div");
			_notification.className = "notification";
			_notification.id = "notificationarea";
			_taskbar.appendChild(_notification);
		}
	}
	function _make_taskbar() {
		_taskbar = document.getElementById("taskbar");
		if (_taskbar === null) {
			_taskbar = document.createElement("div");
			_taskbar.className = "taskbar";
			_taskbar.id = "taskbar";
			_workspace.appendChild(_taskbar);
		}
		// make command bar
		_make_command_bar();
		// make task area
		_make_task_area();
		// make notification area
		_make_notification_area();
	}
	function _make_desktop() {
		_desktop = document.getElementById("desktop");
		if (_desktop === null) {
			_desktop = document.createElement("div");
			_desktop.className = "desktop";
			_desktop.id = "desktop";
			_workspace.appendChild(_desktop);
		}
	}
	var selected; // undefined.
	var dx = 0, dy = 0;
	var max_zIndex = 0;
	function _updatePosition(el, x, y) {
		el.style.left = x + "px";
		el.style.top = y + "px";

		var children = el.childNodes;
		var index = children.length;
		while (index--) {
			var child = children[index];
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
	function _onMouseDown(e) {
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

			_updatePosition(selected,
						e.pageX - dx,
						e.pageY - dy);
		}
	}
	function _onMouseUp(e) {
		e.preventDefault();
		if (selected !== undefined) {
			selected.className = "post";
			//selected.style.zIndex -= 1;
			selected = undefined;
		}
	}
	function _onMouseMove(e) {
		e.preventDefault();
		if (selected !== undefined) {
			_updatePosition(selected,
						e.pageX - dx,
						e.pageY - dy);
		}
	}

	function _boot() {
		body = document.body;

		// make workspace
		_make_workspace();

		// make taskbar
		_make_taskbar();

		// make desktop
		_make_desktop();

		document.addEventListener("mousedown", _onMouseDown);
		document.addEventListener("mouseup", _onMouseUp);
		document.addEventListener("mousemove", _onMouseMove);
	}
	function _get_workspace() {
		return _workspace;
	}
	function _get_taskbar() {
		return _taskbar;
	}
	function _get_desktop() {
		return _desktop;
	}
	var _global_id = 0;
	function _generateId() {
		return "id_" + (_global_id++);
	}
	function _clear_taskarea() {
		var children = _taskarea.childNodes;
		var len = children.length;
		while (len--) {
			_taskarea.removeChild(children[len]);
		}
	}
	function _add_taskarea(post_array) {
		var len = post_array.length;
		var index = 0;
		while (index < len) {
			var item = document.createElement("div");
			item.className = "taskarea_item";
			item.innerHTML = post_array[index].title;
			_taskarea.appendChild(item);
			index++;
		}
	}
	function _update_taskbar() {
		var posts = PostManager.getlist();
		_clear_taskarea();
		_add_taskarea(posts);
	}

	return {
		boot: _boot,
		getWorkspace: _get_workspace,
		getTaskbar: _get_taskbar,
		getDesktop: _get_desktop,
		generateId: _generateId,
		updatePosition: _updatePosition,
		updateTaskbar: _update_taskbar,
	};
})();

var Post = function(title,contents,option) {
	this.title = title;
	this.contents = contents;
	this.option = option;
	this.id = null;
};
var PostManager = (function() {
	var path = "js/";
	var postlist = [];

	// file is unique.
	// if file is same, created contents should be same.
	function _create_content(parentNode, file) {
		var script = document.createElement("script");
		script.src = path + file;

		messagequeue.post(new message("PostManager", file, {
			"parentNode": parentNode,
			"file": file
		}));

		parentNode.appendChild(script);
	}
	var x = 0, y = 0, margin = 10;
	function _add(post) {
		var desktop = os.getDesktop();
		post.id = os.generateId();

		var item = document.createElement("div");
		item.className = "post";
		item.id = post.id;
		item.style.position = "absolute";
		item.style.zIndex = 0;
		
		desktop.appendChild(item);

		var title = document.createElement("div");
		title.className = "title";
		title.innerHTML = post.title;
		item.appendChild(title);

		var content = document.createElement("div");
		content.className = "content";
		_create_content(content, post.contents);
		item.appendChild(content);

		var option = document.createElement("div");
		option.className = "option";
		item.appendChild(option);

		os.updatePosition(item, x, y);
		x += item.offsetWidth + margin;

		postlist.push(post);

		os.updateTaskbar();
	}
	function _remove(postid) {
		var desktop = os.getDesktop();

		desktop.removeChild("postid" + postid);

		var len = postlist.length;
		while (len--) {
			if (postlist[len].id === postid) {
				postlist.splice(len, len+1);
				break;
			}
		}
	}
	function _getlist() {
		return postlist;
	}
	function _createCanvas(parentNode, id, width, height) {
		console.log("_createCanvas("+parentNode+","+id+","+width+","+height+")");
		var canvas = document.createElement("canvas");
		canvas.id = id;
		if (width !== undefined && height !== undefined) {
			canvas.width = width;
			canvas.height = height;
		}
		parentNode.appendChild(canvas);
		return canvas;
	}
	function _getCanvas(parentNode) {
		console.log("_getCanvas("+parentNode+")");
		if (parentNode === undefined) return null;

		var defaultWidth = 400;
		var defaultHeight = 400;
		var canvas = parentNode.getElementsByTagName("canvas");
		if (canvas.length === 0) {
			canvas = _createCanvas(parentNode, os.generateId(), defaultWidth, defaultHeight);
		}
		else {
			canvas = canvas[0];
		}
		return canvas;
	}
	return {
		add: _add,
		remove: _remove,
		getlist: _getlist,
		getCanvas: _getCanvas,
	};
})();
