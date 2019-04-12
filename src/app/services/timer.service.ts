import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  
  private _timer = new BehaviorSubject<Date>(new Date(0, 0, 0));

  public timer$ = this._timer.asObservable();

  constructor() { }
}
