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
};
var messagequeue = (function() {
	var _depot = [];

	function _push(msg) {
		_depot.push(msg);
	}
	function _pop() {
		if (_is_empty()) return null;

		var msg = _depot[0];
		_depot.splice(0,1);

		return msg;
	}
	function _pop_msg_by_receiver(rcv) {
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
		push: _push,
		pop: _pop,
		popByReceiver: _pop_msg_by_receiver,
		is_empty: _is_empty,
	};
})();
var os = (function () {
	var body = null;

	var _workspace = null;
	var _taskbar = null;
	var _desktop = null;

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
		var commandbar = document.getElementById("commandbar");
		if (commandbar === null) {
			commandbar = document.createElement("div");
			commandbar.className = "command";
			commandbar.id = "commandbar";
			_taskbar.appendChild(commandbar);
		}
	}
	function _make_task_area() {
		var taskarea = document.getElementById("taskarea");
		if (taskarea === null) {
			taskarea = document.createElement("div");
			taskarea.className = "tasks";
			taskarea.id = "taskarea";
			_taskbar.appendChild(taskarea);
		}
	}
	function _make_notification_area() {
		var notification = document.getElementById("notificationarea");
		if (notification === null) {
			notification = document.createElement("div");
			notification.className = "notification";
			notification.id = "notificationarea";
			_taskbar.appendChild(notification);
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
	function _boot() {
		body = document.body;

		// make workspace
		_make_workspace();

		// make taskbar
		_make_taskbar();

		// make desktop
		_make_desktop();
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

	return {
		boot: _boot,
		getWorkspace: _get_workspace,
		getTaskbar: _get_taskbar,
		getDesktop: _get_desktop,
		generateId: _generateId,
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
		parentNode.appendChild(script);
	}
	function _add(post) {
		var desktop = os.getDesktop();
		post.id = os.generateId();

		var item = document.createElement("div");
		item.className = "post";
		item.id = post.id;
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

		postlist.push(post);
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
		var canvas = document.createElement("canvas");
		canvas.id = id;
		if (width !== undefined && height !== undefined) {
			canvas.style.width = width;
			canvas.style.height = height;
		}
		parentNode.appendChild(canvas);
		return canvas;
	}
	function _getCanvas(parentNode) {
		if (parentNode === undefined) return null;

		var defaultWidth = 200;
		var defaultHeight = 200;
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
