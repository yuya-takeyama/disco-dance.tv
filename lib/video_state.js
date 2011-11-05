var VideoState = function () {
};

VideoState.prototype = {
  setVideo: function (videoId) {
    this.videoId = videoId;
    this.beganAt = this._getTimestamp();
  },

  createPlayEvent: function () {
    return {
      videoId: this.videoId,
      position: this._getTimestamp() - this.beganAt,
    };
  },

  _getTimestamp: function () {
    return Math.round(new Date().getTime() / 1000);
  },
};

module.exports = VideoState;
