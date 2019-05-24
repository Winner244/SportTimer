import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModelExerciseResult } from '../models/ModelExerciseResult';
import { ModelExerciseResultItem } from '../models/ModelExerciseResultItem';
import { TimerService } from './timer.service';

@Injectable({
   providedIn: 'root'
})
export class ExerciseResultsService {

   private _exerciseResults = new BehaviorSubject<ModelExerciseResult[]>(this._loadExerciseResults()); //результаты всех упражнений
   private _exerciseCurrentResult = new BehaviorSubject<ModelExerciseResult>(this._loadExerciseCurrentResults()); //результаты текущего упражнения
   private _dateSave = new BehaviorSubject<number>(this._loadDateSave()); //время последнего изменения
   private _exerciseTypeUidSelected = new BehaviorSubject<string>(this._loadExerciseTypeSelected()); //выбранное упражнение в UI

   private _isOpenPopupChart = new BehaviorSubject<boolean>(false); //окно с графиком открыто?
   private _isOpenPopupResults = new BehaviorSubject<boolean>(false); //окно с результатами открыто?
   private _isOpenPopupResultInfo = new BehaviorSubject<boolean>(false); //окно с информацией по результату открыто?

   //для внешнего использования
   public exerciseResults$ = this._exerciseResults.asObservable();
   public exerciseCurrentResult$ = this._exerciseCurrentResult.asObservable();
   public exerciseTypeUidSelected$ = this._exerciseTypeUidSelected.asObservable();
   public isOpenPopupChart$ = this._isOpenPopupChart.asObservable();
   public isOpenPopupResults$ = this._isOpenPopupResults.asObservable();
   public isOpenPopupResultInfo$ = this._isOpenPopupResultInfo.asObservable();

   public popupResultInfoItem: ModelExerciseResult;

   constructor(private timerService: TimerService) {

      this.exerciseTypeUidSelected$.subscribe(value => {
         const result = this.exerciseCurrentResult;
         result.type = value;
         this.exerciseCurrentResult = result;
      });

      this.addCurrentResultItem = this.addCurrentResultItem.bind(this);

      //добавляем вызов функции addCurrentResultItem на окончание таймера
      this.timerService.addCallbackEnd(this.addCurrentResultItem);
   }

   //set/get
   public set exerciseResults(newValue: ModelExerciseResult[]) {
      localStorage.setItem('ExerciseResultsService.exerciseResults', JSON.stringify(newValue));
      this._exerciseResults.next(newValue);
   }
   public get exerciseResults(): ModelExerciseResult[] {
      return this._exerciseResults.getValue();
   }

   public set dateSave(newValue: number) {
      localStorage.setItem('ExerciseResultsService.dateSave', newValue + '');
      this._dateSave.next(newValue);
   }
   public get dateSave(): number {
      return this._dateSave.getValue();
   }

   public set exerciseCurrentResult(newValue: ModelExerciseResult) {
      if(newValue.results && newValue.results.last()){
         newValue.results.last().timeEnd = Date.now();
      }
      localStorage.setItem('ExerciseResultsService.exerciseCurrentResult', JSON.stringify(newValue));
      this._exerciseCurrentResult.next(newValue);
   }
   public get exerciseCurrentResult(): ModelExerciseResult {
      return this._exerciseCurrentResult.getValue();
   }

   public set exerciseTypeUidSelected(newValue: string) {
      this._exerciseTypeUidSelected.next(newValue);
      localStorage.setItem('SettingsService.exerciseTypeUidSelected', JSON.stringify(newValue));
   }
   public get exerciseTypeUidSelected(): string {
      return this._exerciseTypeUidSelected.getValue();
   }
   
   private set isOpenPopupChart(newValue: boolean) {
      this._isOpenPopupChart.next(newValue);
   }
   private get isOpenPopupChart(): boolean {
      return this._isOpenPopupChart.getValue();
   }

   private set isOpenPopupResults(newValue: boolean) {
      this._isOpenPopupResults.next(newValue);
   }
   private get isOpenPopupResults(): boolean {
      return this._isOpenPopupResults.getValue();
   }

   private set isOpenPopupResultInfo(newValue: boolean) {
      this._isOpenPopupResultInfo.next(newValue);
   }
   private get isOpenPopupResultInfo(): boolean {
      return this._isOpenPopupResultInfo.getValue();
   }

   /** Возвращает все результаты упражнений с выбранным типом */
   public getTypeSelectedExerciseResults() : ModelExerciseResult[]{
      return this.exerciseResults.filter(x => x.type === this.exerciseTypeUidSelected);
   }


   public getLastExerciseResults(exerciseTypeUid: string) : ModelExerciseResult | null {
      if (!exerciseTypeUid) {
         return null;
      }

      return this.exerciseResults.filter(x => x.type === exerciseTypeUid).last();
   }

   public addCurrentResultItem() {
      const currentResult = this.exerciseCurrentResult;

      let oldMass = 0;
      if (currentResult.results.length) {
         //время окончания подхода
         currentResult.results.last().timeEnd = Date.now();
         //копирование предыдущей массы
         oldMass = currentResult.results.last().mass;
      }
      else{
         currentResult.date = Date.now();
      }

      //добавление нового подхода
      currentResult.results.push(new ModelExerciseResultItem());
      currentResult.results.last().mass = oldMass;
      this.exerciseCurrentResult = currentResult;
   }

   public clearCurrentResult() {
      this.exerciseCurrentResult = new ModelExerciseResult(this.exerciseTypeUidSelected);
   }

   public saveCurrentResult() {
      const results = this.exerciseResults;
      results.push(this.exerciseCurrentResult);
      this.exerciseResults = results;
   }
   

   public openPopupChart(){
      this.isOpenPopupChart = true;
   }
   public closePopupChart(){
      this.isOpenPopupChart = false;
   }

   public openPopupResults(){
      this.isOpenPopupResults = true;
   }
   public closePopupResults(){
      this.isOpenPopupResults = false;
   }

   public openPopupResultInfo(item: ModelExerciseResult){
      this.popupResultInfoItem = item;
      this.isOpenPopupResultInfo = true;
   }
   public closePopupResultInfo(){
      this.isOpenPopupResultInfo = false;
   }


   public removeResult(item: ModelExerciseResult){
      var results = this.exerciseResults;
      var indexRemove = results.findIndex(x => x.date === item.date);
      results.splice(indexRemove, 1);
      this.exerciseResults = results;
   }

   /** Загрузка результатов упражнений */
   private _loadExerciseResults(): ModelExerciseResult[] {
      return JSON.parse(localStorage.getItem('ExerciseResultsService.exerciseResults') || '[]') || [];
   }
   /** Загрузка результатов упражнений */
   private _loadDateSave(): number {
      return JSON.parse(localStorage.getItem('ExerciseResultsService.dateSave') || '0') || 0;
   }

   /** Загрузка результатов текущего упражнения */
   private _loadExerciseCurrentResults(): ModelExerciseResult {
      return JSON.parse(localStorage.getItem('ExerciseResultsService.exerciseCurrentResult') || 'null') || new ModelExerciseResult('');
   }

   /** Загрузка выбранного упражнения в UI */
   private _loadExerciseTypeSelected(): string {
      return JSON.parse(localStorage.getItem('SettingsService.exerciseTypeUidSelected') || 'null') || '';
   }
}
