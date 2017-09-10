import { describe, it } from 'mocha';
import { expect } from 'chai';

import Board from '../source/board';

const makeBoard = (size) => new Board(size);

describe('Board', () => {
  describe('#isRoadWin', () => {
    it('registers a vertical road win', () => {
      const boardState = [
        [['w'], [ ], [ ]], // 3
        [['w'], [ ], [ ]], // 2
        [['w'], [ ], [ ]], // 1
        // A     B    C
      ].reverse();

      const board = new Board(3, boardState);

      expect(board.isRoadWin('w')).to.equal(true);
    });

    it('registers a horizontal road win', () => {
      const boardState = [
        [[   ], [   ], [   ]], // 3
        [[   ], [   ], [   ]], // 2
        [['w'], ['w'], ['w']], // 1
        // A      B      C
      ].reverse();

      const board = new Board(3, boardState);

      expect(board.isRoadWin('w')).to.equal(true);
    });

    it('does not register a horizontal road win for the wrong color', () => {
      const boardState = [
        [[   ], [   ], [   ]], // 3
        [[   ], [   ], [   ]], // 2
        [['w'], ['w'], ['w']], // 1
        // A      B      C
      ].reverse();

      const board = new Board(3, boardState);

      expect(board.isRoadWin('b')).to.equal(false);
    });

    it('registers a road win for a large board', () => {
      const boardState = [
        [['w'], [ 'w'], [    ], [    ], [    ], [    ], [   ], [   ]], // 8
        [[   ], ['Cw'], [ 'w'], [    ], [    ], [    ], [   ], [   ]], // 7
        [[   ], [ 'b'], [ 'w'], [ 'w'], [    ], [    ], [   ], [   ]], // 6
        [['b'], [    ], ['Cb'], [ 'w'], [ 'w'], ['Sb'], [   ], [   ]], // 5
        [[   ], [    ], [    ], ['Sb'], [ 'w'], [    ], [   ], [   ]], // 4
        [['b'], [    ], [    ], [    ], [ 'w'], [ 'w'], [   ], [   ]], // 3
        [[   ], [    ], [    ], [    ], ['Sb'], [ 'w'], ['w'], [   ]], // 2
        [['b'], [    ], [    ], [    ], [ 'w'], ['Sb'], ['w'], [   ]], // 1
        // A      B       C       D       E       F       G      H
      ].reverse();

      const board = new Board(8, boardState);

      expect(board.isRoadWin('w')).to.equal(true);
    });

    it('will not register a road win for a large board with an incomplete road', () => {
      const boardState = [
        [['w'], [ 'w'], [    ], [    ], [    ], [    ], [   ], [   ]], // 8
        [[   ], ['Cw'], [ 'w'], [    ], [    ], [    ], [   ], [   ]], // 7
        [[   ], [ 'b'], [ 'w'], [ 'w'], [    ], [    ], [   ], [   ]], // 6
        [['b'], [    ], ['Cb'], [ 'w'], [ 'w'], ['Sb'], [   ], [   ]], // 5
        [[   ], [    ], [    ], ['Sb'], [ 'w'], [    ], [   ], [   ]], // 4
        [['b'], [    ], [    ], [    ], [ 'w'], [ 'w'], [   ], [   ]], // 3
        [[   ], [    ], [    ], [    ], ['Sb'], [ 'w'], ['w'], [   ]], // 2
        [['b'], [    ], [    ], [    ], [ 'w'], ['Sb'], [   ], [   ]], // 1
        // A      B       C       D       E       F       G      H
      ].reverse();

      const board = new Board(8, boardState);

      expect(board.isRoadWin('w')).to.equal(false);
    });
  });

  describe('#isFull', () => {
    it('detects when the board is full', () => {
      const board = new Board(3, [
        [[ 'w'], [ 'w'], ['Sb']],
        [[ 'w'], [ 'b'], ['Sb']],
        [['Cb'], ['Cw'], ['Sb']],
      ]);

      expect(board.isFull()).to.equal(true);
    });
  });

  describe('#flatCounts', () => {
    it('gets the flat count of the board, ignoring walls and caps', () => {
      const board = new Board(3, [
        [[ 'w'], [ 'w'], ['Sb']],
        [[ 'w'], [ 'b'], ['Sb']],
        [['Cb'], ['Cw'], [    ]],
      ]);

      expect(board.flatCounts()).to.include({
        white: 3,
        black: 1
      });
    });
  });
});
