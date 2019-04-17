import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { faPlay, faStop, faPause } from '@fortawesome/free-solid-svg-icons';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-timer-control',
  templateUrl: './timer-control.component.html',
  styleUrls: ['./timer-control.component.less']
})
export class TimerControlComponent implements OnDestroy {
  faPlay = faPlay;
  faStop = faStop;
  faPause = faPause;

  isTimerRunning: boolean;
  isDisabledClearButton: boolean;

  private _destroyed: Subject<any> = new Subject();

  constructor(private timerService: TimerService) {
    this.isDisabledClearButton = true;

    this.timerService.isTimerRunning$
      .pipe(takeUntil(this._destroyed))
      .subscribe(value => this.isTimerRunning = value);
  }

  ngOnDestroy(){
     this._destroyed.next();
     this._destroyed.complete();
   }
 

  start(){
    this.isDisabledClearButton = false;
    this.timerService.playTimer();
  }

  pause(){
    this.timerService.pauseTimer();
  }

  clear(){
    this.isDisabledClearButton = true;
    this.timerService.clearTimer();
  }

}
