import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Helper } from '../Helper';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _isOpen = new BehaviorSubject<boolean>(false); //окно открыто?
  private _isDisplayOldResults = new BehaviorSubject<boolean>(true); //показывать предыдущие результаты?
  private _exerciseTypes = new BehaviorSubject<string[]>(this.loadExerciseTypes()); //типы упражнений

  //для внешнего использования
  public isOpen$ = this._isOpen.asObservable();
  public isDisplayOldResults$ = this._isDisplayOldResults.asObservable();
  public exerciseTypes$ = this._exerciseTypes.asObservable();
  
  public isOnPushNotification: boolean;

  constructor() { }

  //set/get
  public set isOpen(newValue: boolean){
    this._isOpen.next(newValue);
  }
  public get isOpen(): boolean{
    return this._isOpen.getValue();
  }

  public set isDisplayOldResults(newValue: boolean){
    this._isDisplayOldResults.next(newValue);
  }
  public get isDisplayOldResults(): boolean{
    return this._isDisplayOldResults.getValue();
  }

  public set exerciseTypes(newValue: string[]){
    const sortValue = Helper.clone(newValue).sort();
    this._exerciseTypes.next(sortValue);
    localStorage.setItem('SettingsService.exerciseTypes', JSON.stringify(sortValue));
  }
  public get exerciseTypes(): string[]{
    return this._exerciseTypes.getValue();
  }

  
  /**
   * Загрузка типов упражнений или возврат default значения
   */
  private loadExerciseTypes(): string[]{
    return JSON.parse(localStorage.getItem('SettingsService.exerciseTypes') || 'null') || 
      [
        'Упражнение1',
        'Упражнение2',
      ];
  }
}
