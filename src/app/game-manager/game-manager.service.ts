import { EventEmitter, Injectable } from "@angular/core";
import { BoardService } from "../board/board.service";

@Injectable()
export class GameManagerService {
    playerTurn = 1;
    playerChanged = new EventEmitter<void>();

    changePlayerTurn() {
        this.playerTurn  = this.playerTurn === 1 ? 2 : 1;
        this.playerChanged.emit();
    }

    initGame() {
        this.playerTurn = 1;
        this.playerChanged.emit();
    }
}