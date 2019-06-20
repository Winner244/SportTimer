import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';
import { ModelExerciseResult } from 'src/app/models/ModelExerciseResult';
import * as moment from 'moment';
import { SettingsService } from 'src/app/services/settings.service';
import { ModelTypeExercise } from 'src/app/models/ModelTypeExercise';
import { Helper } from 'src/app/helpers/Helper';
import { faInfo, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
   selector: 'app-popup-results',
   templateUrl: './popup-results.component.html',
   styleUrls: ['./popup-results.component.less']
})
export class PopupResultsComponent implements OnDestroy {
   faInfo = faInfo;
   faTrash = faTrash;

   exerciseTypes: ModelTypeExercise[];
   selectedExerciseTypeUid: string;
   isOpen: boolean;
   items: ModelExerciseResult[];
   filtereditems: ModelExerciseResult[];
   selectedRow: number;

   private _destroyed: Subject<any> = new Subject();

   constructor(
      private exerciseResultsService: ExerciseResultsService,
      private settingsService: SettingsService) 
   { 
      this.items = [];
      this.selectedRow = -1;

      this.settingsService.exerciseTypes$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => this.exerciseTypes = value);

      this.exerciseResultsService.exerciseResults$
         .pipe(takeUntil(this._destroyed))
         .subscribe(newItems => {
            this.items = [].concat(newItems);
            this.items = this.items.sortByField(x => x.date).reverse();
            this.filter();
         });

      this.exerciseResultsService.isOpenPopupResults$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.selectedExerciseTypeUid = '';
            this.isOpen = value;
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
      return moment(item.date).format('DD.MM.' + (window.innerWidth > 340 ? 'YYYY' : 'YYг') + (window.innerWidth > 1150 ? ' hh:mm' : ''));
   }

   public getExerciseLabel(item: ModelExerciseResult) : string{
      var type = this.exerciseTypes.find(x => x.uid === item.type);
      return type ? type.name : item.type;
   }

   public getDuration(item: ModelExerciseResult) : string{
      if(item.results.length > 1){
         return Helper.betweenDate(item.results[0].timeStart, item.results.last().timeEnd, false);
      }

      return '';
   }

   public getSumCount(item: ModelExerciseResult) : number{
      return item.results.sum(x => x.count);
   }
   
   public getSumMass(item: ModelExerciseResult) : number{
      return item.results.sum(x => x.mass);
   }

   public remove(item: ModelExerciseResult){
      if(confirm('Вы действительно хотите удалить элемент?')){
         this.exerciseResultsService.removeResult(item);
         this.selectedRow = -1;
      }
   }

   public info(item: ModelExerciseResult){
      this.exerciseResultsService.openPopupResultInfo(item);
   }

   public onSelectTypeExercise(exerciseTypeUid: string){
      this.selectedExerciseTypeUid = exerciseTypeUid; 
      this.filter();
   }

   filter(){
      this.filtereditems = this.selectedExerciseTypeUid
         ? this.items.filter(x => x.type === this.selectedExerciseTypeUid)
         : this.filtereditems = [].concat(this.items);
   }
}
