import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModelExerciseResult } from '../models/ModelExerciseResult';

@Injectable({
  providedIn: 'root'
})
export class ExerciseResultsService {

  private _exerciseResults = new BehaviorSubject<ModelExerciseResult[]>(this.loadExerciseResults()); //типы упражнений
  private _dateSave = new BehaviorSubject<number>(this.loadDateSave()); //время последнего изменения

  //для внешнего использования
  public exerciseResults$ = this._exerciseResults.asObservable();
  
  constructor() { }

  //set/get
  public set exerciseResults(newValue: ModelExerciseResult[]){
    localStorage.setItem('ExerciseResultsService.exerciseResults', JSON.stringify(newValue));
    this._exerciseResults.next(newValue);
  }
  public get exerciseResults(): ModelExerciseResult[]{
    return this._exerciseResults.getValue();
  }

  public set dateSave(newValue: number){
    localStorage.setItem('ExerciseResultsService.dateSave', newValue + '');
    this._dateSave.next(newValue);
  }
  public get dateSave(): number{
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
  private loadDateSave(): number{
    return JSON.parse(localStorage.getItem('ExerciseResultsService.dateSave') || '0') || 0;
  }
}
