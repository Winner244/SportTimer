import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';
import { ModelExerciseResult } from 'src/app/models/ModelExerciseResult';
import { ModelExerciseResultItem } from 'src/app/models/ModelExerciseResultItem';
import { Helper } from 'src/app/Helper';
import * as moment from 'moment';
import { SettingsService } from 'src/app/services/settings.service';
import { ModelTypeExercise } from 'src/app/models/ModelTypeExercise';

@Component({
   selector: 'app-popup-result-info',
   templateUrl: './popup-result-info.component.html',
   styleUrls: ['./popup-result-info.component.less']
})
export class PopupResultInfoComponent implements OnDestroy {

   exerciseTypes: ModelTypeExercise[];
   isOpen: boolean;
   item: ModelExerciseResult;

   private _destroyed: Subject<any> = new Subject();

   constructor(
      private exerciseResultsService: ExerciseResultsService,
      private settingsService: SettingsService) 
   {
      this.settingsService.exerciseTypes$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => this.exerciseTypes = value);

      this.exerciseResultsService.isOpenPopupResultInfo$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.isOpen = value;
            this.item = this.exerciseResultsService.popupResultInfoItem;
            if(value){
               console.log('PopupResultInfoComponent this.item', this.item);
            }
         });
   }

   ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
   }


   onClose() {
      this.exerciseResultsService.closePopupResultInfo();
   }

   public getTimeDurationResult(result: ModelExerciseResultItem) : string{
      return result.timeStart && result.timeEnd ? Helper.betweenDate(result.timeStart, result.timeEnd) : '';
   }

   public getItemDate() : string{
      return moment(this.item.date).format('DD.MM.YYYY hh:mm');
   }
   public getExerciseLabel() : string{
      return this.exerciseTypes.find(x => x.uid === this.item.type).name;
   }
   public getTimeDuration() : string{
      return Helper.betweenDate(this.item.results[0].timeStart, this.item.results.last().timeEnd);
   }
   public getSumCount() : number{
      return this.item.results.sum(x => x.count);
   }
   public getSumMass() : number{
      return this.item.results.sum(x => x.mass);
   }
}
