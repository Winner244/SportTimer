import { Component, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SettingsService } from 'src/app/services/settings.service';
import { ModelTypeExercise } from '../../models/ModelTypeExercise';
import { GoogleDriveService } from 'src/app/services/google-drive.service';
import { ExerciseResultsService } from 'src/app/services/exercise-results.service';

@Component({
   selector: 'app-popup-settings',
   templateUrl: './popup-settings.component.html',
   styleUrls: ['./popup-settings.component.less']
})
export class PopupSettingsComponent implements OnDestroy {
   faTimes = faTimes;

   @ViewChild('listExercises') listExercisesElement: ElementRef;

   isOpen: boolean;
   isDisplayOldResults: boolean;
   isOnPushNotification: boolean;
   googleDriveEmail: string;
   exerciseTypes: ModelTypeExercise[];
   heightList: string;
   countResults: number;

   private _destroyed: Subject<any> = new Subject();

   constructor(
      private settingsService: SettingsService,
      private googleDriveService: GoogleDriveService,
      private exerciseResultsService: ExerciseResultsService,
      private ngzone: NgZone) 
   {
      this.onResize = this.onResize.bind(this);
      this.settingsService.isOpen$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.isOpen = value;
            if (value) {
               setTimeout(this.onResize, 100);
               this.isOnPushNotification = this.settingsService.isOnPushNotification;
               this.isDisplayOldResults = this.settingsService.isDisplayOldResults;
               this.exerciseTypes = this.settingsService.exerciseTypes;
               this.countResults = this.exerciseResultsService.exerciseResults.length;
            }
         });

      this.settingsService.exerciseTypes$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => {
            this.ngzone.run(() => this.exerciseTypes = value);
         });

      this.googleDriveService.googleUser$
         .pipe(takeUntil(this._destroyed))
         .subscribe(value => this.googleDriveEmail = value ? value.email : '');
   }

   ngOnDestroy() {
      this._destroyed.next();
      this._destroyed.complete();
   }

   onClose() {
      this.settingsService.closePopup();
   }

   toggleDisplayOldResults() {
      this.isDisplayOldResults = !this.isDisplayOldResults;
      this.settingsService.isDisplayOldResults = this.isDisplayOldResults;
   }

   toggleOnPushNotification() {
      this.isOnPushNotification = !this.isOnPushNotification;
      this.settingsService.isOnPushNotification = this.isOnPushNotification;
   }

   blurExerciseType() {
      this.settingsService.exerciseTypes = this.exerciseTypes;
   }

   removeExerciseType(index: number) {
      var type = this.exerciseTypes[index];
      var message = 'Вы действительно хотите удалить тип "' + type.name + '"';
      var countExercises = this.getCountExercisesByType(type);
      if(countExercises){
         message += ' и ' + countExercises + ' упражнений этого типа';
      }
      message += '?';

      if(confirm(message)){
         this.exerciseTypes.splice(index, 1);
         this.settingsService.exerciseTypes = this.exerciseTypes;

         //удаление результатов данного типа
         this.exerciseResultsService.exerciseResults = this.exerciseResultsService.exerciseResults.filter(x => x.type !== type.uid);
      }
   }

   addExercise() {
      const newName = 'Новое упражнение';
      let countCoincidences = 0;
      do {
         countCoincidences++;
      } while (this.exerciseTypes.find(x => x.name == newName + countCoincidences));

      this.exerciseTypes.push(new ModelTypeExercise(newName + countCoincidences));
      this.settingsService.exerciseTypes = this.exerciseTypes;

      //scroll to bottom
      setTimeout(() => {
         const box = document.getElementsByClassName('popup-settings__list-exercises')[0];
         box.scrollTo(0, box.scrollHeight);
      }, 100);
   }

   connectGoogleDrive() {
      this.googleDriveService.connectDrive();
   }

   disconnectGoogleDrive() {
      this.googleDriveService.disconnectDrive();
   }

   getCountExercisesByType(exerciseType: ModelTypeExercise) {
      return this.exerciseResultsService.exerciseResults.filter(x => x.type == exerciseType.uid).length;
   }

   /** для починки ngModel внутри ngFor (устсраняет баг ангуляра) */
   trackByIndex(index: number): any {
      return index;
   }

   clearAllExcercises(){
      const message = this.googleDriveEmail 
         ? 'Будут удалены и локальные результаты и результаты этого приложения на Google диске, ' + 
            'если хотите удалить только локальные результаты, то отключите Google диск. Удалить все результаты?' 
         : 'Вы действительно хотите удалить все локальные результаты?';

      if(confirm(message)){
         this.exerciseResultsService.exerciseResults = [];
         this.exerciseResultsService.dateSave = 0; //удалённые данные не имеют силы на перезатирание данных в Google Drive
      }
   }

   public onResize() {
      this.heightList = 500 - this.listExercisesElement.nativeElement.offsetTop - 80 + 'px';
   }
}
