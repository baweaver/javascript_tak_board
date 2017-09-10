import Move from './move';

export default class Board {
  constructor(size, state) {
    this.size       = size;
    this.state      = state || this.cleanBoard(size);
  }

  cleanBoard (size) {
    const sizeTimes = [...Array(size)];

    return sizeTimes.map(() => sizeTimes.map(() => []));
  }

  clone (value) {
    return JSON.parse(JSON.stringify(value))
  }

  cloneState () {
    return JSON.parse(JSON.stringify(this.state));
  }

  checkWin () {
    return false;
  }

  move (player, ptn, inverseStart) {
    if (!ptn.isValid(this.size, player.capstones, player.pieces, inverseStart)) {
      return [false, ptn.errors];
    }

    const move = new Move(ptn, this, player.color, inverseStart);
    const [ status, ...response ] = move.apply();

    if (!status) {
      return [false, move.errors];
    }

    const [newBoard, pieceType] = response;

    return [true, newBoard, pieceType];
  }

  maxCell () {
    const flatState = [].concat.apply([], this.state);

    return flatState.sort((a,b) => {
      return b.length - a.length;
    })[0];
  }

  toString() {
    const maxCell = this.maxCell();
    const maxSize = maxCell.join(' ').length || 1;
    const pad     = [...Array(maxSize)].map(() => ' ').join(' ');

    const rows = this.clone(this.state).reverse().map((row, i) => {
      const rowHead = ` ${this.size - i}`;

      const columns = row.map(cell =>
        `[ ${this.clone(cell).reverse().join(' ').padStart(maxSize)} ]`
      );

      return `${rowHead} ${columns.join(' ')}`;
    });

    const footer = 'ABCDEFGH'
      .slice(0, this.state.length)
      .split('')
      .map(c => c.padStart(maxSize + 2))
      .join('   ');

    return `${rows.join("\n")}\n   ${footer}`;
  }
}
