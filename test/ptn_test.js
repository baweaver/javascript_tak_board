import { describe, it } from 'mocha';
import { expect } from 'chai';

import Ptn from '../source/ptn';

const makePtn = (ptn) => new Ptn(ptn);

describe('Ptn', () => {
  describe('#properties', () => {
    it('recognizes a movement', () => {
      expect(
        makePtn('3d3+111')
      ).to.include({
        ptn:          '3d3+111',
        pieceCount:   '3',
        column:       'd',
        row:          '3',
        movement:     '+111',
        direction:    '+',
        distribution: '111',
        x:            2,
        y:            3
      });
    });

    it('recognizes a capstone placement', () => {
      expect(
        makePtn('Cd3')
      ).to.include({
        ptn:          'Cd3',
        specialPiece: 'C',
        column:       'd',
        row:          '3',
        x:            2,
        y:            3
      });
    });

    it('recognizes a wall placement', () => {
      expect(
        makePtn('Sd3')
      ).to.include({
        ptn:          'Sd3',
        specialPiece: 'S',
        column:       'd',
        row:          '3',
        x:            2,
        y:            3
      });
    });

    it('recognizes a wall smash', () => {
      expect(
        makePtn('3d3>111*')
      ).to.include({
        wallSmash: '*'
      });
    });

    it('throws an error for invalid PTN', () => {
      expect(() => {
        makePtn('9z')
      }).to.throw('Invalid PTN format');
    });
  });

  describe('#stackTotal', () => {
    it('gives the total of pieces moved', () => {
      expect(
        makePtn('3d3+111').stackTotal()
      ).to.equal(3);
    });

    it('returns 1 if there is no distribution', () => {
      expect(
        makePtn('d3').stackTotal()
      ).to.equal(1);
    });
  });

  describe('#isValidStackDistribution', () => {
    it('checks if the piece count and stack total match', () => {
      expect(
        makePtn('3d3+111').isValidStackDistribution()
      ).to.equal(true);
    });

    it('will be false if the counts are different', () => {
      expect(
        makePtn('3d3+1111').isValidStackDistribution()
      ).to.equal(false);
    });

    it('will return true if there are no pieces and no distribution', () => {
      expect(
        makePtn('d3').isValidStackDistribution()
      ).to.equal(true);
    });
  });

  describe('#isMovement', () => {
    it('looks for a movement', () => {
      expect(
        makePtn('d3+').isMovement()
      ).to.equal(true);
    });

    it('can detect more complicated movements', () => {
      expect(
        makePtn('d3+*').isMovement()
      ).to.equal(true);
    });

    it('will return false if no move is made', () => {
      expect(
        makePtn('d3').isMovement()
      ).to.equal(false);
    });
  });

  describe('#isPlacement', () => {
    it('looks for a placement', () => {
      expect(
        makePtn('d3').isPlacement()
      ).to.equal(true);
    });

    it('can detect a special placement', () => {
      expect(
        makePtn('Cd3').isPlacement()
      ).to.equal(true);
    });

    it('will return false for a non placement', () => {
      expect(
        makePtn('3d3').isPlacement()
      ).to.equal(false);
    });
  });

  describe('#isValid', () => {
    it('checks to see if the PTN is valid', () => {
      const ptn = makePtn('3d3+1111');

      expect(ptn.isValid()).to.equal(false);
      expect(ptn.errors[0]).to.include('PTN does not contain a valid stack distribution');
    });

    it('checks for out of bounds', () => {
      const ptn = makePtn('8d3+11111111');

      expect(ptn.isValid()).to.equal(false);
      expect(ptn.errors[0]).to.include(
        'Row trajectory of 11 is out of bounds for a board size of 8'
      );
    });
  });

  describe('#rowTrajectory', () => {
    it('will return the row number if it is a placement', () => {
      expect(
        makePtn('d3').rowTrajectory()
      ).to.equal(2);
    });

    it('will ignore a column movement', () => {
      expect(
        makePtn('3d3>111').rowTrajectory()
      ).to.equal(2);
    });

    it('will return the trajectory row of a movement up', () => {
      expect(
        makePtn('3d3+111').rowTrajectory()
      ).to.equal(5);
    });

    it('will return the trajectory row of a movement down', () => {
      expect(
        makePtn('2d3-11').rowTrajectory()
      ).to.equal(0);
    });
  });

  describe('#columnTrajectory', () => {
    it('will return the column number if it is a placement', () => {
      expect(
        makePtn('d3').columnTrajectory()
      ).to.equal(3);
    });

    it('will ignore a row movement', () => {
      expect(
        makePtn('3d3+111').columnTrajectory()
      ).to.equal(3);
    });

    it('will return the trajectory column of a movement left', () => {
      expect(
        makePtn('3d3<111').columnTrajectory()
      ).to.equal(0);
    });

    it('will return the trajectory column of a movement right', () => {
      expect(
        makePtn('2d3>11').columnTrajectory()
      ).to.equal(5);
    });
  });
});
