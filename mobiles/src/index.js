import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, hashHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from './rxjs';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
// airbrake
import AirbrakeJs from 'airbrake-js';

// promise polyfill
import promise from 'es6-promise';
promise.polyfill();

import Tracker from './tracker';
import vegoApp from './reducers';
import App from './components/App';
import Splash from './components/splash';
import Home from './components/Home/Home';
import ChannelEpisode from './components/ChannelEpisode/ChannelEpisode';
import VideoPlayer from './components/Player/Player';
import Search from './components/Search/Search';
import Compile from './components/Compile/Compile';
import Live from './components/Live/Live';
import AboutMe from './components/AboutMe/AboutMe';
import Tease from './components/Tease';
import About from './components/About';
import Login from './components/Login/Login';
import Regist from './components/Regist/Regist';
import Record from './components/Record/record';
import Collect from './components/Collect/collect';
import Forget from './components/Forget/Forget';
import Net from './components/Net';
// import Regist from './components/Regist'

import './startup';

import ons from 'onsenui';
import 'onsenui/css/onsenui.css';
import './components/common.css';
import './stylus/index.styl';
import './components/onsenuiSelf.css';

const logger = createLogger();
const epicMiddleware = createEpicMiddleware(rootEpic);
const store = createStore(vegoApp,
  window.devToolsExtension ? window.devToolsExtension() : f => f,
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(thunk)
    : applyMiddleware(thunk, logger)
);

const history = window.config.hashHistory ? syncHistoryWithStore(hashHistory, store) : syncHistoryWithStore(browserHistory, store);
const rootElement = document.getElementById('root');

// Listen for changes to the current location.
// only for mobile app
let _screen = null;
history.listen((location, action) => {
  var screenname = location.pathname;
  if (_screen === screenname) {
    return;
  }
  _screen = screenname;
  // user performance api
  // window.performance && performance.mark && performance.mark(screenname);
  if (screenname !== '/') {
    screenname = location.pathname.replace(/[\/|\d+]/g, '');
  }
  Tracker.track('send', 'screenview', screenname);
});

const startApp = (render) => {
  if (window.config.env !== 'production' || window.config.airbrake) {
    return render();
  }
  let airbrake = new AirbrakeJs({projectId: 134519, projectKey: '71329f0df479aa6774b9277d66aa4ebb'});
  airbrake.addFilter((notice) => {
    notice.context.environment = window.config.env;
    notice.context.plateform = window.config.cordova ? 'cordova' : window.config.wechat ? 'wechat' : window.config.mobile ? 'mobile' : 'desktop';
    notice.context.version = window.config.cordova_v ? 'cordova_' + window.config.cordova_v : '1.0';
    return notice;
  });
  airbrake.addReporter((notice) => {
    window.config.env !== 'production' && console.log(notice);
  });
  let app = airbrake.wrap(render);
  app();
};

const view = () => {
  return <Provider store={store}>
      <Router history={ history }>
        <Route path="/" component={Net}>
          <IndexRoute component={Splash}/>
          <Route path="/home" component={App}>
            <IndexRoute component={Home} />
            <Route path="/live" component={Live}/>
          </Route>
          <Route path="/me" component={AboutMe}/>
          <Route path="/login" component={Login} />
          <Route path="/regist" component={Regist} />
          <Route path="/tease" component={Tease}/>
          <Route path="/about" component={About}/>
          <Route path="/watch/:vid" component={VideoPlayer}/>
          <Route path="/search" component={Search}/>
          <Route path="/compile" component={Compile}/>
          <Route path="/episode/:id" component={ChannelEpisode}/>
          <Route path="/record" component={Record}/>
          <Route path="/collect" component={Collect}/>
          <Route path="/forget" component={Forget}/>
        </Route>
      </Router>
    </Provider>;
};

const appRender = () => {
  ons.ready(() => {
    ons.disableDeviceBackButtonHandler();
    render(view(), rootElement);
    Tracker.track('send', 'event', 'app', 'launch', 'app', 1);
  });
};
startApp(appRender);
