export default class Player {
  constructor(color, capstones, pieces) {
    this.color     = color;
    this.capstones = capstones;
    this.pieces    = pieces;
  }

  decrement (pieceType) {
    if (pieceType === 'capstone') {
      return new Player(this.color, this.capstones - 1, this.pieces);
    } else {
      return new Player(this.color, this.capstones, this.pieces - 1);
    }
  }
}
