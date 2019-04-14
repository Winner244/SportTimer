import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment }  from 'moment';
import { BehaviorSubject } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  
  //для внутреннего использования
  private _timer = new BehaviorSubject<number>(0); //время в таймере
  private _isTimerRunning = new BehaviorSubject<boolean>(false); //таймер запущен?

  private _audio: HTMLAudioElement; //Звук сигнала окончания таймера
  private _intervalTimer: NodeJS.Timer; //для работы таймера во включённом состоянии
  private _timeEnd: Moment; //Время окончания таймера (unixTime)
  private _settingHours: number; //часы из настроек
  private _settingMinutes: number; //минуты из настроек
  private _settingSeconds: number; //секунды из настроек
  private _callbacksStartTimer: Array<Function>; 
  private _callbacksEndTimer: Array<Function>; 

  //для внешнего использования
  public timer$ = this._timer.asObservable();
  public isTimerRunning$ = this._isTimerRunning.asObservable();

  public isPlaySoundInEnd: boolean; //проигрывать звук при окончании таймера?  


  constructor(private settingsService: SettingsService) { 
    this._audio = new Audio('/assets/alarm1.wav')
    this._settingHours = 0;
    this._settingMinutes = 1;
    this._settingSeconds = 30;
    this._callbacksStartTimer = [];
    this._callbacksEndTimer = [];

    this.updateTimer = this.updateTimer.bind(this);
  }

  public set timer(newValue: number){
    this._timer.next(newValue);
  }
  public get timer(): number{
    return this._timer.getValue();
  }

  public set settingHours(newValue: number){
    this._settingHours = newValue;
    this.updateTimer();
  }
  public get settingHours(): number{
    return this._settingHours;
  }

  public set settingMinutes(newValue: number){
    this._settingMinutes = newValue;
    this.updateTimer();
  }
  public get settingMinutes(): number{
    return this._settingMinutes;
  }

  public set settingSeconds(newValue: number){
    this._settingSeconds = newValue;
    this.updateTimer();
  }
  public get settingSeconds(): number{
    return this._settingSeconds;
  }

  public set isTimerRunning(newValue: boolean){
    this._isTimerRunning.next(newValue);
  }
  public get isTimerRunning(): boolean{
    return this._isTimerRunning.getValue();
  }
  

  /**
   * Запуск таймера
   */
  playTimer(){
    this.isTimerRunning = true;
    this._timeEnd = moment();
    this._timeEnd.add(this.settingHours, 'h');
    this._timeEnd.add(this.settingMinutes, 'm');
    this._timeEnd.add(this.settingSeconds, 's');


    //запускаем таймер
    this._intervalTimer = setInterval(this.updateTimer, 10);

    //вызов подписанных функций
    this._callbacksStartTimer.map(x => x());
  }

  /**
   * Остановка таймера на паузу, если запущен
   */
  pauseTimer(){
    this.isTimerRunning = false;

    //останавливаем таймер
    clearInterval(this._intervalTimer);
  }

  /**
   * Остановка и очистка таймера
   */
  clearTimer(){
    this.isTimerRunning = false;
    this.updateTimer();

    //останавливаем таймер
    clearInterval(this._intervalTimer);
  }

  /**
   * Окончание таймера
   */
  endTimer(){
    this.isTimerRunning = false;
    this.clearTimer();

    if(this.isPlaySoundInEnd){
        this._audio.play();
    }

    //показываем уведомление
    if ("Notification" in window && this.settingsService.isOnPushMessage) {
        if (Notification.permission === "granted") {
            new Notification("Timer. Go!");
        }
    }

    //вызов подписанных функций
    this._callbacksEndTimer.map(x => x());
  }

  /**
   * Обновляет время на таймере
   */
  updateTimer() : void{
    if(this.isTimerRunning){ 
      //update
      this.timer = this._timeEnd.valueOf() - moment().valueOf();

      //end
      if(this.timer <= 0){
          this.endTimer();
      }
    }
    else{ 
      //start
      this.timer = this.settingHours * 60 * 60 * 1000 + 
          this.settingMinutes * 60  * 1000 + 
          this.settingSeconds * 1000;
    }
  }

  addCallbackStart(callback: Function): void{
    this._callbacksStartTimer.push(callback);
  }
  addCallbackEnd(callback: Function): void{
    this._callbacksEndTimer.push(callback);
  }
}
