import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-board-piece',
  templateUrl: './board-piece.component.html',
  styleUrls: ['./board-piece.component.css'],
})
export class BoardPieceComponent {
  @Input() color!: string;
}
