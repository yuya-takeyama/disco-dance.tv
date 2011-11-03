var player, socket;

function onYouTubePlayerAPIReady() {
  player = new YT.Player('video', {
    width: 425,
    height: 365,
    videoId: 'aCNIlZz-Aqk',
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });

  /*
  $view.click(function () {
    var url = $('#video-url').val();
    url.match(/\?v=([^&]+)/);
    var id = RegExp.$1;
    if (typeof id === 'string' && id.length > 0) {
      play(id);
      socket.emit('play', id);
    }
  });
  */

  socket.on('play', function (id) {
    play(id);
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
}

function stopVideo() {
  player.stopVideo();
}

$(function () {
  socket = io.connect('http://' + document.location.host);

  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  socket.on('hello', function (data) {
    console.log(data);
  });
});
