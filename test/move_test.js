import { describe, it } from 'mocha';
import { expect } from 'chai';

import Move  from '../source/move';
import Board from '../source/board';
import Ptn   from '../source/ptn';

const context = describe;

describe('Move', () => {
  let ptn   = new Ptn('d1');
  let board = new Board(5);
  let move  = new Move(ptn, board, 'w', true);

  describe('#properties', () => {
    it('has them', () => {
      expect(move).to.include({
        ptn: ptn,
        inverseStart: true
      });
    });

    it('clones the board', () => {
      expect(move.board.size).to.equal(5);
      expect(move.board).to.not.equal(board);
    });
  });

  describe('#isValid', () => {
    it('returns true for a valid placement move on the board', () => {
      expect(move.isValid()).to.equal(true);
    });

    context('wallState', () => {
      const wallState = [
        [[    ], [            ], [     ], [ ], [ ]], // 5
        [[    ], [            ], [     ], [ ], [ ]], // 4
        [['Sb'], [        'Cw'], [     ], [ ], [ ]], // 3
        [['b' ], ['w','w','Cb'], [ 'Sw'], [ ], [ ]], // 2
        [['w' ], [         'w'], [     ], [ ], [ ]], // 1
        //  A           B           C      D    E
      ].reverse();

      const board = new Board(5, wallState);

      it('is invalid to move on top of a capstone', () => {
        const ptn  = new Ptn('b2+');
        const move = new Move(ptn, board, 'b');

        expect(move.isValid()).to.equal(false);
        expect(move.errors[0]).to.include(
          'Cannot move on top of a capstone at b3'
        );
      });

      it('is invalid to move on top of a wall with a flat', () => {
        const ptn  = new Ptn('a2+');
        const move = new Move(ptn, board, 'b');

        expect(move.isValid()).to.equal(false);
        expect(move.errors[0]).to.include(
          'Cannot move on top of a wall at a3'
        );
      });

      it('is invalid to smash a wall if the capstone is not the last piece', () => {
        const ptn  = new Ptn('3b2>111');
        const move = new Move(ptn, board, 'b');

        expect(move.isValid()).to.equal(false);
        expect(move.errors[0]).to.include(
          'Cannot flatten wall at c2 unless capstone is last piece'
        );
      });

      it('is valid to smash a wall with a capstone', () => {
        const ptn  = new Ptn('b2>');
        const move = new Move(ptn, board, 'b');

        expect(move.isValid()).to.equal(true);
      });

      it('is valid to move if nothing is in the', () => {
        const ptn  = new Ptn('3b2-');
        const move = new Move(ptn, board, 'b');

        expect(move.isValid()).to.equal(true);
      });
    });
  });
});
