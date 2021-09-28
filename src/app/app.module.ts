import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { BoardPieceComponent } from './board/board-piece/board-piece.component';
import { GameManagerComponent } from './game-manager/game-manager.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { BoardService } from './board/board.service';
import { GameManagerService } from './game-manager/game-manager.service';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BoardPieceComponent,
    GameManagerComponent,
    AlertMessageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [BoardService, GameManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
