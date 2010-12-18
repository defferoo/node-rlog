var util = require('util');

var Log = function(bucket) {

  var db = require('riak-js').getClient({debug:false});
  var bucketName = bucket || 'node-rlog';

  function formatMsg(msg) {
    var _msg = [];
    for (i in msg) {
      if (typeof msg[i] === 'object') {
        _msg.push(util.inspect(msg[i]));
      } else {
        _msg.push(msg[i]);
      }
    }
    return _msg.join(' ');
  }

  function now() {
    return new Date().getTime();
  }

  function save(level, msg, callback) {
    db.save(bucketName, now(), msg, { level: level }, callback);
  }

  return {
    debug: function() {
      var args = Array.prototype.slice.call(arguments),
          callback = typeof args[args.length - 1] === 'function' && args.pop();
          
      save('debug', formatMsg(args), callback);
    },
    info: function() {
      var args = Array.prototype.slice.call(arguments),
          callback = typeof args[args.length - 1] === 'function' && args.pop();
      
      save('info', formatMsg(arguments), callback);
    },
    warn: function() {
      var args = Array.prototype.slice.call(arguments),
          callback = typeof args[args.length - 1] === 'function' && args.pop();
      
      save('warn', formatMsg(arguments), callback);
    },
    error: function() {
      save('error', formatMsg(arguments), callback);
    }
  }
}

module.exports = {
  getLogger: function(b) {
    return new Log(b);
  }
}