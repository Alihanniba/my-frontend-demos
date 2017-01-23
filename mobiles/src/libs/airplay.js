
/*
  support airplay
*/
const AirPlay = (video, type, button) => {
  let canUseAirPlay = false;
  if (!window.WebKitPlaybackTargetAvailabilityEvent || !video || !button || /^x-/.test(type)) {
    // button && (button.style.display = 'none');
    return;
  }
  video.addEventListener('webkitplaybacktargetavailabilitychanged', (event) => {
    switch (event.availability) {
      case 'available':
        canUseAirPlay = true;
        button.style.display = 'inherit';
        button.setAttribute('class', 'func-imaged-item animation-scale');
        break;
      default:
        button.setAttribute('class', 'func-image-item');
        // button.style.display = 'none';
    }
    button.addEventListener('click', function() {
      if (!canUseAirPlay) { return;}
      video.webkitShowPlaybackTargetPicker();
    });
  });
  return;
};

export default AirPlay;
