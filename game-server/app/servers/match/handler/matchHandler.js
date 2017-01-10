module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

var handler = Handler.prototype;

handler.match = function (msg, session, next) {
    var uid = msg.uid;


    if (!uid) {
        next(null, {
            code: 500,
            error: true,
            msg: 'uid is require!'
        });
        return;
    }

    var sid = session.get('sid');
    var username = session.get('username');

    if (!sid) {
        next(null, {
            code: 500,
            error: true,
            msg: 'you are not login !'
        });
        return;
    }

    var channel = this.channelService.getChannel('matchChannel', true);

    var users = [];
    if (channel) {
        users = channel.getMembers();
        if (users.indexOf(username) === -1) {
            channel.add(username, session.get('sid'));
            var users = this.app.get('users') || []
            users.push({ uid: uid, username:username,sid: session.get('sid') })
            this.app.set('users', users)
        } else {
            return next(null, { code: 200, msg: 'hello ' + username + ', 正在匹配中 请勿重复请求！' });
        }
    }

    next(null, { code: 200, msg: 'hello ' + username + ', 请求匹配中。。请耐心等候' });
}