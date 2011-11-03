var Counter = function () {
  this.count = 0;
};

Counter.prototype = {
  incr: function () {
    this.count++;
  },

  decr: function () {
    this.count--;
  },
};

module.exports = Counter;
