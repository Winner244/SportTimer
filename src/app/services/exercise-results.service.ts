import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModelExerciseResult } from '../models/ModelExerciseResult';
import { ModelExerciseResultItem } from '../models/ModelExerciseResultItem';

@Injectable({
  providedIn: 'root'
})
export class ExerciseResultsService {

  private _exerciseResults = new BehaviorSubject<ModelExerciseResult[]>(this._loadExerciseResults()); //результаты всех упражнений
  private _exerciseCurrentResult = new BehaviorSubject<ModelExerciseResult>(this._loadExerciseCurrentResults()); //результаты текущего упражнения
  private _dateSave = new BehaviorSubject<number>(this._loadDateSave()); //время последнего изменения
  private _exerciseTypeUidSelected = new BehaviorSubject<string>(this._loadExerciseTypeSelected()); //выбранное упражнение в UI

  //для внешнего использования
  public exerciseResults$ = this._exerciseResults.asObservable();
  public exerciseCurrentResult$ = this._exerciseCurrentResult.asObservable();
  public exerciseTypeUidSelected$ = this._exerciseTypeUidSelected.asObservable();
  
  constructor() { 
    this.exerciseTypeUidSelected$.subscribe(value => {
      const result = this.exerciseCurrentResult;
      result.type = value;
      this.exerciseCurrentResult = result;
    });
  }

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

  public set exerciseCurrentResult(newValue: ModelExerciseResult){
    localStorage.setItem('ExerciseResultsService.exerciseCurrentResult', JSON.stringify(newValue));
    this._exerciseCurrentResult.next(newValue);
  }
  public get exerciseCurrentResult(): ModelExerciseResult{
    return this._exerciseCurrentResult.getValue();
  }

  public set exerciseTypeUidSelected(newValue: string){
    this._exerciseTypeUidSelected.next(newValue);
    localStorage.setItem('SettingsService.exerciseTypeUidSelected', JSON.stringify(newValue));
  }
  public get exerciseTypeUidSelected(): string{
    return this._exerciseTypeUidSelected.getValue();
  }


  public getLastExerciseResults(exerciseTypeUid: string){
    if(!exerciseTypeUid){
      return null;
    }
    
    return this.exerciseResults.filter(x => x.type === exerciseTypeUid).last();
  }

  public addCurrentResultItem(){
    const currentResult = this.exerciseCurrentResult;
    currentResult.results.push(new ModelExerciseResultItem());
    this.exerciseCurrentResult = currentResult;
  }
  
  public clearCurrentResult(){
    this.exerciseCurrentResult = new ModelExerciseResult(this.exerciseTypeUidSelected);
  }

  public saveCurrentResult(){
    const results = this.exerciseResults;
    results.push(this.exerciseCurrentResult);
    this.exerciseResults = results;
  }
  
  /** Загрузка результатов упражнений */
  private _loadExerciseResults(): ModelExerciseResult[]{
    return JSON.parse(localStorage.getItem('ExerciseResultsService.exerciseResults') || '[]') || [];
  }
  /** Загрузка результатов упражнений */
  private _loadDateSave(): number{
    return JSON.parse(localStorage.getItem('ExerciseResultsService.dateSave') || '0') || 0;
  }

  /** Загрузка результатов текущего упражнения */
  private _loadExerciseCurrentResults(): ModelExerciseResult{
    return JSON.parse(localStorage.getItem('ExerciseResultsService.exerciseCurrentResult') || 'null') || new ModelExerciseResult('');
  }

  /** Загрузка выбранного упражнения в UI */
  private _loadExerciseTypeSelected(): string{
    return JSON.parse(localStorage.getItem('SettingsService.exerciseTypeUidSelected') || 'null') || '';
  }
}
