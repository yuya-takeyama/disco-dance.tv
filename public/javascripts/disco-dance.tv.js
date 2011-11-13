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
    this.jQTubeUtil = deps.jQTubeUtil; // jQTubeUtil
    this.searchResult = deps.searchResult; // DiscoDanceTV.View.SearchResult
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
      , counter = this.counter
      , searchResult = this.searchResult
      , jQTubeUtil   = this.jQTubeUtil;

    $('#view').click(function () {
      var url = $('#video-url').val();
      url.match(/\?v=([^&]+)/);
      var videoId = RegExp.$1;
      if (typeof videoId === 'string' && videoId !== '') {
        player.play(videoId);
        socket.emit('play', videoId);
      }
    });

    $('#search-form').submit(function (event) {
      event.preventDefault();
      jQTubeUtil.search($('#search-keyword').val(), function (response) {
        searchResult.update(response.videos);
      });
    });

    $('#chat-form').submit(function (event) {
      event.preventDefault();
      socket.emit('chat', $('#chat-text').val());
    });

    socket.on('hello', function (data) {
      console.log(data);
    });

    socket.on('counter', function (data) {
      counter.setCount(data);
    });

    socket.on('play', function (playEvent) {
      var videoId = playEvent.videoId
        , position = playEvent.position;

      player.setVideoState(playEvent);
      player.play(videoId, position);
    });

    socket.on('chat', function (data) {
      $('#chat-messages').prepend(
        $('<li />')
          .text(data));
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
      if (self.videoState) {
        self.play(self.videoState.videoId, self.videoState.position);
      }
    };
  };

  /**
   * Loads video and play it.
   *
   * @param  {String} videoId YouTube video ID.
   * @return {void}
   */
  Player.play = function (videoId, position) {
    if (videoId) {

      var self = this;
      this._ytPlayer = new YT.Player('video', {
        width: 540,
        height: 365,
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
        },
        events: {
          onReady: function (event) {
            event.target.loadVideoById(videoId, position);
          },
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

  Player.setVideoState = function (videoState) {
    this.videoState = videoState;
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

/**
 * DiscoDanceTV.View.SearchResult
 *
 * Displays search result.
 *
 * @author Yuya Takeyama
 */
(function (View) {
  /**
   * Constructor.
   *
   * @param {Object} deps Dependencies.
   */
  View.SearchResult = function (deps) {
    this.jQuery = this.$ = deps.jQuery;
    this.list = deps.list;
    this.player = deps.player;
    this.socket = deps.socket;

    var self = this;
    this._clickListener = function (event) {
      event.preventDefault();
      var videoId = $(this).attr('data-video-id');
      self.player.play(videoId);
      self.socket.emit('play', videoId);
    };
  };

  var SearchResult = View.SearchResult.prototype;

  SearchResult.clear = function () {
    this.list.html('');
  };

  /**
   * @param {Array} videos Array of YouTubeVideo object.
   */
  SearchResult.update = function (videos) {
    this.clear();

    var i
      , video
      , player = this.player
      , socket = this.socket
      , $ = this.jQuery
      , thumb
      , detail
      , link;
    for (i in videos) {
      video = videos[i];

      thumb = $('<span />')
        .addClass('video-thumb')
        .append(
          $('<img />')
            .attr('src', video.thumbs[2].url)
            .attr('alt', video.title)
            .attr('width', 100));

      detail = $('<span />')
        .addClass('video-detail')
        .append(
          $('<span />')
            .addClass('title')
            .text(video.title));

      link = $('<a />')
        .addClass('video-link')
        .attr('href', '#')
        .attr('data-video-id', video.videoId)
        .click(this._clickListener)
        .append(
          $('<div />')
            .addClass('video-item')
            .append(thumb)
            .append(detail));

      this.list.append($('<li />').append(link));
    }
  };
})(DiscoDanceTV.View);
