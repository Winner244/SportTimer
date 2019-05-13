import { Component, OnDestroy } from '@angular/core';
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
export class ExerciseResultsComponent implements OnDestroy {
   exerciseLastResults: ModelExerciseResult;
   exerciseCurrentResultOldCountSumAndMass: number;
   exerciseCurrentResultsOld: number;
   exerciseCurrentResult: ModelExerciseResult;

   private _destroyed: Subject<any> = new Subject();

   constructor(private exerciseResultsService: ExerciseResultsService) {
      this.exerciseCurrentResultOldCountSumAndMass = 0;
      this.exerciseCurrentResultsOld = 0;

      this.exerciseResultsService.exerciseResults$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => this.exerciseLastResults = this.exerciseResultsService.getLastExerciseResults(this.exerciseResultsService.exerciseTypeUidSelected));

      this.exerciseResultsService.exerciseTypeUidSelected$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => this.exerciseLastResults = this.exerciseResultsService.getLastExerciseResults(value));

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
         });
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
}
