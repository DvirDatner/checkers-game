import { Component, OnInit } from '@angular/core';

import { BoardService } from './board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  boardMatrix: number[][] = [];

  constructor(private boardService: BoardService) {
    this.boardService.boardUpdated.subscribe(() => {
      this.boardMatrix = this.boardService.getBoardMatrix();
    });
  }

  ngOnInit(): void {
    this.boardMatrix = this.boardService.getBoardMatrix();
  }

  onBoardClickHandler(row: number, col: number) {
    this.boardService.boardClicked(row, col);
  }
}
