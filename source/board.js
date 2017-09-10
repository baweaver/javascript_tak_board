import Move from './move';

const times  = size => [...Array(size)].map((n,i) => i);
const last   = collection => collection[collection.length - 1];
const indent = (str, n) => `${times(n).map(() => ' ').join('')}${str}`;

export default class Board {
  constructor(size, state) {
    this.size   = size;
    this.state  = state || this.cleanBoard(size);
  }

  cleanBoard (size) {
    return times(size).map(() => times(size).map(() => []));
  }

  visitedBoard (size) {
    return times(size).map(() => times(size).map(() => false));
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

  bitBoard (color) {
    const roadPieces = [`C${color}`, color];

    return this.state.map(row => {
      return row.map(cell => {
        return roadPieces.includes(last(cell)) ? 1 : 0
      });
    });
  }

  isRoadWin (color) {
    let bitBoard = this.bitBoard(color);

    const unidirectionalSearch = this.pathSearch(0, 0, undefined, bitBoard);

    if (unidirectionalSearch) return true;

    return !!times(this.size).find((x, n) =>
      this.pathSearch(0, n, 'horizontal', bitBoard) ||
      this.pathSearch(n, 0, 'vertical', bitBoard)
    );
  }

  isRoadEnd (direction, x, y) {
    if (direction === 'horizontal') return x === this.size - 1;
    if (direction === 'vertical')   return y === this.size - 1;

    return x === this.size - 1 || y === this.size - 1;
  }

  pathSearch(x, y, direction, bitBoard, traversed = this.visitedBoard(this.size)) {
    if (this.outOfBounds(x,y) || traversed[x][y]) return false;

    const pieceValue = bitBoard[x][y];

    if (pieceValue === 0) return false; // Non-road piece

    if (this.isRoadEnd(direction, x, y)) return true;

    traversed[x][y] = true;

    // Recurse in all four directions. While this may retrace steps it is
    // necessary as roads in Tak can curve wildly.
    return this.pathSearch(x + 1, y,     direction, bitBoard, traversed) ||
           this.pathSearch(x - 1, y,     direction, bitBoard, traversed) ||
           this.pathSearch(x,     y + 1, direction, bitBoard, traversed) ||
           this.pathSearch(x,     y - 1, direction, bitBoard, traversed);
  }

  outOfBounds (x, y) {
    return x < 0 || y < 0 || x > this.size - 1 || y > this.size - 1
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
