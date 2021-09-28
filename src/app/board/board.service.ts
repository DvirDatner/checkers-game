import { EventEmitter, Injectable } from '@angular/core';
import { GameManagerService } from '../game-manager/game-manager.service';

@Injectable()
export class BoardService {
  private boardMatrix: number[][] = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
  ];
  private playerTurn!: number;
  private currentPiecePlace!: { row: number; col: number };
  private isPieceChoosed = false;

  boardUpdated = new EventEmitter<void>();
  errorMove = new EventEmitter<void>();
  gameFinish = new EventEmitter<void>();

  constructor(private gameManagerService: GameManagerService) {
    this.playerTurn = this.gameManagerService.playerTurn;

    this.gameManagerService.playerChanged.subscribe(() => {
      this.playerTurn = this.gameManagerService.playerTurn;
    });
  }

  getBoardMatrix() {
    return this.boardMatrix.slice();
  }

  boardClicked(row: number, col: number) {
    // clicked on white cell on the board
    if (
      !(row % 2 === 0 && col % 2 !== 0) &&
      !(row % 2 !== 0 && col % 2 === 0)
    ) {
      // there is piece that choosed
      if (this.isPieceChoosed) {
        this.oneStepBack();
      }
      return;
    }

    let cellType = this.boardMatrix[row][col];

    // there is not piece that choosed
    if (!this.isPieceChoosed) {
      // clicked on empty cell or on cell that contain other player piece
      if (cellType === 0 || this.playerTurn !== cellType) {
        return;
      }

      // clicked on cell that contain current player cell
      this.isPieceChoosed = true;
      this.currentPiecePlace = { row, col };
      this.boardMatrix[row][col] = 0;
      this.boardUpdated.emit();
      return;
    }

    // there is piece that choosed

    // the clicked cell contain some piece
    if (cellType != 0) {
      this.oneStepBack();
      return;
    }

    // the clicked cell is empty cell
    let rowDiff = Math.abs(this.currentPiecePlace.row - row);
    let colDiff = Math.abs(this.currentPiecePlace.col - col);

    // the clicked cell is illegal step
    if (
      rowDiff > 2 ||
      colDiff > 2 ||
      rowDiff === 0 ||
      colDiff === 0 ||
      (this.playerTurn === 1 && row > this.currentPiecePlace.row) ||
      (this.playerTurn === 2 && row < this.currentPiecePlace.row)
    ) {
      this.oneStepBack();
      return;
    }

    // the clicked cell is legal step
    if (rowDiff === 1 && colDiff === 1) {
      this.placeStep(row, col);
      return;
    }

    // player turn is one and the clicked cell is legal step with jump over player two piece
    if (this.playerTurn === 1) {
      if (row < this.currentPiecePlace.row) {
        if (
          col < this.currentPiecePlace.col &&
          this.boardMatrix[row + 1][col + 1] === 2
        ) {
          this.boardMatrix[row + 1][col + 1] = 0;
          this.placeStep(row, col);
          return;
        }
        if (
          col > this.currentPiecePlace.col &&
          this.boardMatrix[row + 1][col - 1] === 2
        ) {
          this.boardMatrix[row + 1][col - 1] = 0;
          this.placeStep(row, col);
          return;
        }
      }

      // other case - illegal step
      this.oneStepBack();
      return;
    }

    // player turn is two and the clicked cell is legal step with jump over player one piece
    if (this.playerTurn === 2) {
      if (row > this.currentPiecePlace.row) {
        if (
          col < this.currentPiecePlace.col &&
          this.boardMatrix[row - 1][col + 1] === 1
        ) {
          this.boardMatrix[row - 1][col + 1] = 0;
          this.placeStep(row, col);
          return;
        }
        if (
          col > this.currentPiecePlace.col &&
          this.boardMatrix[row - 1][col - 1] === 1
        ) {
          this.boardMatrix[row - 1][col - 1] = 0;
          this.placeStep(row, col);
          return;
        }
      }

      // other case - illegal step
      this.oneStepBack();
      return;
    }
  }

  private oneStepBack() {
    // return the board one step back, raise error and board update events emmiter
    this.boardMatrix[this.currentPiecePlace.row][this.currentPiecePlace.col] =
      this.playerTurn;
    this.isPieceChoosed = false;
    this.errorMove.emit();
    this.boardUpdated.emit();
  }

  private placeStep(row: number, col: number) {
    this.boardMatrix[row][col] = this.playerTurn;
    this.isPieceChoosed = false;
    if (!this.gameIsFinish()) {
      this.gameManagerService.changePlayerTurn();
      this.boardUpdated.emit();
    }
  }

  private gameIsFinish() {
    let playerOnePiecesCount = 0;
    let playerTwoPiecesCount = 0;

    this.boardMatrix[0].forEach((element) => {
      if (element === 1) {
        playerOnePiecesCount++;
      }
    });

    this.boardMatrix[7].forEach((element) => {
      if (element === 2) {
        playerTwoPiecesCount++;
      }
    });

    if (playerOnePiecesCount === 2 || playerTwoPiecesCount === 2) {
      this.gameFinish.emit();
      return true;
    }

    return false;
  }

  cancelChoice() {
    // return the board one step back, raise board update event emmiter
    this.boardMatrix[this.currentPiecePlace.row][this.currentPiecePlace.col] =
      this.playerTurn;
    this.isPieceChoosed = false;
    this.boardUpdated.emit();
  }

  initBoard() {
    this.boardMatrix = [
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
    ];

    this.isPieceChoosed = false;

    this.boardUpdated.emit();
  }
}
