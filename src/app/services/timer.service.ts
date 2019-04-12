import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment }  from 'moment';
import { BehaviorSubject } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  
  private _timer = new BehaviorSubject<number>(0); //время в таймере
  private _settingHours = new BehaviorSubject<number>(0); //часы из настроек
  private _settingMinutes = new BehaviorSubject<number>(1); //минуты из настроек
  private _settingSeconds = new BehaviorSubject<number>(30); //секунды из настроек
  private _isPlaySoundInEnd = new BehaviorSubject<boolean>(false); //проигрывать звук при окончании таймера?  //TODO: сменить на true
  private _isTimerRunning = new BehaviorSubject<boolean>(false); //таймер запущен?

  private audio: HTMLAudioElement; //Звук сигнала окончания таймера
  private intervalTimer: NodeJS.Timer;

  public timeEnd: Moment; //Время окончания таймера (unixTime)

  public timer$ = this._timer.asObservable();
  public isTimerRunning$ = this._isTimerRunning.asObservable();
 // public settingHours$ = this._settingHours.asObservable();
 // public settingMinutes$ = this._settingMinutes.asObservable();
  //public settingSeconds$ = this._settingSeconds.asObservable();
  //public isPlaySoundInEnd$ = this._isPlaySoundInEnd.asObservable();


  constructor(private settingsService: SettingsService) { 
    this.audio = new Audio('/assets/alarm1.wav')

    this.updateTimer = this.updateTimer.bind(this);
  }

  public set timer(newValue: number){
    this._timer.next(newValue);
  }
  public get timer(): number{
    return this._timer.getValue();
  }

  public set settingHours(newValue: number){
    this._settingHours.next(parseInt(newValue + ''));
  }
  public get settingHours(): number{
    return this._settingHours.getValue();
  }

  public set settingMinutes(newValue: number){
    this._settingMinutes.next(parseInt(newValue + ''));
  }
  public get settingMinutes(): number{
    return this._settingMinutes.getValue();
  }

  public set settingSeconds(newValue: number){
    this._settingSeconds.next(parseInt(newValue + ''));
  }
  public get settingSeconds(): number{
    return this._settingSeconds.getValue();
  }

  public set isPlaySoundInEnd(newValue: boolean){
    this._isPlaySoundInEnd.next(newValue);
  }
  public get isPlaySoundInEnd(): boolean{
    return this._isPlaySoundInEnd.getValue();
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
      /* TODO
      if(!ModelSettings.get(EnumSettingFields.ExerciseTypes) || !ModelSettings.get(EnumSettingFields.ExerciseTypes).length){
          webix.message({
              text: "У вас не заполнены типы упражнений! Данные не будут сохранены!",
              type:"error",
              expire: 15000,
              id:"Data_error"
          });
      }*/

      this.isTimerRunning = true;
      this.timeEnd = moment();
      this.timeEnd.add(this.settingHours, 'h');
      this.timeEnd.add(this.settingMinutes, 'm');
      this.timeEnd.add(this.settingSeconds, 's');


      //запускаем таймер
      this.intervalTimer = setInterval(this.updateTimer, 10);

      //если уже есть результаты прошлые
      /* TODO
      if(this.resultsExercise.length){  
          this.resultsExercise.last().timeEnd = new Date();
      }

      //выделяем ввод в последнее поле с количеством
      const tableJquery = $($$(this.ids.tableResults).getNode());
      tableJquery.find('.' + this.ids.inputsCount).last().select();*/
  }

  /**
   * Остановка таймера на паузу, если запущен
   */
  pauseTimer(){
      this.isTimerRunning = false;

      //останавливаем таймер
      clearInterval(this.intervalTimer);
  }

  /**
   * Остановка и очистка таймера
   */
  clearTimer(){
      this.isTimerRunning = false;
      this.updateTimer();

      //останавливаем таймер
      clearInterval(this.intervalTimer);
  }

  /**
   * Окончание таймера
   */
  endTimer(){
      this.isTimerRunning = false;
      this.clearTimer();

      if(this.isPlaySoundInEnd){
          this.audio.play();
      }

      //this.addResults(); TODO: создать сервис

      //показываем уведомление
      if ("Notification" in window && this.settingsService.isOnPushMessage) {
          if (Notification.permission === "granted") {
              new Notification("Timer. Go!");
          }
      }
  }
  
  /**
   * Обновляет время на таймере
   */
  updateTimer() : void{
      if(this.isTimerRunning){
          this.timer = this.timeEnd.valueOf() - moment().valueOf();

          //end
          if(this.timer <= 0){
              this.endTimer();
          }
      }
      else{
          this.timer = this.settingHours * 60 * 60 * 1000 + 
            this.settingMinutes * 60  * 1000 + 
            this.settingSeconds * 1000;
      }
  }


}
