/**
 * DiscoDanceTV
 *
 * Just a namespace.
 *
 * @author Yuya Takeyama
 */
var DiscoDanceTV = {};

/**
 * DiscoDanceTV.Application
 *
 * Entry-point of Disco Dance TV.
 *
 * @author Yuya Takeyama
 */
(function (DiscoDanceTV) {
  /**
   * DiscoDance TV Application.
   *
   * @param {Object} deps The objects Disco-Dance TV depends on.
   */
  DiscoDanceTV.Application = function (deps) {
    this.socket = deps.socket; // Socket.IO
    this.jQuery = deps.jQuery; // jQuery
    this.player = deps.player; // DiscoDanceTV.Player
  };

  DiscoDanceTV.Application.prototype = {};

  var Application = DiscoDanceTV.Application.prototype;

  Application.run = function () {
    var tag = document.createElement('script');
    tag.src = "http://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    this.player.embeds('video', {
      width: 425,
      height: 365,
      videoId: 'aCNIlZz-Aqk',
      playerVars: {
        autoplay: 0,
        controls: 0,
      },
      events: {
      onReady: function () { console.log('onReady'); },
      onStateChange: function () { console.log('onStateChange'); },
      },
    });

    this.socket.on('hello', function (data) {
      console.log(data);
    });
  };
})(DiscoDanceTV);

/**
 * DiscoDanceTV.Player
 *
 * Encapsulates YouTube Player API and provides simplified APIs.
 *
 * @author Yuya Takeyama
 */
(function (DiscoDanceTV) {
  /**
   * Constructor.
   *
   * @param {Object} context An object will be set onYouTubePlayerAPIReady() function.
   */
  DiscoDanceTV.Player = function (context) {
    this._context = context;
  };

  DiscoDanceTV.Player.prototype = {};
  var Player = DiscoDanceTV.Player.prototype;

  /**
   * Embedes and initializes YouTube Player.
   *
   * @param {String} elementId Target ID of HTMLElement to embed YouTube player.
   * @param {Object} params    Configuration of YouTube player.
   */
  Player.embeds = function (elementId, params) {
    var self = this;
    this._context.onYouTubePlayerAPIReady = function () {
      self._ytPlayer = new YT.Player(elementId, params);
    };
  };

  Player.play = function () {
    this._ytPlayer.playVideo();
  };

  Player.stop = function () {
    this._ytPlayer.stopVideo();
  };
})(DiscoDanceTV);
