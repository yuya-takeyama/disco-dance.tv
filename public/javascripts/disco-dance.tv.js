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
    this.socket  = deps.socket;  // Socket.IO
    this.jQuery  = deps.jQuery;  // jQuery
    this.player  = deps.player;  // DiscoDanceTV.Player
    this.counter = deps.counter; // DiscoDanceTV.Counter
  };

  DiscoDanceTV.Application.prototype = {};

  var Application = DiscoDanceTV.Application.prototype;

  /**
   * Entry point of the application.
   *
   * @return {void}
   */
  Application.run = function () {
    this.player.embeds('video', {
      width: 425,
      height: 365,
      playerVars: {
        autoplay: 0,
        controls: 1,
      },
      events: {
      onReady: function () { console.log('onReady'); },
      onStateChange: function () { console.log('onStateChange'); },
      },
    });

    this.defineEventHandlers();
  };

  Application.defineEventHandlers = function () {
    var player  = this.player
      , socket  = this.socket
      , $       = this.jQuery
      , counter = this.counter;

    $('#view').click(function () {
      var url = $('#video-url').val();
      url.match(/\?v=([^&]+)/);
      var videoId = RegExp.$1;
      if (typeof videoId === 'string' && videoId !== '') {
        player.play(videoId);
        socket.emit('play', videoId);
      }
    });

    socket.on('hello', function (data) {
      console.log(data);
    });

    socket.on('counter', function (data) {
      counter.setCount(data);
    });

    socket.on('play', function (data) {
      player.play(data);
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
    var tag = document.createElement('script');
    tag.src = "http://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var self = this;
    this._context.onYouTubePlayerAPIReady = function () {
      self._ytPlayer = new YT.Player(elementId, params);
    };
  };

  /**
   * Loads video and play it.
   *
   * @param  {String} videoId YouTube video ID.
   * @return {void}
   */
  Player.play = function (videoId) {
    if (videoId) {

      var self = this;
      this._ytPlayer = new YT.Player('video', {
        width: 425,
        height: 365,
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
        },
        events: {
          onReady: function (event) { event.target.playVideo(); },
          onStateChange: function () { console.log('onStateChange'); },
        },
      });
    } else {
      this._ytPlayer.playVideo();
    }
  };

  /**
   * Stops player.
   *
   * @return {void}
   */
  Player.stop = function () {
    this._ytPlayer.stopVideo();
  };
})(DiscoDanceTV);

/**
 * DiscoDanceTV.Counter
 *
 * @author Yuya Takeyama
 */
(function (DiscoDanceTV) {
  /**
   * Constructor.
   *
   * @param {DiscoDanceTV.View.Counter} view
   */
  DiscoDanceTV.Counter = function (view) {
    this.count = 0;
    this.view = view;
  };

  var Counter = DiscoDanceTV.Counter.prototype;

  /**
   * Notfies to view.
   *
   * @return {void}
   */
  Counter.notify = function () {
    this.view.update(this);
  };

  Counter.setCount = function (count) {
    this.count = count;
    this.notify();
  };

  Counter.getCount = function () {
    return this.count;
  };
})(DiscoDanceTV);

/**
 * DiscoDanceTV.View
 *
 * Just a namespace.
 */
DiscoDanceTV.View = {};

/**
 * DiscoDanceTV.View.Counter
 *
 * Indicates how many people are connectiong.
 *
 * @author Yuya Takeyama
 */
(function (View) {
  /**
   * Constructor.
   *
   * @param {Object} deps
   */
  View.Counter = function (element) {
    this.element = element;
  };

  var Counter = View.Counter.prototype;

  /**
   * Updates display.
   *
   * @param  {DiscoDanceTV.Counter} counter
   * @return {void}
   */
  Counter.update = function (counter) {
    var count = counter.getCount();
    this.element.html(count + ' people are viewing now.');
  };
})(DiscoDanceTV.View);
