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

  isOpen: boolean = false;
  isDisplayOldResults: boolean = true;
  isOnPushNotification: boolean = false;
  isOnGoogleDrive: boolean = false;
  googleDriveEmail: string;

  private _destroyed: Subject<any> = new Subject();

  constructor(private settingsService: SettingsService) { 
    this.settingsService.isOpen$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.isOpen = value);
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
  }

  toggleOnPushNotification(){
    this.isOnPushNotification = !this.isOnPushNotification;
  }
  

  removeExercise(exercise: string){
    console.log('removeExercise: ' + exercise);
  }

  addExercise(){
    console.log('addExercise');
  }

  connectGoogleDrive(){
    console.log('connectGoogleDrive');
  }
  
  disconnectGoogleDrive(){
    console.log('disconnectGoogleDrive');
  }
}
