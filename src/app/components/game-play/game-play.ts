import { Component, EventEmitter, Output, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Player } from '../../models/game.models';

@Component({
  selector: 'app-game-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-play.html',
  styleUrls: ['./game-play.css']
})
export class GamePlay implements OnInit, OnDestroy {
  public gameService = inject(GameService);
  private cdr = inject(ChangeDetectorRef);

  @Output() onGameEnd = new EventEmitter<void>();

  // Переменные состояния экрана
  isRoleVisible: boolean = false; 
  isDiscussionPhase: boolean = false;

  // Таймер
  timeLeft: number = 0; // в секундах
  timerInterval: any;

  ngOnInit() {
    // Получаем время из конфигурации сервиса и переводим в секунды
    // (Добавим геттер getConfig в сервис или напрямую обратимся к private, если сделали public)
    // Для простоты предположим, что мы считываем базовое время
    const savedMinutes = this.gameService.timeLimit; 
    this.timeLeft = (savedMinutes * 60);
  }

  startDiscussion() {
    this.isDiscussionPhase = true;

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.cdr.detectChanges();
      } else {
        this.endTimer();
      }
    }, 1000);
  }

  endTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    alert('Время вышло! Пора голосовать и искать шпиона!');
  }

  // Переключение видимости карточки роли/слова
  toggleRoleVisibility() {
    this.isRoleVisible = !this.isRoleVisible;
  }

  // Кнопка "Я понял, скрыть и передать"
  nextStep() {
    this.isRoleVisible = false;
    const hasNext = this.gameService.moveToNextPlayer();
    
    if (!hasNext) {
      // Если игроков больше нет, запускаем таймер
      this.startDiscussion();
    }
  }

  // Красивое форматирование секунд в ММ:СС
  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getCurrentPlayer(): Player {
    return this.gameService.getCurrentPlayer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}