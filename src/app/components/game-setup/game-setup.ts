import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-setup.html',
  styleUrl: './game-setup.css',
})
export class GameSetup {
  private gameService = inject(GameService);

  @Output() onBack = new EventEmitter<void>();
  @Output() onGameReady = new EventEmitter<void>();

  // Дефолтные настройки
  players: string[] = [];
  newPlayerName: string = '';
  spyCount: number = 1;
  timeLimit: number = 5; // в минутах

  // Добавление нового игрока
  addPlayer() {
    const name = this.newPlayerName.trim();
    if (name && !this.players.includes(name)) {
      this.players.push(name);
      this.newPlayerName = ''; // Очищаем инпут
    }
  }

  // Удаление игрока из списка
  removePlayer(index: number) {
    if (this.players.length > 3) { // Минимум 3 игрока для игры
      this.players.splice(index, 1);
    } else {
      alert('Минимум нужно 3 игрока!');
    }
  }

  // Изменение количества шпионов (валидация, чтобы шпионов не было больше, чем игроков)
  changeSpyCount(delta: number) {
    const newValue = this.spyCount + delta;
    if (newValue >= 1 && newValue < this.players.length - 1) {
      this.spyCount = newValue;
    }
  }

  // Изменение времени таймера
  changeTime(delta: number) {
    const newValue = this.timeLimit + delta;
    if (newValue >= 1 && newValue <= 15) {
      this.timeLimit = newValue;
      this.gameService.timeLimit = newValue;
    }
  }

  // Запуск игры
  onStart() {
    if (this.players.length >= 3) { // Минимум 3 игрока для игры
      this.gameService.startGame(this.players, {
        spyCount: this.spyCount,
        timeLimit: this.timeLimit
      });
      this.onGameReady.emit();
    } else {
      alert('Минимум нужно 3 игрока!');
    }
  }
}