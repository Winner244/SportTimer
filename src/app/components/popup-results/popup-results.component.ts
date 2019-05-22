import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';
import { ModelExerciseResult } from 'src/app/models/ModelExerciseResult';
import * as moment from 'moment';
import { SettingsService } from 'src/app/services/settings.service';
import { ModelTypeExercise } from 'src/app/models/ModelTypeExercise';
import { Helper } from 'src/app/Helper';

@Component({
   selector: 'app-popup-results',
   templateUrl: './popup-results.component.html',
   styleUrls: ['./popup-results.component.less']
})
export class PopupResultsComponent implements OnDestroy {

   exerciseTypes: ModelTypeExercise[];
   isOpen: boolean;
   items: ModelExerciseResult[];

   private _destroyed: Subject<any> = new Subject();

   constructor(
      private exerciseResultsService: ExerciseResultsService,
      private settingsService: SettingsService) 
   { 
      this.items = [];

      this.settingsService.exerciseTypes$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => this.exerciseTypes = value);

      this.exerciseResultsService.isOpenPopupResults$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.isOpen = value;
            this.items = this.exerciseResultsService.exerciseResults;
         });
   }

   ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
   }

   onClose() {
      this.exerciseResultsService.closePopupResults();
   }

   public getItemDate(item: ModelExerciseResult) : string{
      return moment(item.date).format('DD.MM.YYYY hh:mm');
   }

   public getExerciseLabel(item: ModelExerciseResult) : string{
      return this.exerciseTypes.find(x => x.uid === item.type).name;
   }

   public getDuration(item: ModelExerciseResult) : string{
      if(item.results.length > 1){
         return Helper.betweenDate(item.results[0].timeStart, item.results.last().timeEnd);
      }

      return '';
   }

   public getSumCount(item: ModelExerciseResult) : number{
      return item.results.sum(x => x.count);
   }
   
   public getSumMass(item: ModelExerciseResult) : number{
      return item.results.sum(x => x.mass);
   }
}
