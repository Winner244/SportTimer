import { Component, OnDestroy } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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
  isOnGoogleDrive: boolean;
  googleDriveEmail: string;
  exerciseTypes: string[];

  private _destroyed: Subject<any> = new Subject();

  constructor(private settingsService: SettingsService) { 

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
    this.exerciseTypes.push(newName + this.exerciseTypes.filter(x => x.includes(newName)).length);
    this.settingsService.exerciseTypes = this.exerciseTypes;

    //scroll to bottom
    const box = document.getElementsByClassName('popup-settings__list-exercises')[0];
    box.scrollTo(0, box.scrollHeight);
  }

  connectGoogleDrive(){
    console.log('connectGoogleDrive'); //TODO
  }
  
  disconnectGoogleDrive(){
    console.log('disconnectGoogleDrive'); //TODO
  }

  getCountExercisesByType(exerciseType){
    return 5; //TODO
  }

  /** для починки ngModel внутри ngFor (устсраняет баг ангуляра) */
  trackByIndex(index: number): any {
    return index;
  }
}
