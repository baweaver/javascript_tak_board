export default class Ptn {
  constructor (notation) {
    const matchData = notation.match(/(\d)?([CS])?([a-h])([1-8])(([<>+-])([1-8]+)?(\*)?)?/i);

    if (!matchData) {
      throw new Error('Invalid PTN format');
    }

    [
      this.ptn,
      this.pieceCount,
      this.specialPiece,
      this.column,
      this.row,
      this.movement,
      this.direction,
      this.distribution,
      this.wallSmash
    ] = matchData;

    this.pieceType = this.specialPiece === 'C' ? 'capstone' : 'piece'

    this.x = parseInt(this.row, 10) - 1;
    this.y = 'abcdefgh'.indexOf(this.column);

    if (this.movement && !this.pieceCount) {
      this.pieceCount = '' + (this.distribution || 1);
    }

    if (this.movement && !this.distribution) {
      this.distribution = '' + (this.pieceCount || 1);
    }
  }

  isValid (boardSize = 8, capCount, pieceCount) {
    this.errors = [];

    if (this.stackTotal() > boardSize) {
      this.errors.push('Cannot pick up more pieces than the carry limit');
    }

    if (this.isPlacement()) {
      if (!capCount && this.specialPiece === 'C') {
        this.errors.push('No more capstones available to play');
      } else if (!pieceCount) {
        this.errors.push('No pieces left to play');
      }
    }

    if (this.isMovement() && !this.isValidStackDistribution()) {
      this.errors.push('PTN does not contain a valid stack distribution');
    }

    if (!this.isMovement() && !this.isPlacement()) {
      this.errors.push('PTN is not a movement or placement');
    }

    const columnTrajectory = this.columnTrajectory();
    if (columnTrajectory < 0 || columnTrajectory > boardSize) {
      this.errors.push(
        `Column trajectory of ${columnTrajectory + 1} is out of bounds for a board size of ${boardSize}`
      );
    }

    const rowTrajectory = this.rowTrajectory();
    if (rowTrajectory < 0 || rowTrajectory > boardSize) {
      this.errors.push(
        `Row trajectory of ${rowTrajectory + 1} is out of bounds for a board size of ${boardSize}`
      );
    }

    return !this.errors.length;
  }

  stackDistribution () {
    return this.distribution.split('').map(s => parseInt(s, 10));
  }


  stackTotal () {
    if (!this.distribution) {
      return 1;
    }

    return this.distribution.split('').reduce(
      (a, i) => a + parseInt(i, 10), 0
    );
  }

  isValidStackDistribution () {
    if (!this.pieceCount && !this.distribution) {
      return true;
    }

    return parseInt(this.pieceCount, 10) === this.stackTotal();
  }

  isMovement () {
    return !!this.movement;
  }

  isPlacement () {
    return !this.isMovement() && !this.pieceCount;
  }

  columnTrajectory () {
    const offset = this.directionModifier()[1] * this.stackTotal();

    return this.y + offset;
  }

  rowTrajectory () {
    const offset = this.directionModifier()[0] * this.stackTotal();

    return this.x + offset;
  }

  directionModifier () {
    switch(this.direction) {
      case '>': return [0, 1];
      case '<': return [0, -1];
      case '+': return [1, 0];
      case '-': return [-1, 0];
      default:  return [0, 0];
    }
  }
}
