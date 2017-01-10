module.exports = function (app) {
	return new Handler(app);
};

var Handler = function (app) {
	this.app = app;
};

var handler = Handler.prototype;

handler.login = function (msg, session, next) {
	var username = msg.username;

	//check username
	if (!username) {
		next(null, {
			code: 500,
			error: true,
			msg: 'username can not be null'
		});
		return;
	}

	var sessionService = this.app.get('sessionService');

	//duplicate login
	if (!!sessionService.getByUid(username)) {
		next(null, {
			code: 500,
			error: true,
			msg: 'duplicate login!'
		});
		return;
	}

	//临时返回给客户端的userid
	var uid = new Date().getTime()

	session.bind(username);
	session.set('username', username);
	session.set('uid', uid);
	session.set('sid', this.app.serverId);
	
	//push方法 是把设置的属性 push到后端服务器的session中。
	session.push('username', function (err) {
		if (err) {
			console.error('set username for session service failed! error is : %j', err.stack);
		}
	});
	session.push('uid', function (err) {
		if (err) {
			console.error('set uid for session service failed! error is : %j', err.stack);
		}
	});
	session.push('sid', function (err) {
		if (err) {
			console.error('set sid for session service failed! error is : %j', err.stack);
		}
	});

	session.on('closed', onUserLeave.bind(null, this.app));

	next(null, { code: 200, msg: 'hello ' + username, uid: uid });
};


var onUserLeave = function (app, session) {
	if (!session || !session.uid) {
		return;
	}
	console.log('user leave : ', session.uid)
};