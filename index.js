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

  function save(level, obj, callback) {
    db.save(bucketName, now(), obj, { level: level, contentType: 'application/json' }, callback);
  }

  return {
    debug: function (obj, callback) {
      save('debug', obj, callback);
    },
    info: function (obj, callback) {
      save('info', obj, callback);
    },
    warn: function (obj, callback) {
      save('warn', obj, callback);
    },
    error: function (obj, callback) {
      save('error', obj, callback);
    }
  }
}

module.exports = {
  getLogger: function(b) {
    return new Log(b);
  }
}