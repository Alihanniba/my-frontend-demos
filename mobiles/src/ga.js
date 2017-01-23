import ReactGA from 'react-ga';

let inited = false;
let queue = [];
const GA = {
  initialize: (code) => {
    if (window.config.env !== 'production') {
      return;
    }
    ReactGA.initialize(code);
    inited = true;
    if (queue.length) {
      queue.map((arg) => {
        GA.ga(arg);
      });
      queue.length = 0;
    }
  },
  ga: (...args) => {
    if (window.config.env !== 'production') {
      return console.log(...args);
    }
    if (inited) {
      return ReactGA.ga(...args);
    }
    queue.push(...args);
  }
};

export default GA;
