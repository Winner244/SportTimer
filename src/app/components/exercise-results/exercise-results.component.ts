import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';
import { ModelExerciseResult } from 'src/app/models/ModelExerciseResult';
import { Helper } from 'src/app/Helper';

@Component({
   selector: 'app-exercise-results',
   templateUrl: './exercise-results.component.html',
   styleUrls: ['./exercise-results.component.less']
})
export class ExerciseResultsComponent implements OnDestroy, OnInit {
   exerciseLastResults: ModelExerciseResult;
   exerciseCurrentResultOldCountSumAndMass: number;
   exerciseCurrentResultsOld: number;
   exerciseCurrentResult: ModelExerciseResult;
   windowWidth: number;

   private _destroyed: Subject<any> = new Subject();

   @ViewChild('tablesBox') tablesBoxElement: ElementRef;


   constructor(private exerciseResultsService: ExerciseResultsService) {
      this.exerciseCurrentResultOldCountSumAndMass = 0;
      this.exerciseCurrentResultsOld = 0;
   }

   ngOnInit() {
      //подписка на изменение упражнений (добавился новый)
      this.exerciseResultsService.exerciseResults$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.exerciseLastResults = this.exerciseResultsService.getLastExerciseResults(this.exerciseResultsService.exerciseTypeUidSelected);
            this.resizeTablesBox();
         });

      //подписка на изменение выбранного упражнения
      this.exerciseResultsService.exerciseTypeUidSelected$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.exerciseLastResults = this.exerciseResultsService.getLastExerciseResults(value);
            this.resizeTablesBox();
         });

      //подписка на изменение текущего упражнения (добился новый подход в упражнении)
      this.exerciseResultsService.exerciseCurrentResult$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            if(this.exerciseCurrentResult && this.exerciseCurrentResult.results){
               this.exerciseCurrentResultOldCountSumAndMass = this.exerciseCurrentResult.results.sum(x => x.count + x.mass);
               this.exerciseCurrentResultsOld = this.exerciseCurrentResult.results.length;
            }

            if(this.exerciseCurrentResultsOld != value.results.length){
               this.focusOnLastInputCount();
            }

            this.exerciseCurrentResult = Helper.clone(value);
            this.resizeTablesBox();
         });
      
      this.onResize();
   }

   ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
   }

   focusOnLastInputCount() {
      setTimeout(() => {
         document.getElementsByClassName('exercise-results__table-results')
         const inputs = document.getElementsByClassName('exercise-results-table__input-count');
         if(inputs.length){
            const lastInput = inputs[inputs.length - 1];
            const isDisabled = Object.values(lastInput.attributes).map(x => x.localName).indexOf('disabled') > -1;
            if(!isDisabled){
               (<any>lastInput).select();
            }
         }
      }, 100);
   }

   changeModelTable() {
      if(this.exerciseCurrentResultOldCountSumAndMass !== this.exerciseCurrentResult.results.sum(x => x.count + x.mass)){
         this.exerciseResultsService.exerciseCurrentResult = this.exerciseCurrentResult;
      }
   }

   /** высота контейнера таблиц должна быть такой же как самая большая таблица в ней. 
    * Это нужна для footer-а и что бы другой контент не наезжал на таблицу прошлых результатов */
   resizeTablesBox(){
      setTimeout(() => {
         const tableOld : any = document.getElementsByClassName('exercise-results__table-results-old')[0].children[0];
         const tableCurrent : any = document.getElementsByClassName('exercise-results__table-results')[0].children[0];
         const heightTables = Math.max(tableOld.offsetHeight, tableCurrent.offsetHeight);
         this.tablesBoxElement.nativeElement.style.height = heightTables + 'px';
      }, 100);
   }

   public onResize(){
      this.windowWidth = window.innerWidth;
   }
}
