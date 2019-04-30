import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModelExerciseResult } from '../models/ModelExerciseResult';

@Injectable({
  providedIn: 'root'
})
export class ExerciseResultsService {

  private _exerciseResults = new BehaviorSubject<ModelExerciseResult[]>(this.loadExerciseResults()); //результаты всех упражнений
  private _exerciseCurrentResults = new BehaviorSubject<ModelExerciseResult>(this.loadExerciseCurrentResults()); //результаты текущего упражнения
  private _dateSave = new BehaviorSubject<number>(this.loadDateSave()); //время последнего изменения

  //для внешнего использования
  public exerciseResults$ = this._exerciseResults.asObservable();
  public exerciseCurrentResults$ = this._exerciseCurrentResults.asObservable();
  
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

  public set exerciseCurrentResults(newValue: ModelExerciseResult){
    localStorage.setItem('ExerciseResultsService.exerciseCurrentResults', JSON.stringify(newValue));
    this._exerciseCurrentResults.next(newValue);
  }
  public get exerciseCurrentResults(): ModelExerciseResult{
    return this._exerciseCurrentResults.getValue();
  }


  public getLastExerciseResults(exerciseTypeUid: string){
    if(!exerciseTypeUid){
      return null;
    }
    
    return this.exerciseResults.filter(x => x.type === exerciseTypeUid).last();
  }
  
  
  /** Загрузка результатов упражнений */
  private loadExerciseResults(): ModelExerciseResult[]{
    return JSON.parse(localStorage.getItem('ExerciseResultsService.exerciseResults') || '[]') || [];
  }
  /** Загрузка результатов упражнений */
  private loadDateSave(): number{
    return JSON.parse(localStorage.getItem('ExerciseResultsService.dateSave') || '0') || 0;
  }

  /** Загрузка результатов текущего упражнения */
  private loadExerciseCurrentResults(): ModelExerciseResult{
    return JSON.parse(localStorage.getItem('ExerciseResultsService.exerciseCurrentResults') || 'null') || null;
  }
}
