import Player from './player';
import Board from './board';
import Ptn from './ptn';

const times = size => [...Array(size)];

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
    if (this.winningPlayer) return false;

    // Get rid of the last historical reference
    this.history.pop();

    const lastHistory = this.history[this.history.length - 1]

    this.turn = lastHistory.turn;
    this.board = lastHistory.board;

    [ this.whitePlayer, this.blackPlayer ]  = lastHistory.players;
  }

  move(ptnText, player=currentPlayer()) {
    if (this.winningPlayer) {
      return [true, this.winningPlayer, this.winType];
    }

    const ptn = new Ptn(ptnText);

    const [ status, ...response ] = this.board.move(
      currentPlayer(), ptn, [1,2].includes(this.turn)
    );

    if (!status) return response;

    const [ newBoard, newPlayer ] = response;

    let [ win, winningPlayer, winType ] = newBoard.checkWin();

    if (
      !win &&
      (newPlayer.pieces === 0 && newPlayer.capstones === 0) ||
      newBoard.isFull()
    ) {
      [ win, winningPlayer, winType ] = newBoard.checkFlatWin();
    }

    setCurrentPlayer(newPlayer);

    this.history.push({
      turn:    this.turn,
      board:   newBoard,
      players: [this.whitePlayer, this.blackPlayer],
      ptn,
      winningPlayer,
      winType
    });

    this.board         = newBoard;
    this.winType       = winType;
    this.winningPlayer = winningPlayer;

    if (win) return [true, winningPlayer, winType];

    this.turn += 1;
  }
}
