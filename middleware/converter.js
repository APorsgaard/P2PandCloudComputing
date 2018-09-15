var msgpack = require('msgpack5')(),
  encode = msgpack.encode,
  json2html = require('node-json2html');

module.exports = function () {
  return function (req, res, next) {
    console.info('Representation converter middleware called!');
    if (req.result) {
      switch (req.accepts(['json', 'html', 'application/x-msgpack'])) {
        case 'html':
          console.info('HTML representation selected!');
          var transform = {'tag': 'div', 'html': '${name} : ${value}'};
          res.send(json2html.transform(req.result, transform));
          return;
        case 'application/x-msgpack':
          console.info('MessagePack representation selected!');
          res.type('application/x-msgpack');
          res.send(encode(req.result));
          return;
        default:
          console.info('Defaulting to JSON representation!');
          res.send(req.result);
          return;
      }
    }
    else {
      next();
    }
  }
};
