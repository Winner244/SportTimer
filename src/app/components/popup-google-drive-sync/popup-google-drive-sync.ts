import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';
import { GoogleDriveService } from 'src/app/services/google-drive.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ModelExerciseResult } from 'src/app/models/ModelExerciseResult';
import { ModelTypeExercise } from 'src/app/models/ModelTypeExercise';
import * as moment from 'moment';
import { Helper } from 'src/app/helpers/Helper';

@Component({
   selector: 'app-popup-google-drive-sync',
   templateUrl: './popup-google-drive-sync.html',
   styleUrls: ['./popup-google-drive-sync.less']
})
export class PopupGoogleDriveSyncComponent implements OnDestroy {
   isOpen: boolean;

   googleDriveItems: ModelExerciseResult[];
   localItems: ModelExerciseResult[];

   localExerciseTypes: ModelTypeExercise[];
   googleDriveExerciseTypes: ModelTypeExercise[];

   localLastDateSave: string;
   googleDriveLastDateSave: string;

   googleDriveEmail: string;
   isWaitGoogleDrive: boolean;

   private _destroyed: Subject<any> = new Subject();

   constructor(
      private exerciseResultsService: ExerciseResultsService,
      private googleDriveService: GoogleDriveService, 
      private settingsService: SettingsService) 
   { 
      this.googleDriveItems = [];
      this.localItems = [];
      this.localExerciseTypes = [];
      this.googleDriveExerciseTypes = [];
      this.localLastDateSave = ''
      this.googleDriveLastDateSave = ''

      this.settingsService.exerciseTypes$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => this.localExerciseTypes = value);

      this.exerciseResultsService.exerciseResults$
         .pipe(takeUntil(this._destroyed))
         .subscribe(newItems => {
            this.localItems = [].concat(newItems);
            this.localItems = this.localItems.sortByField(x => x.date).reverse();
            this.localLastDateSave = moment(this.exerciseResultsService.dateSave).format('DD.MM.YYYY hh:mm');
         });

      this.googleDriveService.googleDriveFile$
         .pipe(takeUntil(this._destroyed))
         .subscribe(fileData => {
            if(fileData){
               this.googleDriveItems = [].concat(fileData.data);
               this.googleDriveItems = this.googleDriveItems.sortByField(x => x.date).reverse();
               this.googleDriveExerciseTypes = fileData.exerciseTypes;
               this.googleDriveLastDateSave = moment(fileData.dateSave).format('DD.MM.YYYY hh:mm');
            }
            else{
               this.googleDriveItems = [];
               this.googleDriveExerciseTypes = [];
               this.googleDriveLastDateSave = '';
            }
         });

      this.googleDriveService.googleUser$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => this.googleDriveEmail = value ? value.email : '');

      this.googleDriveService.isOpenedPopupSyncAction$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.isOpen = value;
         });
   }

   ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
   }

   onClose() {
      this.googleDriveService.closePopupGoogleDriveSync();
   }

   disconnectGoogleDrive() {
      this.isWaitGoogleDrive = true;
      this.googleDriveService.disconnectDrive()
         .then(() => {
            this.isWaitGoogleDrive = false;
            this.googleDriveService.closePopupGoogleDriveSync();
         })
         .catch(() => this.isWaitGoogleDrive = false);
   }

   public getItemDate(item: ModelExerciseResult) : string{
      return moment(item.date).format('DD.MM.' + (window.innerWidth > 340 ? 'YYYY' : 'YYг') + (window.innerWidth > 1150 ? ' hh:mm' : ''));
   }

   public getExerciseLocalLabel(item: ModelExerciseResult) : string{
      var type = this.localExerciseTypes.find(x => x.uid === item.type);
      return type ? type.name : item.type;
   }

   public getExerciseGoogleDriveLabel(item: ModelExerciseResult) : string{
      var type = this.googleDriveExerciseTypes.find(x => x.uid === item.type);
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
}
