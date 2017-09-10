"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tileCounts = [[0, 10], [0, 15], [1, 21], [1, 30], [2, 40], [2, 50]];

function getTileCounts(n) {
  return tileCounts[n - 3];
}

var Board = function Board(size) {
  _classCallCheck(this, Board);
};