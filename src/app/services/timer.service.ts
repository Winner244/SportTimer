import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  
  private _timer = new BehaviorSubject<Date>(new Date(0, 0, 0)); //время в таймере
  private _settingHours = new BehaviorSubject<number>(0); //часы из настроек
  private _settingMinutes = new BehaviorSubject<number>(1); //минуты из настроек
  private _settingSeconds = new BehaviorSubject<number>(30); //секунды из настроек
  private _isPlaySoundInEnd = new BehaviorSubject<boolean>(true); //проигрывать звук при окончании таймера?

  public timer$ = this._timer.asObservable();
  public settingHours$ = this._settingHours.asObservable();
  public settingMinutes$ = this._settingMinutes.asObservable();
  public settingSeconds$ = this._settingSeconds.asObservable();
  public isPlaySoundInEnd$ = this._isPlaySoundInEnd.asObservable();

  constructor() { }

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
}
