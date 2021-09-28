import { Component, OnInit } from '@angular/core';
import { BoardService } from '../board/board.service';
import { GameManagerService } from './game-manager.service';

@Component({
  selector: 'app-game-manager',
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.css'],
})
export class GameManagerComponent implements OnInit {
  notValidMovement = false;
  gameFinish = false;
  playerTurn!: number;

  constructor(
    private gameManagerService: GameManagerService,
    private boardService: BoardService
  ) {
    this.boardService.errorMove.subscribe(() => {
      this.notValidMovement = true;
    });

    this.gameManagerService.playerChanged.subscribe(() => {
      this.playerTurn = this.gameManagerService.playerTurn;
    });

    this.boardService.gameFinish.subscribe(() => {
      this.gameFinish = true;
    });
  }

  ngOnInit(): void {
    this.playerTurn = this.gameManagerService.playerTurn;
  }

  onHandleError() {
    this.notValidMovement = false;
  }

  onCancelChoice() {
    this.boardService.cancelChoice();
  }

  onHandleFinish() {
    this.gameManagerService.initGame();
    this.boardService.initBoard();
    this.gameFinish = false;
  }
}
