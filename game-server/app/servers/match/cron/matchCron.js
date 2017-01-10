module.exports = function (app) {
  return new Cron(app);
};
var Cron = function (app) {
  this.app = app;
  this.channelService = app.get('channelService');
};
var cron = Cron.prototype;

cron.match = function () {

  var users = this.app.get('users') || []

  console.log('正在等待匹配的玩家：', users)

  var channel = this.channelService.getChannel('matchChannel', false);

  if (channel && users.length >= 2) {

    var matchResult = users.splice(0, 2)

    var playA = matchResult[0]
    var playB = matchResult[1]

    var self = this 

    //调用rpc 通知fight server 生成一场 playA vs playB 的战斗
    self.app.rpc.fight.fightRemote.generate(null,playA, playB, function (server) {

      var token = playA.uid + "#" + playB.uid

      var param = {
        msg: 'match success!',
        playA: playA.uid,
        playB: playB.uid,
        token: token,
        server:{
          host:server.host,
          port:server.port,
          type:server.serverType,
          id:server.id
        }
      };
      self.channelService.pushMessageByUids('onMatch', param, [
        { uid: playB.username, sid: playB.sid },
        { uid: playA.username, sid: playA.sid }
      ]);
      channel.leave(playA.uid, playA.sid);
      channel.leave(playB.uid, playB.sid);

      self.app.set('users', users)


    });

  }



};