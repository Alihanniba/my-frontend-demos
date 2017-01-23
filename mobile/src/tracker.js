import GA from './ga';

const Tracker = {
  initialize: (code) => {
    GA.initialize(code);
  },
  track: (...args) => {
    GA.ga(...args);
  },
  set: (key, value) => {
    GA.ga('set', key, value);
  },
  performance: (all) => {
    let resources = performance.getEntriesByType && performance.getEntriesByType('resource');
    if (!resources) {
      return;
    }
    let items = resources.filter((resource) => {
      return resource.initiatorType === 'xmlhttprequest';
    });
    if (!items.length) {
      return;
    }
    if (all) {
      items.forEach((item) => {
        let name = item.name.replace(/\?.+/, '');
        Tracker.track('send', 'timing', {
          'timingCategory': 'api',
          'timingVar': name,
          'timingValue': item.duration >> 0
        });
      });
    } else {
      // lasted
      let item = items[items.length - 1];
      let name = item.name.replace(/\?.+/, '');
      Tracker.track('send', 'timing', {
        'timingCategory': 'api',
        'timingVar': name,
        'timingValue': item.duration >> 0
      });
    }
  },
  youtubeError: (e) => {
    return;
  }
};

export default Tracker;
