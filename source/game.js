import Player from './player';
import Board from './board';
import Ptn from './ptn';

const tileCounts = [
  [0, 10],
  [0, 15],
  [1, 21],
  [1, 30],
  [2, 40],
  [2, 50]
];

class Game {
  constructor(size = 5) {
    [ this.capstoneTotal, this.pieceTotal ] = tileCounts[size - 3];

    this.turn = 1;

    this.history = [];

    this.whitePlayer = new Player('w', this.capstoneTotal, this.pieceTotal);
    this.blackPlayer = new Player('b', this.capstoneTotal, this.pieceTotal);

    this.board = new Board(size);
  }

  currentPlayer () {
    return this.turn % 2 == 0 ? this.blackPlayer : this.whitePlayer;
  }

  setCurrentPlayer(newPlayer) {
    if (this.turn % 2 == 0) {
      this.blackPlayer = newPlayer;
    } else {
      this.whitePlayer = newPlayer;
    }

    return newPlayer;
  }

  undo () {
    if (this.result) return false;

    // Get rid of the last historical reference
    this.history.pop();

    const lastHistory = this.history[this.history.length - 1]

    this.turn = lastHistory.turn;
    this.board = lastHistory.board;

    [ this.whitePlayer, this.blackPlayer ]  = lastHistory.players;
  }

  move(ptnText, player=currentPlayer()) {
    if (this.result) {
      return [true, this.result];
    }

    const ptn = new Ptn(ptnText);

    const [ status, ...response ] = this.board.move(
      currentPlayer(), ptn, this.turn in [1,2]
    );

    if (!status) return response;

    const [ newBoard, newPlayer ] = response;

    const [ win, result ] = newBoard.checkWin();

    setCurrentPlayer(newPlayer);

    this.history.push({
      turn:    this.turn,
      board:   newBoard,
      players: [this.whitePlayer, this.blackPlayer],
      ptn,
      win,
      result
    });

    this.board  = newBoard;
    this.win    = win;
    this.result = result;

    if (result) return [true, result];

    this.turn  += 1;
  }
}
