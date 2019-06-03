import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
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
   private _isPlaySoundInEnd: boolean; //проигрывать звук при окончании таймера?  
   private _callbacksStartTimer: Array<Function>;
   private _callbacksEndTimer: Array<Function>;
   private _isOpenSeettings = new BehaviorSubject<boolean>(false); //окно с настройками таймера открыто? (для разрешения < 630px)

   //для внешнего использования
   public timer$ = this._timer.asObservable();
   public isOpenSeettings$ = this._isOpenSeettings.asObservable();
   public isTimerRunning$ = this._isTimerRunning.asObservable();


   constructor(private settingsService: SettingsService) {
      this._audio = new Audio('/assets/alarm1.wav')
      this._settingHours = parseInt(localStorage.getItem('TimerService.settingHours')) || 0;
      this._settingMinutes = this._getDefaultMinutes();
      this._settingSeconds = parseInt(localStorage.getItem('TimerService.settingSeconds')) || 30;
      this._isPlaySoundInEnd = (localStorage.getItem('TimerService.isPlaySoundInEnd') || 'true') === 'true';
      this._callbacksStartTimer = [];
      this._callbacksEndTimer = [];

      this.updateTimer = this.updateTimer.bind(this);

      this.updateTimer();
   }

   //set/get
   public set timer(newValue: number) {
      this._timer.next(newValue);
   }
   public get timer(): number {
      return this._timer.getValue();
   }

   public set settingHours(newValue: number) {
      localStorage.setItem('TimerService.settingHours', newValue + '');
      this._settingHours = newValue;
      this.updateTimer();
   }
   public get settingHours(): number {
      return this._settingHours;
   }

   public set settingMinutes(newValue: number) {
      localStorage.setItem('TimerService.settingMinutes', newValue + '');
      this._settingMinutes = newValue;
      this.updateTimer();
   }
   public get settingMinutes(): number {
      return this._settingMinutes;
   }

   public set settingSeconds(newValue: number) {
      console.log('settingSeconds', newValue);
      localStorage.setItem('TimerService.settingSeconds', newValue + '');
      this._settingSeconds = newValue;
      this.updateTimer();
   }
   public get settingSeconds(): number {
      return this._settingSeconds;
   }

   public set isTimerRunning(newValue: boolean) {
      this._isTimerRunning.next(newValue);
   }
   public get isTimerRunning(): boolean {
      return this._isTimerRunning.getValue();
   }

   public set isPlaySoundInEnd(newValue: boolean) {
      localStorage.setItem('TimerService.isPlaySoundInEnd', newValue + '');
      this._isPlaySoundInEnd = newValue;
   }
   public get isPlaySoundInEnd(): boolean {
      return this._isPlaySoundInEnd;
   }

   private set isOpenSeettings(newValue: boolean){
     this._isOpenSeettings.next(newValue);
   }
   private get isOpenSeettings(): boolean{
     return this._isOpenSeettings.getValue();
   }


   /**
    * Запуск таймера
    */
   public playTimer() {
      this.isTimerRunning = true;

      //время окончания таймера
      this._timeEnd = moment().add(this.timer / 1000, 's');

      //запуск таймера в интервале
      this._intervalTimer = setInterval(this.updateTimer, 10);

      //вызов подписанных функций
      this._callbacksStartTimer.map(x => x());
   }

   /**
    * Остановка таймера на паузу, если запущен
    */
   public pauseTimer() {
      this.isTimerRunning = false;

      //останавливаем таймер
      clearInterval(this._intervalTimer);
   }

   /**
    * Остановка и очистка таймера
    */
   public clearTimer() {
      this.isTimerRunning = false;
      this.updateTimer();

      //останавливаем таймер
      clearInterval(this._intervalTimer);
   }

   /**
    * Окончание таймера
    */
   public endTimer() {
      this.isTimerRunning = false;
      this.clearTimer();

      //проигрывание звука
      if (this.isPlaySoundInEnd) {
         this._audio.play();
      }

      //показ уведомления
      if ("Notification" in window && this.settingsService.isOnPushNotification) {
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
   public updateTimer() {
      if (this.isTimerRunning) {
         //update
         this.timer = this._timeEnd.valueOf() - moment().valueOf();

         //end
         if (this.timer <= 0) {
            this.endTimer();
         }
      }
      else {
         //start
         this.timer = this.settingHours * 60 * 60 * 1000 +
            this.settingMinutes * 60 * 1000 +
            this.settingSeconds * 1000;
      }
   }

   public addCallbackStart(callback: Function) {
      this._callbacksStartTimer.push(callback);
   }
   public addCallbackEnd(callback: Function) {
      this._callbacksEndTimer.push(callback);
   }

   public openSeettingsPopup(){
      this.isOpenSeettings = true;
   }
   public closeSeettingsPopup(){
      this.isOpenSeettings = false;
   }


   private _getDefaultMinutes() : number{
      const localValue = localStorage.getItem('TimerService.settingMinutes');

      if(localValue === null){
         return 1; //default
      }

      return parseInt(localValue) || 0;
   }
}
