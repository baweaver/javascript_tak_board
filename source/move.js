import Board from './board';

const times = size => [...Array(size)];

export default class Move {
  constructor(ptn, board, color, inverseStart) {
    this.board = new Board(board.size, board.cloneState());
    this.ptn   = ptn;
    this.color = color;
    this.errors = [];
    this.inverseStart = inverseStart;
  }

  isFirstTurnMove() {
    if (this.inverseStart && !this.ptn.isPlacement()) {
      this.errors.push('Cannot move on first turn');
      return true;
    }
  }

  isFirstTurnSpecial() {
    if (this.inverseStart && this.ptn.specialPiece) {
      this.errors.push('Must place a flat on first turn');
      return true;
    }
  }

  isNotOwnedByPlayer() {
    if (!this.originatingTop().includes(this.color)) {
      this.errors.push('Cannot move a stack not owned by player');
      return false;
    }
  }

  originatingSquare() {
    const { x, y } = this.ptn;

    return this.board.state[x][y];
  }

  originatingTop() {
    const origSquare = this.originatingSquare();

    return origSquare[origSquare.length - 1];
  }

  isNonEmptyPlacement() {
    if (this.originatingTop()) {
      this.errors.push('Cannot place a piece on a non-empty square');
      return true;
    }
  }

  isOverHandSize() {
    if (this.ptn.stackTotal() > this.board.state.length) {
      this.errors.push('Cannot pick up more pieces than hand size');
      return false;
    }
  }

  isNotTargetingCapstone(target, rowName, colName) {
    if (target.includes('C')) {
      this.errors.push(`Cannot move on top of a capstone at ${colName}${rowName}`);
      return true;
    }
  }

  isTargetingWall(target) {
    return target.includes('S');
  }

  isInvalidWallsmash(target, i, rowName, colName) {
    if (this.isTargetingWall(target)) {
      const topIsCapstone       = this.originatingTop()[0] === 'C';
      const notLastDistribution = this.ptn.distribution.length - 1 !== i;

      if (topIsCapstone && notLastDistribution) {
        this.errors.push(`Cannot flatten wall at ${colName}${rowName} unless capstone is last piece`);
        return true;
      } else {
        if (!topIsCapstone) {
          this.errors.push(`Cannot move on top of a wall at ${colName}${rowName}`);
          return true;
        }
      }
    }
  }

  isValid() {
    this.errors = [];

    const [ xOffset, yOffset ] = this.ptn.directionModifier();

    if (this.isFirstTurnMove() || this.isFirstTurnSpecial()) return false;

    if (this.ptn.isPlacement()) return !this.isNonEmptyPlacement();

    if (this.isNotOwnedByPlayer() || this.isOverHandSize()) return false;

    times((this.ptn.distribution || 1).length).find((v, i) => {
      const x1 = this.ptn.x + ((i + 1) * xOffset);
      const y1 = this.ptn.y + ((i + 1) * yOffset);

      const rowName = this.rowName(x1);
      const colName = this.colName(y1);

      const targetSquare   = this.board.state[x1][y1];
      const targetTopPiece = targetSquare[targetSquare.length - 1];

      if (
        this.isNotTargetingCapstone(targetTopPiece, rowName, colName) ||
        this.isInvalidWallsmash(targetTopPiece, i, rowName, colName)
      ) return true;
    });

    return !this.errors.length;
  }

  rowName(n) {
    return n + 1;
  }

  colName(n) {
    return 'abcdefgh'[n];
  }

  opposite (color) {
    color === 'w' ? 'b' : 'w';
  }

  apply() {
    if (!isValid()) {
      return [false, this.errors];
    }

    const [ xOffset, yOffset ] = this.ptn.directionModifier();
    const { x, y, distribution } = this.ptn;

    const originatingSquare = this.board.state[x][y];

    if (this.ptn.isPlacement()) {
      if (this.inverseStart) {
        originatingSquare.push(this.opposite(this.color));
      } else {
        originatingSquare.push(`${this.ptn.specialPiece}${this.color}`);
      }

      return [true, this.board, this.ptn.pieceType];
    }

    let hand = originatingSquare.slice(-1 - stackTotal, -1).reverse();

    times(distribution.length).forEach((v, i) => {
      const popCount = parseInt(v, 10);

      const x1 = x + (i * xOffset);
      const y1 = y + (i * yOffset);

      const targetSquare = this.board.state[x1][y1];

      times(popCount).forEach(() => targetSquare.push(hand.pop()));
    });

    return [true, this.board];
  }
}
