import { Injectable } from '@angular/core';
import { Player, GameConfig } from '../models/game.models';
import { WORDS_DATABASE } from '../constants/words';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private players: Player[] = [];
  private secretWord: string = '';
  private config!: GameConfig;
  public currentPlayerIndex: number = 0;
  public timeLimit: number = 5;

  constructor() {}

  startGame(playerNames: string[], config: GameConfig){
    this.config = config;
    this.currentPlayerIndex = 0;

    //Choose secret word
    const randomId = Math.floor(Math.random() * WORDS_DATABASE.length);
    this.secretWord = WORDS_DATABASE[randomId];

    //Generate players
    this.players = playerNames.map((name,id) => ({
      id: id,
      name: name,
      role: 'citizen',
      isRoleViewed: false
    }));

    this.assignSpies();
  }

  private assignSpies(){
    let assignedSpies = 0;
    while (assignedSpies < this.config.spyCount){
      const randomIndex = Math.floor(Math.random() * this.players.length);
      if (this.players[randomIndex].role !== 'spy'){
        this.players[randomIndex].role = 'spy';
        assignedSpies++;
      }
    }
  }

  getWordOrRoleForPlayer(player: Player): string {
    if (player.role === 'spy'){
      return 'Вы ШПИОН';
    }else{
      return `Секретное слово: ${this.secretWord}`;
    }
  }

  moveToNextPlayer(): boolean {
    this.players[this.currentPlayerIndex].isRoleViewed = true;
    if (this.currentPlayerIndex < this.players.length-1){
      this.currentPlayerIndex++;
      return true;
    }
    return false;
  }

  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  getPlayers(): Player[] {
    return this.players;
  }
}
