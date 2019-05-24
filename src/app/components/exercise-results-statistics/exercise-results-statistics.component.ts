import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import * as moment from 'moment';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';

@Component({
   selector: 'app-exercise-results-statistics',
   templateUrl: './exercise-results-statistics.component.html',
   styleUrls: ['./exercise-results-statistics.component.less']
})
export class ExerciseResultsStatisticsComponent implements OnDestroy {
   exerciseTypeUidSelected: string;

   exerciseLastResultCount: number;
   exerciseLastResultMass: number;
   exerciseLastResultDate: number;

   exerciseCurrentResultCount: number;
   exerciseCurrentResultMass: number;
   exerciseCurrentResultDate: number;
   exerciseCurrentResults: number;

   private _destroyed: Subject<any> = new Subject();

   constructor(private exerciseResultsService: ExerciseResultsService) {
      this.exerciseLastResultCount =
         this.exerciseLastResultMass =
         this.exerciseLastResultDate =
         this.exerciseCurrentResultCount =
         this.exerciseCurrentResultMass =
         this.exerciseCurrentResultDate = 0;

      this.exerciseResultsService.exerciseTypeUidSelected$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.exerciseTypeUidSelected = value;
            const exerciseLastResult = this.exerciseResultsService.getLastExerciseResults(this.exerciseTypeUidSelected);

            if (exerciseLastResult && exerciseLastResult.results) {
               this.exerciseLastResultCount = exerciseLastResult.results.sum(x => x.count);
               this.exerciseLastResultMass = exerciseLastResult.results.sum(x => x.mass);
               this.exerciseLastResultDate = exerciseLastResult.date;
            }
            else {
               this.exerciseLastResultCount = 0;
               this.exerciseLastResultMass = 0;
               this.exerciseLastResultDate = 0;
            }
         });

      this.exerciseResultsService.exerciseCurrentResult$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.exerciseCurrentResultCount = value.results.sum(x => x.count);
            this.exerciseCurrentResultMass = value.results.sum(x => x.mass);
            this.exerciseCurrentResultDate = value.date;
            this.exerciseCurrentResults = value.results.length;
         });
   }

   ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
   }

   getDateStartCurrent(): string {
      return this.exerciseCurrentResultDate && this.exerciseCurrentResults
         ? moment(this.exerciseCurrentResultDate).format('DD MMMM HH:mm')
         : '-';
   }

   getDateLast(): string {
      return moment(this.exerciseLastResultDate).format('DD MMMM');
   }
}
