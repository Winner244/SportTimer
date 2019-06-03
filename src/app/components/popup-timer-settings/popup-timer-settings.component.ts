import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-popup-timer-settings',
  templateUrl: './popup-timer-settings.component.html',
  styleUrls: ['./popup-timer-settings.component.less']
})
export class PopupTimerSettingsComponent implements OnDestroy {

  isOpen: boolean;
  private _destroyed: Subject<any> = new Subject();

  constructor(private timerService: TimerService) { 
    this.timerService.isOpenSeettings$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.isOpen = value);
  }

  ngOnDestroy(){
    this._destroyed.next();
    this._destroyed.complete();
  }

  onClose(){
    this.timerService.closeSeettingsPopup();
  }
}
