import { Component, OnDestroy } from '@angular/core';
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

  isOpen: boolean;
  isDisplayOldResults: boolean;
  isOnPushNotification: boolean;
  googleDriveEmail: string;
  exerciseTypes: ModelTypeExercise[];

  private _destroyed: Subject<any> = new Subject();

  constructor(
    private settingsService: SettingsService, 
    private googleDriveService: GoogleDriveService,
    private exerciseResultsService: ExerciseResultsService) { 

    this.settingsService.isOpen$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => {
        this.isOpen = value;
        if(value){
          this.isOnPushNotification = this.settingsService.isOnPushNotification;
          this.isDisplayOldResults = this.settingsService.isDisplayOldResults;
          this.exerciseTypes = this.settingsService.exerciseTypes;
        }
      });

    this.googleDriveService.googleUser$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.googleDriveEmail = value ? value.email : '');
  }

  ngOnDestroy(){
    this._destroyed.next();
    this._destroyed.complete();
  }

  onClose(){
    this.settingsService.isOpen = false;
  }

  toggleDisplayOldResults(){
    this.isDisplayOldResults = !this.isDisplayOldResults;
    this.settingsService.isDisplayOldResults = this.isDisplayOldResults;
  }

  toggleOnPushNotification(){
    this.isOnPushNotification = !this.isOnPushNotification;
    this.settingsService.isOnPushNotification = this.isOnPushNotification;
  }
  
  blurExerciseType(){
    this.settingsService.exerciseTypes = this.exerciseTypes;
  }

  removeExerciseType(index: number){
    this.exerciseTypes.splice(index, 1);
    this.settingsService.exerciseTypes = this.exerciseTypes;
  }

  addExercise(){
    const newName = 'Новое упражнение';
    let countCoincidences = 0;
    do{
      countCoincidences++;
    }while(this.exerciseTypes.find(x => x.name == newName + countCoincidences));
    
    this.exerciseTypes.push(new ModelTypeExercise(newName + countCoincidences));
    this.settingsService.exerciseTypes = this.exerciseTypes;

    //scroll to bottom
    const box = document.getElementsByClassName('popup-settings__list-exercises')[0];
    box.scrollTo(0, box.scrollHeight);
  }

  connectGoogleDrive(){
    this.googleDriveService.connectDrive();
  }
  
  disconnectGoogleDrive(){
    this.googleDriveService.disconnectDrive();
  }

  getCountExercisesByType(exerciseType: ModelTypeExercise){
    return this.exerciseResultsService.exerciseResults.filter(x => x.type.uid == exerciseType.uid).length;
  }

  /** для починки ngModel внутри ngFor (устсраняет баг ангуляра) */
  trackByIndex(index: number): any {
    return index;
  }
}
