import express from 'express';
import http from 'http';
import path from 'path';
import open from 'open';
import config from './webpack.config';

const app = express();

/** **********************************************************
 *
 * Express routes for:
 *   - app.js
 *   - style.css
 *   - index.html
 *
 ************************************************************/

// Serve application file depending on environment

let ip = '127.0.0.1';

getIP();

function getIP() {
  if (!process.env.TEST) {
    return;
  }

  http.get('http://freegeoip.net/json/', function(res) {
    let data = '';
    if (res.statusCode === 200) {
      res.on('data', function(d) {
        data += d;
      })
      .on('end', function() {
        ip = JSON.parse(data).ip;
      });
    }
  })
  .on('error', function() {
    console.log('error');
  });
}

app.get('/bundle.js', (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(path.join(__dirname, 'www/bundle.js'));
  } else {
    res.redirect('http://' + ip + ':' + config.port + '/bundle.js');
  }
});

// Serve index page
app.get('*', (req, res, next) => {
  if (req.path === '/') {
    return res.sendFile(path.join(__dirname, '/www/dev.html'));
  }
  next();
});

app.use(express.static(path.join(__dirname, 'www/')));

/** ***********************************************************
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 *************************************************************/

if (!process.env.PRODUCTION) {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');

  new WebpackDevServer(webpack(config), config.devServer)
    .listen(config.port, '0.0.0.0', (err, result) => {
      if (err) {
        console.log(err);
      }
    });
}

/** ****************
 *
 * Express server
 *
 *****************/

const port = process.env.PORT || 8080;
const server = app.listen(port, ip, () => {
  const s = server.address();
  const host = s.address;
  const port = s.port;
  console.log('Essential React listening at http://%s:%s', host, port);
  open('http://' + host + ':' + port + '/');
});

