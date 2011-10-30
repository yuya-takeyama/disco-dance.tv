var $view, player;

function onYouTubePlayerReady(playerId) {
  player = document.getElementById('ytplayer');

  var play = function(url) {
    url.match(/\?v=([^&]+)/);
    var id = RegExp.$1;
    if (typeof id === 'string' && id.length > 0) {
      player.loadVideoById(id);
    }
  };

  $view.click(function () {
    var url = $('#video-url').val();
    play(url);
  });
}

$(function () {
  swfobject.embedSWF(
    'http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer',
    'video',
    "425", "365", "8", null, null, {allowScriptAccess: 'always'}, {id: 'ytplayer'}
  );
  $view = $('#view');
});
