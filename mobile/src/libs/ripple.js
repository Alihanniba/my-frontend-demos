

const animations = {
  'animation': 'animationend',
  'OAnimation': 'oAnimationEnd',
  'MozAnimation': 'animationend',
  'WebkitAnimation': 'webkitAnimationEnd'
};

const animationEvent = (el) => {
  for (let t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
};

const Ripple = (event, callback) => {
  let ele = event.currentTarget;
  if (ele) {
    let name = animationEvent(ele);
    if (name) {
      ele.addEventListener(name, callback, false);
      ele.setAttribute('class', (ele.getAttribute('class') || '').replace('wave', '') + ' wave');
    } else {
      callback();
    }
  } else {
    callback();
  }
};

export default Ripple;
