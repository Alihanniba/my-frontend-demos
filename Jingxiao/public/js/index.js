/**
 * Created by aleen42 on 15-10-6.
 */

var imgNum = 1;
var currentVideo = 0;
var totalTime = 0;
var playSrc = [];
var playSrcTime = [];
var duration;
var currentPlayTime = 0;
var currentDuration;
var player = $("#jquery_jplayer_1");

function urlencode(str) {
    str = (str + '').toString();

    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

function CheckUrl(str) {
    var RegUrl = new RegExp();
    RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
    if (!RegUrl.test(str)) {
        return false;
    }
    return true;
}

$(document).ready(function () {
    $('#playUrlSubmit').click(function () {
        var form = $('#playForm');
        if (CheckUrl($('#playUrl').val()) || $('#playUrl').val() == '')
            form.attr('action', 'play');
        else
            form.attr('action', 'list');
        form.submit();
    });


}).keydown(function (event) {
    var userAgent = navigator.userAgent.toLowerCase();
    var keycode;

    if (userAgent.indexOf('firefox') >= 0 || userAgent.indexOf('ie') >= 0) {
        keycode = event.which;
    }
    else {
        var ev = (typeof(event) != 'undefined') ? window.event : event;
        keycode = ev.keyCode;
    }

    if (keycode == 13 && document.activeElement.id == "playUrl") {
        var form = $('#playForm');
        if (CheckUrl($('#playUrl').val()) || $('#playUrl').val() == '')
            form.attr('action', 'play');
        else
            form.attr('action', 'list');
        form.submit();
    }
});
