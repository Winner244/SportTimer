import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { Helper } from '../../Helper';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.less']
})
export class TimerComponent implements OnDestroy {

  private _destroyed: Subject<any> = new Subject();

  timer = new Date(0, 0, 0);

  constructor(private timerService: TimerService) { 
    this.timerService.timer$
      .pipe(takeUntil(this._destroyed))
      .subscribe(timer => this.timer = timer);
  }

  ngOnDestroy(){
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
     * Возвращает строку таймера в формате 00:00:00.00 с запущенного таймера
     * @return {string}
     */
    get TimeString(){
      return '{0}:{1}:{2}.{3}'.format(
          Helper.twoZero(this.timer.getHours()),
          Helper.twoZero(this.timer.getMinutes()),
          Helper.twoZero(this.timer.getSeconds()),
          Helper.twoZero(parseInt((this.timer.getMilliseconds() / 10) + '')),
      );
  }
}
