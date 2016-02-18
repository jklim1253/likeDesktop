var _OS_ = function() {
	var global = function() {
		var _global_id = 0;
		function _get_handle_id() {
			return _global_id++;
		}
		return {
			make_handle_id : _get_handle_id,
		};
	};
	var error = function() {
		return {
			success: 0,
			unknown_error: 1,
		};
	};

};
var TaskType = function() {
	var _background_task_type = 0;
	var _foreground_task_type = 1;
	return {
		background: _background_task_type,
		foreground: _foreground_task_type,
	};
};
var Task = function(func, tasktype) {
	this.handle_id = global.make_handle_id();
	this.code_to_run = func;
	if (tasktype === undefined) {
		tasktype = TaskType.background;
	}
	this.task_type = tasktype;
};
Task.prototype.run = function(){
	if (this.code_to_run === undefined) return;

	this.code_to_run();
};
Task.prototype.stop = function() {
	// how to stop running code.
};
var TaskManager = function() {
	this.elements = [];
};
TaskManager.prototype.add = function(task) {
	this.elements.push(task);
};
TaskManager.prototype.kill = function(task_id) {
	var result = error.unknown_error;
	var length = this.elements.length;
	while (length--) {
		if (this.elements[length].handle_id === task_id) {
			this.elements[length].stop();
			this.elements.splice(length, 1);
			result = error.success;
		}
	}
	return result;
};
