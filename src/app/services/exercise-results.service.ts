import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModelExerciseResult } from '../models/ModelExerciseResult';

@Injectable({
  providedIn: 'root'
})
export class ExerciseResultsService {

  private _exerciseResults = new BehaviorSubject<ModelExerciseResult[]>(this.loadExerciseResults()); //типы упражнений
  private _dateSave = new BehaviorSubject<Date|null>(this.loadDateSave()); //время последнего изменения

  //для внешнего использования
  public exerciseResults$ = this._exerciseResults.asObservable();
  
  constructor() { }

  //set/get
  public set exerciseResults(newValue: ModelExerciseResult[]){
    this._exerciseResults.next(newValue);
  }
  public get exerciseResults(): ModelExerciseResult[]{
    return this._exerciseResults.getValue();
  }

  public set dateSave(newValue: Date){
    this._dateSave.next(newValue);
  }
  public get dateSave(): Date{
    return this._dateSave.getValue();
  }
  
  /**
   * Загрузка результатов упражнений
   */
  private loadExerciseResults(): ModelExerciseResult[]{
    return JSON.parse(localStorage.getItem('ExerciseResultsService.exerciseResults') || '[]') || [];
  }
  /**
   * Загрузка результатов упражнений
   */
  private loadDateSave(): Date|null{
    return JSON.parse(localStorage.getItem('ExerciseResultsService.dateSave') || 'null') || null;
  }
}
