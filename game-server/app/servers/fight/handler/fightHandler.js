module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

var handler = Handler.prototype;


handler.fight = function(msg,session,next){
  console.log(msg)
  next(null,{code:200,msg:'hello fight'})
}