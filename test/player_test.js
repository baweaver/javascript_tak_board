import { describe, it } from 'mocha';
import { expect } from 'chai';

import Player from '../source/player';

const makePlayer = (size) => new Player(size);

describe('Player', () => {
  describe('#properties', () => {
    it('has them', () => {
      expect(new Player('w', 1, 1)).to.include({
        color: 'w',
        capstones: 1,
        pieces: 1
      });
    });
  });
});
