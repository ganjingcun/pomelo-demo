module.exports = function (app) {
    return new Remote(app);
};

var Remote = function (app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

var remote = Remote.prototype;

remote.generate = function (playA,playB, cb) {
    var token = playA.uid + "#" + playB.uid

    var curServer = this.app.getServerById(this.app.serverId)
    console.log(curServer)
    cb(curServer)
}