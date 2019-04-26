import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Helper } from '../Helper';
import { ModelTypeExercise } from '../models/ModelTypeExercise';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private _isOpen = new BehaviorSubject<boolean>(false); //окно открыто?
  private _isDisplayOldResults = new BehaviorSubject<boolean>(true); //показывать предыдущие результаты?
  private _exerciseTypes = new BehaviorSubject<ModelTypeExercise[]>(this._loadExerciseTypes()); //типы упражнений
  private _exerciseTypeUidSelected = new BehaviorSubject<string>(this._loadExerciseTypeSelected()); //выбранное упражнение в UI

  //для внешнего использования
  public isOpen$ = this._isOpen.asObservable();
  public isDisplayOldResults$ = this._isDisplayOldResults.asObservable();
  public exerciseTypes$ = this._exerciseTypes.asObservable();
  public exerciseTypeUidSelected$ = this._exerciseTypeUidSelected.asObservable();
  
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

  public set exerciseTypes(newValue: ModelTypeExercise[]){
    const sortValue = Helper.clone(newValue).sort();
    this._exerciseTypes.next(sortValue);
    localStorage.setItem('SettingsService.exerciseTypes', JSON.stringify(sortValue));
  }
  public get exerciseTypes(): ModelTypeExercise[]{
    return this._exerciseTypes.getValue();
  }

  public set exerciseTypeUidSelected(newValue: string){
    this._exerciseTypeUidSelected.next(newValue);
    localStorage.setItem('SettingsService.exerciseTypeUidSelected', JSON.stringify(newValue));
  }
  public get exerciseTypeUidSelected(): string{
    return this._exerciseTypeUidSelected.getValue();
  }
  
  /**
   * Загрузка типов упражнений или возврат default значения
   */
  private _loadExerciseTypes(): ModelTypeExercise[]{
    return JSON.parse(localStorage.getItem('SettingsService.exerciseTypes') || 'null') || 
      [
        new ModelTypeExercise('Упражнение1'),
        new ModelTypeExercise('Упражнение2')
      ];
  }

  /**
   * Загрузка выбранного упражнения в UI
   */
  private _loadExerciseTypeSelected(): string{
    return JSON.parse(localStorage.getItem('SettingsService.exerciseTypeUidSelected') || 'null') || '';
  }
}
