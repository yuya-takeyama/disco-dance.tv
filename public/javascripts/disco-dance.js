var $view, player, socket;

function onYouTubePlayerReady(playerId) {
  player = document.getElementById('ytplayer');

  var play = function(id) {
    player.loadVideoById(id);
  };

  $view.click(function () {
    var url = $('#video-url').val();
    url.match(/\?v=([^&]+)/);
    var id = RegExp.$1;
    if (typeof id === 'string' && id.length > 0) {
      play(id);
      socket.emit('play', id);
    }
  });

  socket.on('play', function (id) {
    play(id);
  });
}

$(function () {
  swfobject.embedSWF(
    'http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer',
    'video',
    "425", "365", "8", null, null, {allowScriptAccess: 'always'}, {id: 'ytplayer'}
  );
  $view = $('#view');
  socket = io.connect('http://' + document.location.host);

  socket.on('hello', function (data) {
    console.log(data);
  });
});
